import type { VideoStatus, VideoStep, VideoAssets } from "../core/video.types";
import type { VideoFormData } from "../core/video-formdata.types";

// Write models (what we save to DB)
export type VideoWriteModel = {
  jobId: string;
  status: VideoStatus;
  step?: VideoStep;
  formData: VideoFormData;
  creditsUsed?: number;
  progressMessage?: string;
  assets?: VideoAssets;
};

// Read models (what we get from DB)
export type VideoReadModel = {
  jobId: string;
  status: VideoStatus;
  step?: VideoStep;
  formData: VideoFormData;
  creditsUsed: number;
  progressMessage?: string;
  assets?: VideoAssets;
};
