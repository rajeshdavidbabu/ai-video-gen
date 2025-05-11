import type { ImageGenerationService } from "../ports/image-gen.port";
import type { VideoStep } from "../domain/types/core/video.types";
import type { DiscordMidjourneyClient } from "../services/discord-midjourney.client";
import { env } from "../utils/env";

export class MidjourneyImageGenAdapter implements ImageGenerationService {
  constructor(private readonly midjourneyClient: DiscordMidjourneyClient) {}

  async initClient(): Promise<void> {
    await this.midjourneyClient.init();
  }

  closeClient(): void {
    this.midjourneyClient.close();
  }

  async generate(params: {
    prompt: string;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }) {
    const result = await this.midjourneyClient.imagine(
      params.prompt,
      async (uri, progress) => {
        await params.onProgress({
          step: "image",
          message: `Generating image ${progress}`,
        });
      }
    );

    if (!result.id) {
      throw new Error("Image generation failed: Missing ID");
    }

    return {
      imageUrl: result.uri,
      metadata: {
        id: result.id,
        upscaleOptions: result.options?.map((opt) => opt.custom),
      },
    };
  }

  async upscale(params: {
    imageId: string;
    flags: number;
    option: string;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }) {
    const result = await this.midjourneyClient.upscale({
      msgId: params.imageId,
      flags: params.flags,
      customId: params.option,
      onProgress: async (uri, progress) => {
        await params.onProgress({
          step: "image",
          message: `Upscaling image ${progress}`,
        });
      },
    });

    return {
      imageUrl: result.uri,
    };
  }

  async generateAndUpscale(params: {
    prompt: string;
    styleImage?: string;
    imageIndex?: number;
    totalImages?: number;
    onProgress: (progress: {
      step: VideoStep;
      message: string;
    }) => Promise<void>;
  }) {
    const options = {
      negativePrompt: env.MIDJOURNEY_NEGATIVE_PROMPT,
      aspectRatio: env.MIDJOURNEY_ASPECT_RATIO,
      version: env.MIDJOURNEY_VERSION,
      style: env.MIDJOURNEY_STYLE,
    };
    const fullPrompt = params.styleImage
      ? `${params.prompt} --sref ${params.styleImage} ${options.aspectRatio} ${options.version} ${options.negativePrompt} ${options.style}`
      : `${params.prompt} ${options.aspectRatio} ${options.version} ${options.negativePrompt} ${options.style}`;

    const generateResult = await this.midjourneyClient.imagine(
      fullPrompt,
      async (uri, progress) => {
        await params.onProgress({
          step: "image",
          message: `Generating image ${params.imageIndex}/${params.totalImages} : ${progress}`,
        });
      }
    );

    const upscaleOption = `U${Math.floor(Math.random() * 4) + 1}`;
    const upscaleCustomID = generateResult.options?.find(
      (o) => o.label === upscaleOption
    )?.custom;

    if (!upscaleCustomID) {
      throw new Error(`No ${upscaleOption} option available`);
    }

    if (!generateResult.id) {
      throw new Error("Image generation failed: Missing ID");
    }

    const upscaleResult = await this.midjourneyClient.upscale({
      msgId: generateResult.id,
      flags: generateResult.flags,
      customId: upscaleCustomID,
      onProgress: async (uri, progress) => {
        await params.onProgress({
          step: "image",
          message: `Upscaling image ${params.imageIndex}/${params.totalImages} : ${progress}`,
        });
      },
    });

    return {
      uri: upscaleResult.uri,
      upscaleOption,
    };
  }
}
