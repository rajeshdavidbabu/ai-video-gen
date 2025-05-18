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

    let styleImage = Object.values(this.imagesJson)[0];
    const batches = this.createBatches(prompts, concurrency, Boolean(styleImage));

    // Track number of prompts processed for correct indexing
    let processedCount = 0;

    for (const [batchIndex, batch] of batches.entries()) {
      const offset = processedCount;
      const isFirstBatch = !styleImage && batchIndex === 0;
      const batchResults = await this.processBatch({
        batch,
        batchIndex,
        totalPrompts: prompts.length,
        options,
        styleImage: isFirstBatch ? undefined : styleImage,
        concurrency: batch.length,
        offset,
      });

      // After first batch, update style image if we didn't have one
      if (isFirstBatch && batchResults[0]?.uri) {
        console.log("First batch generated ", batchResults);
        this.imagesJson[`image1`] = batchResults[0].uri;
        styleImage = batchResults[0].uri;
      }

      // Update imagesJson with new results
      batchResults.forEach(({ index, uri }) => {
        this.imagesJson[`image${index + 1}`] = uri;
      });

      // Increment processed count
      processedCount += batch.length;

      // Notify batch completion
      await options.onBatchComplete(batchIndex, this.imagesJson);

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
    offset: number;
  }): Promise<Array<{ index: number; uri: string }>> {
    const { batch, batchIndex, totalPrompts, options, styleImage, concurrency, offset } = params;
    const startIndex = offset;

    const batchPromises = batch.map(async (prompt, index) => {
      const globalIndex = startIndex + index;
      const imageKey = `image${globalIndex + 1}`;

      if (this.imagesJson[imageKey]) {
        return { index: globalIndex, uri: this.imagesJson[imageKey] };
      }

      const progress: ImageGenerationProgress = {
        step: "image",
        message: `Batch ${batchIndex + 1} - images (Total images - ${globalIndex + 1}/${totalPrompts})`,
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

  private createBatches(prompts: string[], concurrency: number, hasStyleImage: boolean) {
    if (prompts.length === 0) return [];
    
    // If we already have a style image, use normal batching
    if (hasStyleImage) {
      return Array.from(
        { length: Math.ceil(prompts.length / concurrency) },
        (_, i) => prompts.slice(i * concurrency, (i + 1) * concurrency)
      );
    }
    
    // Otherwise, first batch is just the first prompt
    return [
      [prompts[0]],
      ...Array.from(
        { length: Math.ceil((prompts.length - 1) / concurrency) },
        (_, i) => prompts.slice(i * concurrency + 1, (i + 1) * concurrency + 1)
      ).filter(batch => batch.length > 0)
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
