import { VideoEntity } from "../../domain/entities/video.entity";
import type { VideoRepository } from "../../ports/video-repository.port";
import type { AssetRepository } from "../../ports/asset-repository.port";
import type {
  VideoErrorCode,
  VideoStatus,
  VideoStep,
} from "../../domain/types/core/video.types";
import {
  VideoFormData,
  VideoOptions,
} from "../../domain/types/core/video-formdata.types";

export class VideoProcessingService {
  constructor(
    private readonly videoRepo: VideoRepository,
    private readonly assetRepo: AssetRepository
  ) {}

  // In video-processing.service.ts
  async createPersistedVideo(params: {
    jobId: string;
    formData: VideoFormData;
    options?: VideoOptions;
  }): Promise<VideoEntity> {
    const video = VideoEntity.create({
      jobId: params.jobId,
      formData: params.formData,
      options: params.options,
    });
    await this.videoRepo.create(video.toWriteModel());

    return video;
  }

  async startProcessing(step: VideoStep, video: VideoEntity): Promise<VideoEntity> {
    const processingVideo = video.startProcessing(step);

    await this.videoRepo.update(processingVideo.jobId, processingVideo.toWriteModel());

    return processingVideo;
  }

  async getVideoByJobId(jobId: string): Promise<VideoEntity | null> {
    const videoData = await this.videoRepo.findById(jobId);

    if (!videoData) {
      return null;
    }

    // Create a VideoEntity from the data
    const video = VideoEntity.create({
      jobId: videoData.jobId,
      formData: videoData.formData,
    });

    // Add assets if they exist
    if (videoData.assets) {
      return video.addAssets(videoData.assets);
    }

    return video;
  }

  async updateVideoStatus(
    video: VideoEntity,
    status: VideoStatus
  ): Promise<VideoEntity> {
    const updatedVideo = video.updateStatus(status);

    await this.videoRepo.update(
      updatedVideo.jobId,
      updatedVideo.toWriteModel()
    );

    return updatedVideo;
  }

  async updateAndPersistVideo(
    video: VideoEntity,
    step: VideoStep,
    message: string
  ): Promise<VideoEntity> {
    const updatedVideo = video.updateStep(step, message);

    // Persist both video state and current assets
    await Promise.all([
      this.videoRepo.update(updatedVideo.jobId, updatedVideo.toWriteModel()),
      this.videoRepo.updateAssets(updatedVideo.jobId, updatedVideo.assets),
    ]);

    return updatedVideo;
  }

  async markVideoAsCompleted(video: VideoEntity): Promise<VideoEntity> {
    const completedVideo = video.markAsCompleted(video.assets!);

    await Promise.all([
      this.videoRepo.update(completedVideo.jobId, completedVideo.toWriteModel()),
      this.videoRepo.updateAssets(completedVideo.jobId, completedVideo.assets),
      this.videoRepo.deductCredits(completedVideo.jobId),
    ]);

    return completedVideo;
  }

  async markVideoAsFailed(
    video: VideoEntity,
    params: {
      step: VideoStep;
      code: VideoErrorCode;
      message: string;
    }
  ): Promise<VideoEntity> {
    const failedVideo = video.markAsFailed({
      step: params.step,
      code: params.code,
      message: params.message,
    });
    await this.videoRepo.update(failedVideo.jobId, failedVideo.toWriteModel());
    await this.videoRepo.revertCredits(failedVideo.jobId);
    
    return failedVideo;
  }

  async copyExistingImagesIfPresent(video: VideoEntity): Promise<{
    existingImagesJson: Record<string, string> | null;
    updatedVideo: VideoEntity;
  }> {
    let currentVideo = video;

    try {
      if (!video.options?.referenceJobId?.images) {
        return { existingImagesJson: null, updatedVideo: currentVideo };
      }

      const existingImagesJsonKey = `${video.options.referenceJobId.images}/images.json`;
      const hasExistingImages = await this.assetRepo.checkIfFileExists(
        existingImagesJsonKey
      );

      if (!hasExistingImages) {
        return { existingImagesJson: null, updatedVideo: currentVideo };
      }

      // Copy the file first
      await this.assetRepo.copyFile({
        sourceKey: existingImagesJsonKey,
        destinationKey: `${video.jobId}/images.json`,
        preserveContentType: true,
      });

      // Get the existing images json
      const existingImagesJson = await this.assetRepo.getJsonFile<
        Record<string, string>
      >(`${video.jobId}/images.json`);

      return {
        existingImagesJson,
        updatedVideo: currentVideo,
      };
    } catch (error) {
      console.error(
        "Failed to copy existing images from reference job, will generate images from scratch",
        error
      );
      return { existingImagesJson: null, updatedVideo: currentVideo };
    }
  }

