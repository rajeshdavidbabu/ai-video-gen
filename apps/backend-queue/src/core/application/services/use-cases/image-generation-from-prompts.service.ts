import type { ImageGenerationService } from "../../../ports/image-gen.port";
import type {
  ImageGenerationInput,
  ImageGenerationOptions,
  ImageGenerationProgress,
} from "../../../domain/types/contracts/service-inputs/image-gen.types";

export class ImageGenerationFromPromptsService {
  private imagesJson: Record<string, string> = {};

  constructor(private readonly imageGeneration: ImageGenerationService) {}

  async generateImages(params: {
    input: ImageGenerationInput;
    options: ImageGenerationOptions;
  }): Promise<string[]> {
    const { input, options } = params;
    const { prompts, style, options: genOptions } = input;

    const concurrency = genOptions?.concurrency ?? 1;
    const delayBetweenBatches = genOptions?.delayBetweenBatches ?? 1000;

    // Initialize with existing images if provided
    this.imagesJson = {
      ...(genOptions?.existingImagesJson
        ? genOptions.existingImagesJson
        : {}),
    };

    const batches = this.createBatches(prompts, concurrency);
    const styleImage = Object.values(this.imagesJson)[0];

    for (const [batchIndex, batch] of batches.entries()) {
      const batchResults = await this.processBatch({
        batch,
        batchIndex,
        totalPrompts: prompts.length,
        options,
        styleImage,
        concurrency,
      });

      // Update imagesJson with new results
      batchResults.forEach(({ index, uri }) => {
        this.imagesJson[`image${index + 1}`] = uri;
      });

      // Notify batch completion
      await options.onBatchComplete(this.imagesJson);

      if (batchIndex < batches.length - 1) {
        await this.delay(delayBetweenBatches);
      }
    }

    await options.onComplete({ imagesJson: this.imagesJson });

    return Object.values(this.imagesJson);
  }

  private async processBatch(params: {
    batch: string[];
    batchIndex: number;
    totalPrompts: number;
    options: ImageGenerationOptions;
    styleImage?: string;
    concurrency: number;
  }): Promise<Array<{ index: number; uri: string }>> {
    const { batch, batchIndex, totalPrompts, options, styleImage, concurrency } = params;
    const startIndex = batchIndex * concurrency;

    const batchPromises = batch.map(async (prompt, index) => {
      const globalIndex = startIndex + index;
      const imageKey = `image${globalIndex + 1}`;

      if (this.imagesJson[imageKey]) {
        return { index: globalIndex, uri: this.imagesJson[imageKey] };
      }

      const progress: ImageGenerationProgress = {
        step: "image",
        message: `Generating image ${globalIndex + 1}/${totalPrompts}`,
      };
      await options.onProgress(progress.step, progress.message);

      const result = await this.imageGeneration.generateAndUpscale({
        prompt,
        styleImage,
        imageIndex: globalIndex + 1,
        totalImages: totalPrompts,
        onProgress: async (progress) => {
          await options.onProgress(progress.step, progress.message);
        },
      });

      return { index: globalIndex, uri: result.uri };
    });

    return Promise.all(batchPromises);
  }

  private createBatches(prompts: string[], concurrency: number): string[][] {
    return Array.from(
      { length: Math.ceil(prompts.length / concurrency) },
      (_, i) => prompts.slice(i * concurrency, (i + 1) * concurrency)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
