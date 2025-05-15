import type { VideoStep, VideoErrorCode } from '../types/core/video.types';

export class VideoError {
  private constructor(
    private readonly message: string,
    private readonly step: VideoStep,
    private readonly code: VideoErrorCode,
    private readonly context?: Record<string, unknown>
  ) {}

  static create(params: {
    message: string,
    step: VideoStep,
    code: VideoErrorCode,
    context?: Record<string, unknown>
  }): VideoError {
    return new VideoError(
      params.message,
      params.step,
      params.code,
      params.context
    );
  }

  get properties() {
    return {
      message: this.message,
      step: this.step,
      code: this.code,
      context: this.context
    };
  }
}
