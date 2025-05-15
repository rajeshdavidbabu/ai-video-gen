import type { VideoRenderInput } from "../domain/types/contracts/service-inputs/video-render.types";
import type { VideoStep } from "../domain/types/core/video.types";

export interface VideoRenderService {
  render(params: {
    input: VideoRenderInput;
    onProgress?: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }): Promise<{
    renderS3Key: string;
  }>;
}
