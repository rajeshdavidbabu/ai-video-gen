import type { VideoStyle } from "../domain/types/core/video-formdata.types";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ModelConfig = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export interface ContentGenerationService {
  getMidjourneySystemPrompt(numberOfPrompts: number, style: VideoStyle): string;
  getReorderImagesPrompt(script: string, numberOfImages: number, imageDescriptions: string): string;
  getScriptFromPrompt(prompt: string): string;

  generateText(params: {
    messages: Message[];
    config: ModelConfig;
  }): Promise<string>;

  generateStructuredOutput<T>(params: {
    messages: Message[];
    config: ModelConfig;
    schema: {
      name: string;
      type: "object";
      properties?: Record<string, unknown>;
      items?: unknown;
    };
  }): Promise<{ parsed: T }>;
}
