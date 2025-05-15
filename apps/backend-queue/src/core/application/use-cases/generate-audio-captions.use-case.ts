import type { VideoEntity } from "../../domain/entities/video.entity";
import type { VideoProcessingService } from "../services/video-processing.service";
import type { AudioCaptionsGenerationService } from "../services/use-cases/audio-captions-generation.service";
import { MUSIC_TO_FILE_MAP } from "~/core/domain/constants/mappings.constants";

export const generateAudioCaptions = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  audioCaptionsGeneration: AudioCaptionsGenerationService
): Promise<{ video: VideoEntity }> => {
  try {
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "audio",
      "Starting audio generation..."
    );

    // Check for existing audio/captions
    const { existingAssets, updatedVideo: videoWithRef } =
      await videoProcessing.copyExistingAudioIfPresent(updatedVideo);
    updatedVideo = videoWithRef;

    let audioGenerationInput = updatedVideo.toAudioGenerationInput();

    if (!existingAssets) {
      // Generate new audio and captions
      await audioCaptionsGeneration.generateAudio({
        input: audioGenerationInput,
        options: {
          onProgress: async (step, message) => {
            updatedVideo = await videoProcessing.updateAndPersistVideo(
              updatedVideo,
              step,
              message
            );
          },
          onComplete: async ({ audio, captions }) => {
            await Promise.all([
              videoProcessing.saveAssetProgress({
                jobId: video.jobId,
                data: audio,
                fileName: "audio.mp3",
              }),
              videoProcessing.saveAssetProgress({
                jobId: video.jobId,
                data: captions,
                fileName: "captions.json",
              }),
            ]);
          },
        },
      });
    }

    // Previous steps should have saved the files on asset-store
    const filesExist = await videoProcessing.checkFilesExist({
      jobId: video.jobId,
      files: ["audio.mp3", "captions.json"],
    });

    if (!filesExist) {
      throw new Error(
        "Missing required audio or captions files, looks like generation failed"
      );
    }

    // Required to get presigned URLs so that Remotion can access them
    const [audioUrl, captionsUrl] =
      await videoProcessing.getPresignedUrlsForJob({
        jobId: video.jobId,
        files: ["audio.mp3", "captions.json"],
      });

    let musicUrl = MUSIC_TO_FILE_MAP[audioGenerationInput.music];

    if (musicUrl) {
      musicUrl = await videoProcessing.getPresignedUrl({
        file: musicUrl,
      });
    }

    // Update video entity with new assets
    updatedVideo = updatedVideo.addAssets({
      ...updatedVideo.assets,
      audioUrl,
      captionsUrl,
      backgroundMusicUrl: musicUrl,
    });

    updatedVideo = await videoProcessing.updateAndPersistVideo(
      updatedVideo,
      "audio",
      "Audio and captions generated successfully"
    );

    return { video: updatedVideo };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "audio",
      code: "AUDIO_GENERATION_ERROR",
      message:
        error instanceof Error ? error.message : "Audio generation failed",
    });

    throw error;
  }
};
