import type { VideoEntity } from "../../domain/entities/video.entity";
import type { VideoProcessingService } from "../services/video-processing.service";
import type { ScriptGenerationService } from "../services/use-cases/script-generation.service";

export const generateScript = async (
  video: VideoEntity,
  videoProcessing: VideoProcessingService,
  scriptGeneration: ScriptGenerationService
): Promise<{ video: VideoEntity }> => {
  try {
    let updatedVideo = await videoProcessing.updateAndPersistVideo(
      video,
      "script",
      "Generating script..."
    );

    const script = await scriptGeneration.generate({
      input: updatedVideo.toScriptGenerationInput(),
      options: {
        onProgress: async (step, message) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "script",
            message
          );
        },
        onComplete: async (script) => {
          updatedVideo = await videoProcessing.updateAndPersistVideo(
            updatedVideo,
            "script",
            "Script generated successfully"
          );
        }
      }
    });

    console.log("Script generated successfully", script);

    // TODO: Save the generated script in DB may be in the future
    updatedVideo = updatedVideo.addAssets({
      ...updatedVideo.assets,
      script,
    });

    updatedVideo = await videoProcessing.updateAndPersistVideo(
      updatedVideo,
      "script",
      "Script generated successfully"
    );

    return {
      video: updatedVideo,
    };
  } catch (error) {
    await videoProcessing.markVideoAsFailed(video, {
      step: "script",
      code: "SCRIPT_GENERATION_ERROR",
      message:
        error instanceof Error ? error.message : "Script generation failed",
    });

    throw error;
  }
};
