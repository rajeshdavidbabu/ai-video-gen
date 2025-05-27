import { getFunctions, type AwsRegion } from "@remotion/lambda";
import {
  renderMediaOnLambda,
  getRenderProgress,
} from "@remotion/lambda/client";
import type { VideoRenderService } from "../ports/video-render.port";
import type { VideoStep } from "../domain/types/core/video.types";
import type { VideoRenderInput } from "../domain/types/contracts/service-inputs/video-render.types";
import { env } from "../utils/env";

export class RemotionVideoRenderAdapter implements VideoRenderService {
  private async initializeLambdaRender(input: VideoRenderInput) {
    const functions = await getFunctions({
      region: env.S3_BUCKET_REGION as AwsRegion,
      compatibleOnly: true,
    });

    if (!functions.length) {
      throw new Error("No compatible Lambda functions found");
    }

    const { renderId } = await renderMediaOnLambda({
      region: env.S3_BUCKET_REGION as AwsRegion,
      functionName: functions[0].functionName,
      serveUrl: env.REMOTION_SERVER_URL,
      composition: "SimpleVideo",
      inputProps: input,
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      privacy: "private",
      logLevel: "verbose",
      concurrencyPerLambda: 1,
    });

    if (!renderId) {
      throw new Error("Failed to get renderId from Remotion");
    }

    return { renderId, functionName: functions[0].functionName };
  }

  private async monitorRenderProgress(params: {
    renderId: string;
    functionName: string;
    onProgress: (progress: { step: VideoStep; message: string }) => Promise<void>;
  }) {
    let progress = 0;
    while (progress < 1) {
      const renderProgress = await getRenderProgress({
        renderId: params.renderId,
        bucketName: env.REMOTION_BUCKET_NAME,
        functionName: params.functionName,
        region: env.S3_BUCKET_REGION as AwsRegion,
      });

      progress = renderProgress.overallProgress;
      await params.onProgress({
        step: "render",
        message: `Rendering video: ${Math.round(progress * 100)}%`
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Return the S3 key instead of the full URL
    return `renders/${params.renderId}/out.mp4`;
  }

  async render(params: {
    input: VideoRenderInput;
    onProgress: (progress: { step: VideoStep; message: string }) => Promise<void>;
  }): Promise<{ renderS3Key: string }> { // Renamed from renderUrl to renderS3Key
    try {
      const { renderId, functionName } = await this.initializeLambdaRender(
        params.input
      );

      const renderS3Key = await this.monitorRenderProgress({
        renderId,
        functionName,
        onProgress: params.onProgress,
      });

      return { renderS3Key };
    } catch (error) {
      throw new Error(
        `Video rendering failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
