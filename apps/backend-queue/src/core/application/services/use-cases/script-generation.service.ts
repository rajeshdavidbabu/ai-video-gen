import type { ContentGenerationService } from "../../../ports/content-gen.port";
import type { 
  ScriptGenerationInput,
  ScriptGenerationOptions,
  ScriptGenerationResult, 
} from "../../../domain/types/contracts/service-inputs/script-gen.types";

export class ScriptGenerationService {
  constructor(
    private readonly contentGeneration: ContentGenerationService
  ) {}

  async generate(params: {
    input: ScriptGenerationInput;
    options: ScriptGenerationOptions;
  }): Promise<string> {
    const { input, options } = params;
    const { content, options: genOptions = {} } = input;

    await options.onProgress("script", "Generating script...");

    try {
      let response: string;
      switch (content.contentType) {
        case "prompt":
          response = await this.generateFromPrompt(content.text, genOptions);
          break;
        case "script":
          response = await this.enhanceScript(content.text, genOptions);
          break;
        default:
          throw new Error("Invalid content type");
      }

      const result: ScriptGenerationResult = {
        script: response,
      };

      await options.onComplete(result);
      return result.script;
    } catch (error) {
      console.error(`Failed to generate script for ${content.contentType}:`, error);
      throw error;
    }
  }

  private async generateFromPrompt(
    prompt: string, 
    options: NonNullable<ScriptGenerationInput["options"]>
  ): Promise<string> {
    const userPrompt = this.contentGeneration.getScriptFromPrompt(prompt);

    return this.contentGeneration.generateText({
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      config: {
        temperature: options.temperature ?? 0.4,
        maxTokens: options.maxTokens ?? 4096,
      },
    });
  }

  private async enhanceScript(
    script: string,
    options: NonNullable<ScriptGenerationInput["options"]>
  ): Promise<string> {
    return this.contentGeneration.generateText({
      messages: [
        {
          role: "user",
          content: `Please correct any grammar and spelling errors in this script while maintaining its original content: ${script}`,
        },
      ],
      config: {
        temperature: options.temperature ?? 0.3,
        maxTokens: options.maxTokens ?? 4096,
      },
    });
  }
}
