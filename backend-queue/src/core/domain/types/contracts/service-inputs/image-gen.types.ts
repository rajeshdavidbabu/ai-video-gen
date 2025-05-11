import type { VideoStep } from "../../core/video.types";
import type { VideoStyle } from "../../core/video-formdata.types";

// Input for image generation
export type ImageGenerationInput = {
  prompts: string[];
  style: VideoStyle;
  options?: {
    existingImagesJson: Record<string, string> | null;
    concurrency?: number;
    delayBetweenBatches?: number;
  };
};

// Progress callback types
export type ImageGenerationProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type ImageGenerationResult = {
  imagesJson: Record<string, string>;
};

// Options type
export type ImageGenerationOptions = {
  onProgress: (step: VideoStep, message: string) => Promise<void>;
  onComplete: (result: ImageGenerationResult) => Promise<void>;
  onBatchComplete: (batchResults: Record<string, string>) => Promise<void>;
};