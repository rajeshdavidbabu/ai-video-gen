import { FastifyRequest, FastifyReply } from "fastify";
import { z, ZodError } from "zod";
import { getQueue, getServices } from "../../core/application/bootstrap";

const rerenderRequestSchema = z.object({
  jobId: z.string(),
});

type RerenderRequest = z.infer<typeof rerenderRequestSchema>;

export const rerenderHandler = async (
  request: FastifyRequest<{
    Body: RerenderRequest;
  }>,
  reply: FastifyReply
) => {
  try {
    const { jobId: renderedJobId } = rerenderRequestSchema.parse(request.body);

    console.log("Rerendering job id: ", renderedJobId);

    const queue = getQueue();
    const services = getServices();

    const jobId = crypto.randomUUID();

    let video = await services.videoProcessing.getVideoByJobId(renderedJobId);
    if (!video) {
      throw new Error(`Video not found for job ID: ${renderedJobId}`);
    }
    video = await services.videoProcessing.updateVideoStatus(video, "pending");
    video = await services.videoProcessing.updateAndPersistVideo(video, "render", "Waiting to re-render...");

    await queue.addJob({
      name: "rerender",
      data: {
        jobId,
        renderedJobId,
      },
    });

    return reply.code(202).send({
      success: true,
      jobId,
      message: "Video re-render job queued successfully",
    });
  } catch (error) {
    console.error("Re-render handler error:", error);

    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        error: "Invalid request",
        message: error.errors,
      });
    }

    return reply.code(500).send({
      success: false,
      error: "Internal server error",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
