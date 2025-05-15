import type { VideoFormData, VideoOptions } from "./video-formdata.types";

export type VideoStatus = "pending" | "processing" | "completed" | "failed";

export type VideoStep =
  | "waiting"
  | "script"
  | "midjourney-prompts"
  | "image"
  | "audio"
  | "assets"
  | "render"
  | "reorder-images"
  | "unknown";

export type VideoAssets = {
  imageUrls?: string[];
  audioUrl?: string;
  captionsUrl?: string;
  backgroundMusicUrl?: string;
  renderS3Key?: string;
  script?: string;
  imagePrompts?: string[];
  posterS3Key?: string;
  cloudfrontPosterUrl?: string;
};

export type VideoErrorCode =
  | "SCRIPT_GENERATION_ERROR"
  | "PROMPT_GENERATION_ERROR"
  | "IMAGE_GENERATION_ERROR"
  | "AUDIO_GENERATION_ERROR"
  | "RENDER_ERROR"
  | "SYSTEM_ERROR"
  | "VALIDATION_ERROR"
  | "IMAGE_REORDERING_ERROR"
  | "JOB_STALLED"
  | "VIDEO_RENDERING_ERROR"
  | "UNKNOWN_ERROR";

export type VideoError = {
  code: VideoErrorCode;
  step: VideoStep;
  message: string;
  context?: Record<string, unknown>;
};

// Main Video type
export type Video = {
  readonly jobId: string;
  status: VideoStatus;
  step?: VideoStep;
  formData: VideoFormData;
  assets?: VideoAssets;
  error?: VideoError;
  progressMessage?: string;
  options?: VideoOptions;
};
