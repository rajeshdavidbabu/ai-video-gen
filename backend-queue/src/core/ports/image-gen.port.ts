import type { VideoStep } from "../domain/types/core/video.types";

export interface ImageGenerationService {
  initClient(): Promise<void>;
  closeClient(): void;
  
  generate(params: {
    prompt: string;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }): Promise<{
    imageUrl: string;
    metadata?: {
      id: string;
      upscaleOptions?: Array<string>;
    };
  }>;

  upscale(params: {
    imageId: string;
    option: string;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }): Promise<{
    imageUrl: string;
  }>;

  generateAndUpscale(params: {
    prompt: string;
    styleImage?: string;
    imageIndex?: number;
    totalImages?: number;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }): Promise<{
    uri: string;
    upscaleOption?: string; // Which U1-U4 was used
  }>;
}
