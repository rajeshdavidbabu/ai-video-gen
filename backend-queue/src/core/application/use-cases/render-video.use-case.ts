import type { VideoEntity } from "../../domain/entities/video.entity";
import type { VideoProcessingService } from "../services/video-processing.service";
import type { VideoRenderingService } from "../services/use-cases/video-rendering.service";

export const renderVideo = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  videoRendering: VideoRenderingService
): Promise<{ video: VideoEntity }> => {
  try {
    // Initial state update
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "render",
      "Starting video render..."
    );

    // Validate required assets
    if (!updatedVideo.assets?.imageUrls?.length || 
        !updatedVideo.assets.audioUrl || 
        !updatedVideo.assets.captionsUrl) {
      throw new Error("Missing required assets for video rendering");
    }

    // Render the video with progress updates
    const renderS3Key = await videoRendering.renderVideo({
      input: updatedVideo.toVideoRenderInput(),
      options: {
        onProgress: async (progress) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            progress.step,
            progress.message
          );
        },
        onComplete: async (renderS3Key) => {
          await videoProcessing.saveAssetProgress({
            jobId: video.jobId,
            data: { renderS3Key },
            fileName: "render.json",
          });
        }
      }
    });

    console.log("Render S3 Key: ", renderS3Key);

    // Save render S3 key to video assets
    updatedVideo = updatedVideo.addAssets({
      ...updatedVideo.assets,
      renderS3Key
    });

    // Mark as completed
    updatedVideo = await videoProcessing.updateAndPersistVideo(
      updatedVideo,
      "render",
      "Video rendering completed"
    );

    return { video: updatedVideo };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "render",
      code: "VIDEO_RENDERING_ERROR",
      message:
        error instanceof Error ? error.message : "Video rendering failed",
    });
    
    console.error("Error in renderVideo:", error);
    throw error;
  }
};