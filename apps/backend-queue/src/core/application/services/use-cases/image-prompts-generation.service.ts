import type { ContentGenerationService } from "../../../ports/content-gen.port";
import type { 
  PromptGenerationInput,
  PromptGenerationOptions,
  PromptGenerationResult,
  PromptGenerationProgress 
} from "../../../domain/types/contracts/service-inputs/prompt-gen.types";
import { VALIDATION_LIMITS } from "../../../domain/constants/configuration.constants";

export class PromptGenerationService {
  constructor(
    private readonly contentGeneration: ContentGenerationService,
  ) {}

  async generate(params: {
    input: PromptGenerationInput;
    options: PromptGenerationOptions;
  }): Promise<string[]> {
    const { input, options } = params;
    const { script, style, numberOfImagePrompts } = input;

    await options.onProgress({ 
      step: "midjourney-prompts", 
      message: "Generating image prompts from script..." 
    });

    console.log("systemPrompt ", this.contentGeneration.getMidjourneySystemPrompt(numberOfImagePrompts, style));

    const response = await this.contentGeneration.generateStructuredOutput<{prompts: string[]}>({
      messages: [
        {
          role: "system",
          content: this.contentGeneration.getMidjourneySystemPrompt(numberOfImagePrompts, style),
        },
        {
          role: "user",
          content: script,
        },
      ],
      schema: {
        name: "midjourneyPrompts",
        type: "object",
        properties: {
          prompts: { type: "array", items: { type: "string" } }
        }
      },
      config: {
        temperature: 0.25,
        maxTokens: 4096,
      },
    });

    const result = { prompts: response.parsed.prompts };

    console.log("result", JSON.stringify(result,null,2));
    await options.onComplete(result);
    return result.prompts;
  }
}
