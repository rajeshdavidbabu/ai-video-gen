import type { VideoEntity } from "../../domain/entities/video.entity";
import type { ImageGenerationFromPromptsService } from "../services/use-cases/image-generation-from-prompts.service";
import type { VideoProcessingService } from "../services/video-processing.service";
import { CONCURRENCY_LIMITS } from "../../domain/constants/configuration.constants";

export const generateImages = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  imageGen: ImageGenerationFromPromptsService
): Promise<{ video: VideoEntity }> => {
  try {
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "image",
      "Generating images..."
    );

    // Handle existing images from reference job passed
    const { existingImagesJson, updatedVideo: videoWithRef } =
      await videoProcessing.copyExistingImagesIfPresent(updatedVideo);
    updatedVideo = videoWithRef;

    const imageUrls = await imageGen.generateImages({
      input: {
        ...updatedVideo.toImageGenerationInput(),
        options: {
          concurrency: existingImagesJson ? CONCURRENCY_LIMITS.MIDJOURNEY_MAX_CONCURRENT_RESUMING_JOBS : CONCURRENCY_LIMITS.MIDJOURNEY_MAX_CONCURRENT_NEW_JOBS,
          delayBetweenBatches: 1000,
          existingImagesJson
        }
      },
      options: {
        onProgress: async (step, message) => {
          await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            step,
            message
          );
        },
        onComplete: async (result) => {
          await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "image",
            "Images generated successfully"
          );

          // Save final imagesJson
          await videoProcessing.saveAssetProgress({
            jobId: video.jobId,
            data: result.imagesJson,
            fileName: "images.json",
          });
        },
        onBatchComplete: async (imagesJson) => {
          // Persist partial images after this batch
          updatedVideo = updatedVideo.addAssets({
            ...updatedVideo.assets,
            imageUrls: Object.values(imagesJson),
          });

          await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "image",
            `Saving images for current batch`
          );

          await videoProcessing.saveAssetProgress({
            jobId: video.jobId,
            data: imagesJson,
            fileName: "images.json",
          });
        }
      }
    });

    // Ideally this should never happen
    if (imageUrls.length !== video.assets?.imagePrompts?.length) {
      console.error(
        `ALERT: Generated images count (${imageUrls.length}) doesn't match prompts count (${video.assets?.imagePrompts?.length}) for job ${video.jobId}`
      );
    }

    // Save assets on the Entity
    updatedVideo = updatedVideo.addAssets({
      ...updatedVideo.assets,
      imageUrls,
    });

    updatedVideo = await videoProcessing.updateAndPersistVideo(
      updatedVideo,
      "image",
      "Images generated successfully"
    );

    return { video: updatedVideo };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "image",
      code: "IMAGE_GENERATION_ERROR",
      message:
        error instanceof Error ? error.message : "Image generation failed",
    });

    throw error;
  }
};
