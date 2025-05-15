import type { FastifyRequest, FastifyReply } from "fastify";
import { getFunctions } from "@remotion/lambda";
import { renderMediaOnLambda } from "@remotion/lambda/client";
import { z } from "zod";

const renderRequestSchema = z.object({
  imageUrls: z.array(z.string()),
  backgroundMusicUrl: z.string(),
  narrationUrl: z.string(),
  captionsUrl: z.string(),
  fontFamily: z.string().optional(),
  fontColor: z.string().optional(),
  imageEffect: z.string().optional(),
  overlay: z.string().optional(),
  transition: z.string().optional(),
  captionAlignment: z.string().optional(),
});

type RenderRequest = z.infer<typeof renderRequestSchema>;

export const directRenderHandler = async (
  request: FastifyRequest<{
    Body: RenderRequest;
  }>,
  reply: FastifyReply
) => {
  try {
    const validatedInput = renderRequestSchema.parse(request.body);

    const functions = await getFunctions({
      region: "us-east-1",
      compatibleOnly: true,
    });

    const functionName = functions[0].functionName;

    const { renderId } = await renderMediaOnLambda({
      region: "us-east-1",
      functionName,
      serveUrl:
        "https://remotionlambda-useast1-vbh18muh64.s3.us-east-1.amazonaws.com/sites/simple-video/index.html",
      composition: "SimpleVideo",
      inputProps: validatedInput,
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      framesPerLambda: 40,
      privacy: "public",
    });

    // Immediately return the URL where the video will be available
    return reply.send({
      videoUrl: `https://s3.us-east-1.amazonaws.com/remotionlambda-useast1-vbh18muh64/renders/${renderId}/out.mp4`,
      renderId,
    });
  } catch (error) {
    console.error("Render error:", error);
    return reply.code(500).send({
      error: "Failed to initiate render",
      details: error.message,
    });
  }
};