  async saveAssetProgress(params: {
    jobId: string;
    data: Buffer | Record<string, unknown>;
    fileName: string;
  }): Promise<void> {
    try {
      const key = `${params.jobId}/${params.fileName}`;
      const body = Buffer.isBuffer(params.data)
        ? params.data
        : Buffer.from(JSON.stringify(params.data, null, 2));

      await this.assetRepo.uploadFile({
        key,
        body,
        contentType: "application/octet-stream",
      });
    } catch (error) {
      console.error(`Failed to save ${params.fileName}:`, error);
      throw error;
    }
  }

  async copyExistingAudioIfPresent(video: VideoEntity): Promise<{
    existingAssets: { audioUrl: string; captionsUrl: string } | null;
    updatedVideo: VideoEntity;
  }> {
    let currentVideo = video;

    try {
      if (!video.options?.referenceJobId?.audio) {
        return { existingAssets: null, updatedVideo: currentVideo };
      }

      currentVideo = await this.updateAndPersistVideo(
        currentVideo,
        "audio",
        "Checking reference audio..."
      );

      const referenceJobId = video.options.referenceJobId.audio;

      // Check if both files exist
      const [hasAudio, hasCaptions] = await Promise.all([
        this.assetRepo.checkIfFileExists(`${referenceJobId}/audio.mp3`),
        this.assetRepo.checkIfFileExists(`${referenceJobId}/captions.json`),
      ]);

      if (!hasAudio || !hasCaptions) {
        return { existingAssets: null, updatedVideo: currentVideo };
      }

      // Copy both files
      await Promise.all([
        this.assetRepo.copyFile({
          sourceKey: `${referenceJobId}/audio.mp3`,
          destinationKey: `${video.jobId}/audio.mp3`,
          preserveContentType: true,
        }),
        this.assetRepo.copyFile({
          sourceKey: `${referenceJobId}/captions.json`,
          destinationKey: `${video.jobId}/captions.json`,
          preserveContentType: true,
        }),
      ]);

      currentVideo = await this.updateAndPersistVideo(
        currentVideo,
        "audio",
        "Reference audio copied successfully"
      );

      return {
        existingAssets: {
          audioUrl: `${video.jobId}/audio.mp3`,
          captionsUrl: `${video.jobId}/captions.json`,
        },
        updatedVideo: currentVideo,
      };
    } catch (error) {
      console.error(
        "Failed to copy existing audio, will generate new audio",
        error
      );
      return { existingAssets: null, updatedVideo: currentVideo };
    }
  }

  async checkFilesExist(params: {
    jobId: string;
    files: string[];
  }): Promise<boolean> {
    const { jobId, files } = params;

    const checks = await Promise.all(
      files.map((file) => this.assetRepo.checkIfFileExists(`${jobId}/${file}`))
    );

    const missingFiles = files.filter((_, index) => !checks[index]);
    if (missingFiles.length > 0) {
      return false;
    }

    return true;
  }

  async uploadImageFromUrl(params: {
    url: string;
    jobId: string;
  }): Promise<string> {
    const posterS3Key = await this.assetRepo.uploadImageFromUrl(params);

    return posterS3Key;
  }

  async getPresignedUrl(params: { file: string }): Promise<string> {
    return this.assetRepo.getPresignedUrl(`${params.file}`);
  }

  async getPresignedUrlsForJob(params: {
    jobId: string;
    files: string[];
  }): Promise<string[]> {
    const { jobId, files } = params;

    return Promise.all(
      files.map((file) => this.assetRepo.getPresignedUrl(`${jobId}/${file}`))
    );
  }
}
