import type { 
  VideoStyle, 
  VideoLength,
  ContentUnion
} from "../../core/video-formdata.types";
import type { VideoStep } from "../../core/video.types";

// Input for script generation
export type ScriptGenerationInput = {
  content: ContentUnion;
  style: VideoStyle;
  targetLength: VideoLength;
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
};

// Progress callback types
export type ScriptGenerationProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type ScriptGenerationResult = {
  script: string;
};

// Options type
export type ScriptGenerationOptions = {
  onProgress: (step: VideoStep, message: string) => Promise<void>;
  onComplete: (result: ScriptGenerationResult) => Promise<void>;
}; 