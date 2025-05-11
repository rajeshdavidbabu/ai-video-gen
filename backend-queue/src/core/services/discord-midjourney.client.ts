import { Midjourney, MJMessage } from "midjourney";
import { env } from "../utils/env";
import { TIMEOUT_LIMITS } from "../domain/constants/configuration.constants";

// Use timeout values from constants
const DEFAULT_INITIAL_TIMEOUT = TIMEOUT_LIMITS.MIDJOURNEY_INITIAL_TIMEOUT;
const DEFAULT_PROGRESS_TIMEOUT = TIMEOUT_LIMITS.MIDJOURNEY_PROGRESS_TIMEOUT;
export interface DiscordMidjourneyClientInterface {
  init(): Promise<void>;
  close(): void;
  imagine(
    prompt: string,
    onProgress?: (uri: string, progress?: string) => Promise<void>
  ): Promise<MJMessage>;
  upscale(params: {
    msgId: string;
    flags: number;
    customId: string;
    onProgress?: (uri: string, progress?: string) => Promise<void>;
  }): Promise<MJMessage>;
}

export class DiscordMidjourneyClient
  implements DiscordMidjourneyClientInterface
{
  private client: Midjourney;

  constructor() {
    this.client = new Midjourney({
      ServerId: env.MIDJOURNEY_SERVER_ID,
      ChannelId: env.MIDJOURNEY_CHANNEL_ID,
      SalaiToken: env.MIDJOURNEY_SALAI_TOKEN,
      Debug: env.MIDJOURNEY_DEBUG === "true",
      Ws: env.MIDJOURNEY_WS === "true",
    });
  }

  private async withTimeout<T>(
    operation: string,
    fn: (resetTimeout: () => void) => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;

      timeoutId = setTimeout(() => {
        reject(new Error(`${operation} timed out after initial period`));
      }, DEFAULT_INITIAL_TIMEOUT);

      const resetTimeout = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          reject(new Error(`${operation} timed out after progress period`));
        }, DEFAULT_PROGRESS_TIMEOUT);
      };

      fn(resetTimeout)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          clearTimeout(timeoutId);
        });
    });
  }

  async init(): Promise<void> {
    await this.client.init();
  }

  close(): void {
    this.client.Close();
  }

  async imagine(
    prompt: string,
    onProgress: (uri: string, progress?: string) => Promise<void>
  ) {
    return this.withTimeout("Generating image", async (resetTimeout) => {
      const result = await this.client.Imagine(
        prompt,
        async (uri, progress) => {
          resetTimeout();
          await onProgress(uri, progress);
        }
      );

      if (!result || !result.uri) {
        throw new Error("Image generation failed");
      }

      return result;
    });
  }

  async upscale(params: {
    msgId: string;
    flags: number;
    customId: string;
    onProgress: (uri: string, progress?: string) => Promise<void>;
  }) {
    return this.withTimeout("Upscaling image", async (resetTimeout) => {
      const result = await this.client.Custom({
        msgId: params.msgId,
        flags: params.flags,
        customId: params.customId,
        loading: async (uri, progress) => {
          resetTimeout();
          await params.onProgress(uri, progress);
        },
      });

      if (!result || !result.uri) {
        throw new Error("Upscale failed");
      }

      return result;
    });
  }
}
