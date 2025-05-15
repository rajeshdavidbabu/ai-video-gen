import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { env } from "../utils/env";
import type {
  ContentGenerationService,
  Message,
  ModelConfig,
} from "../ports/content-gen.port";
import {
    getMidjourneySystemPrompt,
    getReorderImagesPrompt,
    SCRIPT_FROM_PROMPT,
    MIDJOURNEY_NEGATIVE_PROMPT,
  } from "../domain/constants/prompts.constants";
import { z } from "zod";
import type { VideoStyle } from "../domain/types/core/video-formdata.types";

export class OpenAIContentGenAdapter implements ContentGenerationService {
  private client: OpenAI;

  private static readonly models = {
    GPT4o: "gpt-4o",
    GPT4o_2024: "gpt-4o-2024-08-06",
  } as const;

  private readonly prompts = {
    getMidjourneySystemPrompt,
    getReorderImagesPrompt,
    SCRIPT_FROM_PROMPT,
    MIDJOURNEY_NEGATIVE_PROMPT,
  };

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  private get models() {
    return OpenAIContentGenAdapter.models;
  }

  async generateText(params: {
    messages: Message[];
    config: ModelConfig;
  }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: params.config.model || this.models.GPT4o_2024,
      messages: params.messages,
      temperature: params.config.temperature,
      max_tokens: params.config.maxTokens,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    return content
      .replace(/^["'](.*)["']$/, "$1") // Remove surrounding quotes
      .replace(/\\"/g, '"') // Fix escaped quotes
      .trim();
  }

  async generateStructuredOutput<T>(params: {
    messages: Message[];
    config: ModelConfig;
    schema: {
      name: string;
      type: "object";
      properties: Record<string, {
        type: string;
        items?: { type: string };
      }>;
    };
  }): Promise<{ parsed: T }> {
    const zodSchema = z.object(
      Object.entries(params.schema.properties).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value.type === "array" 
          ? z.array(z.string()) // or z.number() depending on items.type
          : value.type === "string" 
            ? z.string()
            : value.type === "number"
              ? z.number()
              : z.any()
      }), {})
    );

    const completion = await this.client.beta.chat.completions.parse({
      model: params.config.model || this.models.GPT4o_2024,
      messages: params.messages,
      temperature: params.config.temperature,
      response_format: zodResponseFormat(zodSchema, params.schema.name),
      max_completion_tokens: params.config.maxTokens,
    });

    return { parsed: completion.choices[0].message.parsed as T };
  }

  getMidjourneySystemPrompt(numberOfPrompts: number, style: VideoStyle): string {
    return this.prompts.getMidjourneySystemPrompt(numberOfPrompts, style);
  }

  getReorderImagesPrompt(script: string, numberOfImages: number, imageDescriptions: string): string {
    return this.prompts.getReorderImagesPrompt(script, numberOfImages, imageDescriptions);
  }

  getScriptFromPrompt(prompt: string): string {
    return this.prompts.SCRIPT_FROM_PROMPT(prompt);
  }
}
