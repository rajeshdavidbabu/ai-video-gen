import type { SpeechGenerationService } from "../ports/speech-gen.port";
import type { Voice } from "../domain/types/core/video-formdata.types";
import type { Captions } from "../domain/types/core/caption.types";
import { env } from "../utils/env";

export class ElevenLabsSpeechGenAdapter implements SpeechGenerationService {
  private static readonly API_BASE = "https://api.elevenlabs.io/v1";

  async generateSpeechWithCaptions(params: {
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
  }> {
    const response = await fetch(
      `${ElevenLabsSpeechGenAdapter.API_BASE}/text-to-speech/${params.voiceId}/with-timestamps`,
      {
        method: "POST",
        headers: {
          "xi-api-key": env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: params.text,
          model_id: params.options?.modelId ?? "eleven_multilingual_v2",
          voice_settings: {
            stability: params.options?.stability ?? 0.5,
            similarity_boost: 0.75,
            style: params.options?.style ?? 0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `ElevenLabs API error: ${response.status} - ${
          response.statusText
        } - ${JSON.stringify(errorData)}`
      );
    }

    const { audio_base64, alignment } = await response.json();

    return {
      audioBuffer: Buffer.from(audio_base64, "base64"),
      captions: {
        text: params.text,
        alignment,
      },
    };
  }
}
