import type { ContentGenerationService } from "../../../ports/content-gen.port";
import type { 
  ImageReorderingInput,
  ImageReorderingOptions,
  ImageReorderingResult,
  ImageReorderingProgress 
} from "../../../domain/types/contracts/service-inputs/image-reorder.types";

export class ImageReorderingService {
  constructor(
    private readonly contentGeneration: ContentGenerationService
  ) {}

  async reorderImages(params: {
    input: ImageReorderingInput;
    options: ImageReorderingOptions;
  }): Promise<string[]> {
    const { input, options } = params;
    const { imageUrls, imagePrompts, script } = input;

    const progress: ImageReorderingProgress = {
      step: "reorder-images",
      message: "Analyzing script and reordering images..."
    };
    await options.onProgress(progress);

    const imageDescriptions = this.createImageDescriptions(imagePrompts);

    try {
      // Get optimal order from AI
      const response = await this.contentGeneration.generateStructuredOutput<{order: number[]}>({
        messages: [
          {
            role: "system",
            content: this.contentGeneration.getReorderImagesPrompt(
              script,
              imageUrls.length,
              imageDescriptions
            ),
          },
        ],
        schema: {
          name: "imageOrdering",
          type: "object",
          properties: {
            order: { type: "array", items: { type: "number" } }
          }
        },
        config: {
          temperature: 0.25,
          maxTokens: 2048,
        },
      });

      const order = response.parsed.order;

      if (!order || order.length !== imageUrls.length) {
        throw new Error(
          `Invalid reordering response: expected ${imageUrls.length} indices, got ${order?.length ?? 0}`
        );
      }

      // Validate and reorder images
      const reorderedUrls = this.reorderByIndices(imageUrls, order);

      // Log results for debugging
      this.logOrderingResults(imageUrls.length, order);

      const result: ImageReorderingResult = {
        reorderedUrls
      };

      await options.onComplete(result);
      return result.reorderedUrls;
    } catch (error) {
      console.error("Failed to reorder images:", error);
      throw error;
    }
  }

  private createImageDescriptions(prompts: string[]): string {
    return prompts.map((prompt, index) => `${index}. ${prompt}`).join("\n\n");
  }

  private reorderByIndices(items: string[], order: number[]): string[] {
    if (items.length !== order.length) {
      throw new Error(
        `Array length mismatch: images (${items.length}) vs order (${order.length})`
      );
    }

    return order.map((index) => {
      if (index < 0 || index >= items.length) {
        throw new Error(
          `Invalid index ${index} for array of length ${items.length}`
        );
      }
      return items[index];
    });
  }

  private logOrderingResults(originalLength: number, newOrder: number[]): void {
    console.log(
      "Original order:",
      Array.from({ length: originalLength }, (_, i) => i)
    );
    console.log("AI suggested order:", newOrder);
  }
}
