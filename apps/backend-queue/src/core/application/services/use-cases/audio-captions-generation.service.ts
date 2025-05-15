import type { SpeechGenerationService } from "../../../ports/speech-gen.port";
import type { 
  AudioGenerationInput,
  AudioGenerationOptions,
  AudioGenerationResult 
} from "../../../domain/types/contracts/service-inputs/audio-gen.types";

export class AudioCaptionsGenerationService {
  constructor(private readonly speechGeneration: SpeechGenerationService) {}

  async generateAudio(params: {
    input: AudioGenerationInput;
    options: AudioGenerationOptions;
  }): Promise<void> {
    const { input, options } = params;

    try {
      await options.onProgress("audio", "Generating audio with ElevenLabs...");

      // Generate audio and captions
      const result = await this.speechGeneration.generateSpeechWithCaptions({
        text: input.script,
        voiceId: input.voice,
        options: input.options, // Using the options from input
      });

      const audioResult: AudioGenerationResult = {
        audio: result.audioBuffer,
        captions: result.captions,
      };

      await options.onProgress("audio", "Audio generation completed");
      await options.onComplete(audioResult);
    } catch (error) {
      console.error("Failed to generate audio:", error);
      throw error;
    }
  }
}
