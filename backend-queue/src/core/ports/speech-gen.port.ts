import type { Voice } from "../domain/types/core/video-formdata.types";
import type { Captions } from "../domain/types/core/caption.types";

export interface SpeechGenerationService {
  generateSpeechWithCaptions(params: {
    text: string;
    voiceId: Voice;
    options?: {
      modelId?: string;
      stability?: number;
      style?: number;
    };
  }): Promise<{
    audioBuffer: Buffer;
    captions: Captions;
  }>;
}
