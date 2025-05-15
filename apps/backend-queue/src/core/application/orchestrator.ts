import type { VideoEntity } from "../domain/entities/video.entity";
import type { VideoProcessingService } from "./services/video-processing.service";
import { generateScript } from "./use-cases/generate-script.use-case";
import { generateImagePrompts } from "./use-cases/generate-image-prompts.use-case";
import { generateImages } from "./use-cases/generate-images.use-case";
import { reorderImages } from "./use-cases/reorder-images.use-case";
import { generateAudioCaptions } from "./use-cases/generate-audio-captions.use-case";
import { renderVideo } from "./use-cases/render-video.use-case";
import { PromptGenerationService } from "./services/use-cases/image-prompts-generation.service";
import { ImageGenerationFromPromptsService } from "./services/use-cases/image-generation-from-prompts.service";
import { AudioCaptionsGenerationService } from "./services/use-cases/audio-captions-generation.service";
import { ImageReorderingService } from "./services/use-cases/image-reordering.service";
import { ScriptGenerationService } from "./services/use-cases/script-generation.service";
import { VideoRenderingService } from "./services/use-cases/video-rendering.service";

type Services = {
  videoProcessing: VideoProcessingService;
  script: ScriptGenerationService;
  prompts: PromptGenerationService;
  images: ImageGenerationFromPromptsService;
  reordering: ImageReorderingService;
  audioCaptions: AudioCaptionsGenerationService;
  render: VideoRenderingService;
};

export const generateVideo = async (
  video: VideoEntity,
  services: Services
): Promise<VideoEntity> => {
  try {
    // 0. Update status to processing
    let updatedVideo = await services.videoProcessing.startProcessing("script", video);

    // 1. Generate Script
    ({ video: updatedVideo } = await generateScript(
      updatedVideo,
      services.videoProcessing,
      services.script
    ));

    // 2. Generate Image Prompts
    ({ video: updatedVideo } = await generateImagePrompts(
      updatedVideo,
      services.videoProcessing,
      services.prompts
    ));

    // 3. Generate Images
    ({ video: updatedVideo } = await generateImages(
      updatedVideo,
      services.videoProcessing,
      services.images
    ));

    // 4. Reorder Images
    ({ video: updatedVideo } = await reorderImages(
      updatedVideo,
      services.videoProcessing,
      services.reordering
    ));

    // 5. Generate Audio and Captions
    ({ video: updatedVideo } = await generateAudioCaptions(
      updatedVideo,
      services.videoProcessing,
      services.audioCaptions
    ));

    // 6. Render Final Video
    ({ video: updatedVideo } = await renderVideo(
      updatedVideo,
      services.videoProcessing,
      services.render
    ));

    // 7. Upload Poster Image
    if (
      updatedVideo.assets?.imageUrls &&
      updatedVideo.assets.imageUrls.length > 0
    ) {
      const firstImageUrl = updatedVideo.assets.imageUrls[0];
      const posterS3Key = await services.videoProcessing.uploadImageFromUrl({
        url: firstImageUrl,
        jobId: updatedVideo.jobId,
      });

      updatedVideo = updatedVideo.addAssets({
        ...updatedVideo.assets,
        posterS3Key,
      });
    }

    // Mark as completed
    updatedVideo =
      await services.videoProcessing.markVideoAsCompleted(updatedVideo);

    return updatedVideo;
  } catch (error) {
    console.error("Video generation failed:", error);
    // If somehow video is not marked as failed, mark it as failed
    if(video.status !== "failed") {
      await services.videoProcessing.markVideoAsFailed(video, {
        step: "unknown",
        code: "UNKNOWN_ERROR",
        message: "Something went wrong, please try again later",
      });
    }
    
    throw error;
  }
};

export const rerender = async (
  renderedJobId: string,
  services: Services
): Promise<VideoEntity> => {
  try {
    // 1. Get the video entity from the processing service
    const video = await services.videoProcessing.getVideoByJobId(renderedJobId);

    if (!video) {
      throw new Error(`Video not found for job ID: ${renderedJobId}`);
    }

    // 2. Validate that all required assets exist
    if (
      !video.assets?.imageUrls?.length ||
      !video.assets.audioUrl ||
      !video.assets.captionsUrl
    ) {
      throw new Error("Missing required assets for video re-rendering");
    }

    // 3. Update status to indicate re-rendering
    let updatedVideo = await services.videoProcessing.updateVideoStatus(
      video,
      "processing"
    );

    // 4. Perform the actual rendering
    ({ video: updatedVideo } = await renderVideo(
      updatedVideo,
      services.videoProcessing,
      services.render
    ));

    // 5. Mark as completed and return
    updatedVideo =
      await services.videoProcessing.markVideoAsCompleted(updatedVideo);

    return updatedVideo;
  } catch (error) {
    console.error(
      `Re-render failed for video with jobId ${renderedJobId}:`,
      error
    );

    throw error;
  }
};
