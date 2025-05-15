import type { VideoRenderService } from "../../../ports/video-render.port";
import type { 
  VideoRenderInput,
  VideoRenderOptions,
  VideoRenderResult,
  VideoRenderProgress 
} from "../../../domain/types/contracts/service-inputs/video-render.types";

export class VideoRenderingService {
  constructor(
    private readonly videoRenderService: VideoRenderService
  ) {}

  async renderVideo(params: {
    input: VideoRenderInput;
    options: VideoRenderOptions;
  }): Promise<string> {
    const { input, options } = params;
    

    try {
      const progress: VideoRenderProgress = {
        step: "render",
        message: "Starting video rendering..."
      };
      await options.onProgress(progress);

      const { renderS3Key } = await this.videoRenderService.render({
        input,
        onProgress: async (progress) => {
          const renderProgress: VideoRenderProgress = {
            step: "render",
            message: `🎬 ${progress.message}`
          };
          await options.onProgress(renderProgress);
        }
      });

      if (!renderS3Key) {
        throw new Error("No render S3 key returned");
      }

      const result: VideoRenderResult = {
        renderS3Key
      };

      await options.onComplete(result);
      return renderS3Key;
    } catch (error) {
      console.error("Failed to render video:", error);
      throw error;
    }
  }
} 