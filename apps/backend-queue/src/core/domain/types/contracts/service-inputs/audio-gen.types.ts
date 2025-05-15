import type { VideoStep } from "../../core/video.types";
import type { Captions } from "../../core/caption.types";
import type { VideoBgMusic, Voice } from "../../core/video-formdata.types";

// Input for audio generation
export type AudioGenerationInput = {
  script: string;
  voice: Voice;
  music: VideoBgMusic;
  options: {
    modelId: string;
    stability: number;
    style: number;
  };
};

// Progress callback types
export type AudioGenerationProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type AudioGenerationResult = {
  audio: Buffer;
  captions: Captions;
};

// Options type
export type AudioGenerationOptions = {
  onProgress: (step: VideoStep, message: string) => Promise<void>;
  onComplete: (result: AudioGenerationResult) => Promise<void>;
}; 