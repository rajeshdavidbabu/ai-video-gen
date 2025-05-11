import type {
  Video,
  VideoStatus,
  VideoStep,
  VideoAssets,
  VideoError,
} from "../types/core/video.types";
import type {
  VideoFormData,
  VideoOptions,
} from "../types/core/video-formdata.types";
import {
  VideoReadModel,
  VideoWriteModel,
} from "../types/contracts/video-persistence.types";
import type { AudioGenerationInput } from "../types/contracts/service-inputs/audio-gen.types";
import type { ImageGenerationInput } from "../types/contracts/service-inputs/image-gen.types";
import type { ImageReorderingInput } from "../types/contracts/service-inputs/image-reorder.types";
import type { PromptGenerationInput } from "../types/contracts/service-inputs/prompt-gen.types";
import type { ScriptGenerationInput } from "../types/contracts/service-inputs/script-gen.types";
import type { VideoRenderInput } from "../types/contracts/service-inputs/video-render.types";
import { VALIDATION_LIMITS } from "../constants/configuration.constants";

export class VideoEntity {
  private constructor(private state: Video) {}

  static create(params: {
    jobId: string;
    formData: VideoFormData;
    options?: VideoOptions;
  }): VideoEntity {
    return new VideoEntity({
      jobId: params.jobId,
      status: "pending",
      formData: params.formData,
      options: params.options,
    });
  }

  startProcessing(step: VideoStep): VideoEntity {
    if (this.state.status === "failed" || this.state.status === "completed") {
      throw new Error(
        `Cannot start processing from ${this.state.status} status`
      );
    }

    return new VideoEntity({
      ...this.state,
      status: "processing",
      step,
    });
  }

  markAsCompleted(assets: VideoAssets): VideoEntity {
    if (this.state.status === "failed" || this.state.status === "completed") {
      throw new Error(`Cannot complete from ${this.state.status} status`);
    }

    return new VideoEntity({
      ...this.state,
      status: "completed",
      assets,
    });
  }

  markAsFailed(error: VideoError): VideoEntity {
    return new VideoEntity({
      ...this.state,
      status: "failed",
      error,
    });
  }

  // Step management
  updateStep(step: VideoStep, message?: string): VideoEntity {
    console.log(`${step}: ${message}`);

    return new VideoEntity({
      ...this.state,
      step,
      progressMessage: message,
    });
  }

  updateStatus(status: VideoStatus): VideoEntity {
    return new VideoEntity({
      ...this.state,
      status,
    });
  }

  // Asset management
  addAssets(assets: VideoAssets): VideoEntity {
    if (this.state.status === "failed") {
      throw new Error("Cannot add assets to failed video");
    }

    return new VideoEntity({
      ...this.state,
      assets,
    });
  }

  // Getters
  get jobId(): string {
    return this.state.jobId;
  }

  get status(): VideoStatus {
    return this.state.status;
  }

  get currentStep(): VideoStep | undefined {
    return this.state.step;
  }

  get options(): VideoOptions | undefined {
    return this.state.options;
  }

  get formData(): VideoFormData {
    return this.state.formData;
  }

  get assets(): VideoAssets | undefined {
    return this.state.assets;
  }

  get error(): VideoError | undefined {
    return this.state.error;
  }

  get progressMessage(): string | undefined {
    return this.state.progressMessage;
  }

  toJSON(): Video {
    return { ...this.state };
  }

  static fromReadModel(model: VideoReadModel): VideoEntity {
    return new VideoEntity({
      jobId: model.jobId,
      status: model.status,
      step: model.step,
      formData: model.formData,
      assets: model.assets,
      progressMessage: model.progressMessage,
    });
  }

  toWriteModel(): VideoWriteModel {
    return {
      jobId: this.state.jobId,
      status: this.state.status,
      step: this.state.step,
      formData: this.state.formData,
      assets: this.state.assets,
      progressMessage: this.state.progressMessage,
    };
  }

  toScriptGenerationInput(): ScriptGenerationInput {
    if (!this.formData.content.contentType) {
      throw new Error("Missing content type for script generation");
    }

    return {
      content: this.formData.content,
      style: this.formData.style,
      targetLength: this.formData.targetLength,
    };
  }

  toPromptGenerationInput(): PromptGenerationInput {
    if (!this.assets?.script) {
      throw new Error("Missing script for prompt generation");
    }

    return {
      script: this.assets.script,
      style: this.formData.style,
      numberOfImagePrompts: VALIDATION_LIMITS.NUMBER_OF_IMAGE_PROMPTS,
    };
  }

  toImageGenerationInput(): ImageGenerationInput {
    if (!this.assets?.imagePrompts?.length) {
      throw new Error("Missing image prompts for image generation");
    }

    return {
      prompts: this.assets.imagePrompts,
      style: this.formData.style,
    };
  }

  toImageReorderingInput(): ImageReorderingInput {
    if (!this.assets?.imageUrls?.length) {
      throw new Error("Missing image URLs for reordering");
    }
    if (!this.assets?.imagePrompts) {
      throw new Error("Missing image prompts for reordering");
    }
    if (!this.assets?.script) {
      throw new Error("Missing script for reordering");
    }

    return {
      imageUrls: this.assets.imageUrls,
      imagePrompts: this.assets.imagePrompts,
      script: this.assets.script,
    };
  }

  toAudioGenerationInput(): AudioGenerationInput {
    if (!this.assets?.script) {
      throw new Error("Missing script for audio generation");
    }
    if (!this.formData.voice) {
      throw new Error("Missing voice selection for audio generation");
    }

    return {
      script: this.assets.script,
      voice: this.formData.voice,
      music: this.formData.music,
      options: {
        modelId: "eleven_multilingual_v2",
        stability: 0.5,
        style: 0,
      },
    };
  }

  toVideoRenderInput(): VideoRenderInput {
    if (!this.assets?.imageUrls?.length) {
      throw new Error("Missing image URLs for video rendering");
    }
    if (!this.assets?.audioUrl) {
      throw new Error("Missing audio URL for video rendering");
    }
    if (!this.assets?.captionsUrl) {
      throw new Error("Missing captions URL for video rendering");
    }

    return {
      imageUrls: this.assets.imageUrls,
      narrationUrl: this.assets.audioUrl,
      captionsUrl: this.assets.captionsUrl,
      backgroundMusicUrl: this.assets.backgroundMusicUrl,
      fontFamily: this.formData.fontFamily,
      fontColor: this.formData.fontColor,
      overlay: this.formData.overlay,
      captionAlignment: this.formData.captionAlignment,
      imageEffect: "horizontal-pan",
      transition: "none",
      fontSize: "medium",
    };
  }
}
