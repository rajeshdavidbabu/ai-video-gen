import type { VideoEntity } from "../../domain/entities/video.entity";
import type { ImageReorderingService } from "../services/use-cases/image-reordering.service";
import type { VideoProcessingService } from "../services/video-processing.service";

export const reorderImages = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  imageReordering: ImageReorderingService
): Promise<{ video: VideoEntity }> => {
  try {
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "reorder-images",
      "Reordering images based on script..."
    );

   await imageReordering.reorderImages({
      input: updatedVideo.toImageReorderingInput(),
      options: {
        onProgress: async (progress) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            progress.step,
            progress.message
          );
        },
        onComplete: async (result) => {
          // Update the video entity with reordered URLs
          updatedVideo = updatedVideo.addAssets({
            ...updatedVideo.assets,
            imageUrls: result.reorderedUrls,
          });

          await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "reorder-images",
            "Images reordered successfully"
          );
        },
      },
    });

    return { video: updatedVideo };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "reorder-images",
      code: "IMAGE_REORDERING_ERROR",
      message:
        error instanceof Error ? error.message : "Failed to reorder images",
    });

    throw error;
  }
};
