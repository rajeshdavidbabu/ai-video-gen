import type { VideoStep } from "../../core/video.types";

// Input for image reordering
export type ImageReorderingInput = {
  imageUrls: string[];
  imagePrompts: string[];
  script: string;
};

// Progress callback types
export type ImageReorderingProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type ImageReorderingResult = {
  reorderedUrls: string[];
};

// Options type
export type ImageReorderingOptions = {
  onProgress: (progress: ImageReorderingProgress) => Promise<void>;
  onComplete: (result: ImageReorderingResult) => Promise<void>;
};