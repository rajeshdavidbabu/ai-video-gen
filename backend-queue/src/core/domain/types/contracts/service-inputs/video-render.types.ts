import type {
  FontFamily,
  FontColor,
  Overlay,
  CaptionAlignment,
  ImageEffect,
  Transition,
  FontSize,
} from "../../core/video-formdata.types";
import type { VideoStep } from "../../core/video.types";

// Input for video rendering
export type VideoRenderInput = {
  imageUrls: string[];
  narrationUrl: string;
  captionsUrl: string;
  backgroundMusicUrl?: string;
  fontFamily: FontFamily;
  fontColor: FontColor;
  overlay: Overlay;
  captionAlignment: CaptionAlignment;
  imageEffect: ImageEffect;
  transition: Transition;
  fontSize: FontSize;
};

// Progress callback types
export type VideoRenderProgress = {
  step: VideoStep;
  message: string;
};

// Result type
export type VideoRenderResult = {
  renderS3Key: string;
};

// Options type
export type VideoRenderOptions = {
  onProgress: (progress: VideoRenderProgress) => Promise<void>;
  onComplete: (result: VideoRenderResult) => Promise<void>;
};
