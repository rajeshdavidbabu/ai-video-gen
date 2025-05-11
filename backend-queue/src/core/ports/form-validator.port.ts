// core/ports/validation/form-validator.port.ts
import type { 
    VideoFormData, 
    VideoOptions,
    VideoStyle, 
    ContentUnion
  } from '../domain/types/core/video-formdata.types';
  import type { VideoError } from '../domain/types/core/video.types';
  import { VALIDATION_LIMITS } from '../domain/constants/configuration.constants';
  
  export type ValidationResult<T> = {
    success: true;
    data: T;
  } | {
    success: false;
    error: VideoError;
  };
  
  export interface FormValidator {
    // Main form validation
    validateForm(data: unknown): ValidationResult<VideoFormData>;
    
    // Config/options validation
    validateOptions(data: unknown): ValidationResult<VideoOptions>;
    
    // Individual field validations
    validatePrompt(text: string): ValidationResult<string>;
    validateScript(text: string): ValidationResult<string>;
    validateStyle(style: unknown): ValidationResult<VideoStyle>;
    validateContent(content: unknown): ValidationResult<ContentUnion>;  
    // Constants (readonly to prevent modification)
    readonly limits: typeof VALIDATION_LIMITS;
  }