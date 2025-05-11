import type { VideoEntity } from "../../domain/entities/video.entity";
import type { VideoProcessingService } from "../services/video-processing.service";
import type { PromptGenerationService } from "../services/use-cases/image-prompts-generation.service";

export const generateImagePrompts = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  promptGeneration: PromptGenerationService
): Promise<{ video: VideoEntity }> => {
  try {
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "midjourney-prompts",
      "Generating image prompts..."
    );

    const prompts = await promptGeneration.generate({
      input: updatedVideo.toPromptGenerationInput(),
      options: {
        onProgress: async (progress) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            progress.step,
            progress.message
          );
        },
        onComplete: async (result) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "midjourney-prompts",
            "Image prompts generated successfully"
          );
        }
      }
    });

    updatedVideo = updatedVideo.addAssets({
      ...updatedVideo.assets,
      imagePrompts: prompts,
    });

    updatedVideo = await videoProcessing.updateAndPersistVideo(
      updatedVideo,
      "midjourney-prompts",
      "Image prompts generated successfully"
    );

    return {
      video: updatedVideo,
    };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "midjourney-prompts",
      code: "PROMPT_GENERATION_ERROR",
      message:
        error instanceof Error ? error.message : "Prompt generation failed",
    });

    throw error;
  }
};
