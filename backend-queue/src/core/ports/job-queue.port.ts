import type {
  VideoAssets,
  VideoError,
} from "../domain/types/core/video.types";
import type {
  VideoFormData,
  VideoOptions,
} from "../domain/types/core/video-formdata.types";
import type {
  VideoStep,
  VideoStatus,
} from "../domain/types/core/video.types";

export type JobProcessResult = {
  jobId: string;
  success: boolean;
  assets?: VideoAssets;
  error?: VideoError;
};

export type JobProgress = {
  jobId: string;
  step: VideoStep;
  message: string;
};

export type JobOptions = {
  attempts?: number;
  delay?: number;
  removeOnComplete?: {
    age?: number;
    count?: number;
  };
  removeOnFail?: {
    age?: number;
  };
};

export interface JobQueue {
  addJob(params: {
    name: string;
    data: {
      jobId: string;
      formData: VideoFormData;
      options?: VideoOptions;
    };
    options?: JobOptions;
  }): Promise<{ jobId: string }>;

  getJob(jobId: string): Promise<{
    jobId: string;
    data: {
      formData: VideoFormData;
      options?: VideoOptions;
    };
    status?: VideoStatus;
  } | null>;

  createWorker(
    processor: (job: {
      jobId: string;
      data: {
        formData: VideoFormData;
        options?: VideoOptions;
      };
      updateProgress: (progress: JobProgress) => Promise<void>;
    }) => Promise<JobProcessResult>
  ): void;

  close(): Promise<void>;
}
