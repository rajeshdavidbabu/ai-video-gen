import type { VideoStep } from "../../core/video.types";
import type { VideoStyle } from "../../core/video-formdata.types";

// Input for prompt generation
export type PromptGenerationInput = {
  script: string;
  style: VideoStyle;
  numberOfImagePrompts: number;
};

// Progress callback types
export type PromptGenerationProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type PromptGenerationResult = {
  prompts: string[];
};

// Options type
export type PromptGenerationOptions = {
  onProgress: (progress: PromptGenerationProgress) => Promise<void>;
  onComplete: (result: PromptGenerationResult) => Promise<void>;
};