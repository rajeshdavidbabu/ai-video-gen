import { z } from "zod";
import type { FormValidator, ValidationResult } from "../ports/form-validator.port";
import type { VideoError } from "../domain/types/core/video.types";
import { VALIDATION_LIMITS } from "../domain/constants/configuration.constants";
import {
  videoFormDataSchema,
  videoOptionsSchema,
  videoStyleSchema,
  topicSchema,
} from "../services/generated/video-formdata.schema";
import { ContentUnion } from "../domain/types/core/video-formdata.types";

// Infer types from schemas
type VideoFormData = z.infer<typeof videoFormDataSchema>;
type VideoOptions = z.infer<typeof videoOptionsSchema>;
type VideoStyle = z.infer<typeof videoStyleSchema>;
    
export class ZodFormValidator implements FormValidator {
  readonly limits = VALIDATION_LIMITS;

  private createError(message: string): VideoError {
    return {
      code: "VALIDATION_ERROR",
      step: "script",
      message,
    };
  }

  private createSuccess<T>(data: T): ValidationResult<T> {
    return { success: true, data };
  }

  private createFailure(message: string): ValidationResult<never> {
    return {
      success: false,
      error: this.createError(message)
    };
  }

  validateForm(data: unknown): ValidationResult<VideoFormData> {
    const result = videoFormDataSchema.safeParse(data);
    return result.success 
      ? this.createSuccess(result.data)
      : this.createFailure(result.error.message);
  }

  validateOptions(data: unknown): ValidationResult<VideoOptions> {
    const result = videoOptionsSchema.safeParse(data);
    return result.success 
      ? this.createSuccess(result.data)
      : this.createFailure(result.error.message);
  }

  validatePrompt(text: string): ValidationResult<string> {
    if (!text.trim()) {
      return this.createFailure("Prompt cannot be empty");
    }
    if (text.length > this.limits.PROMPT_MAX_LENGTH) {
      return this.createFailure(`Prompt cannot exceed ${this.limits.PROMPT_MAX_LENGTH} characters`);
    }
    return this.createSuccess(text.trim());
  }

  validateScript(text: string): ValidationResult<string> {
    if (!text.trim()) {
      return this.createFailure("Script cannot be empty");
    }
    if (text.length > this.limits.SCRIPT_MAX_LENGTH) {
      return this.createFailure(`Script cannot exceed ${this.limits.SCRIPT_MAX_LENGTH} characters`);
    }
    return this.createSuccess(text.trim());
  }

  validateStyle(style: unknown): ValidationResult<VideoStyle> {
    const result = videoStyleSchema.safeParse(style);
    return result.success 
      ? this.createSuccess(result.data)
      : this.createFailure("Invalid style");
  }

  validateContent(params: {
    type: ContentUnion["contentType"];
    content: unknown;
  }): ValidationResult<ContentUnion> {
    const contentSchema = z.object({
      contentType: z.literal(params.type),
      text: params.type === "topic" 
        ? z.undefined()
        : z.string().min(1).max(
            params.type === "prompt" 
              ? VALIDATION_LIMITS.PROMPT_MAX_LENGTH 
              : VALIDATION_LIMITS.SCRIPT_MAX_LENGTH
          ),
      selectedTopic: params.type === "topic"
        ? topicSchema.nullable()
        : z.undefined(),
    });
  
    const result = contentSchema.refine(
      (data) => data.contentType === params.type,
      "Content type mismatch"
    ).safeParse(params.content);
    
    return result.success
      ? this.createSuccess(result.data as ContentUnion)
      : this.createFailure(`Invalid ${params.type} content`);
  }
}