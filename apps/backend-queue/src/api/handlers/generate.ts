import { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { VideoEntity } from "../../core/domain/entities/video.entity";
import { getServices, getQueue } from "../../core/application/bootstrap";

type RequestBody = {
  videoData: unknown;
  config?: unknown;
  jobId?: string; 
};

export const generateHandler = async (
  request: FastifyRequest<{ Body: RequestBody }>,
  reply: FastifyReply
) => {
  try {
    const { videoData, config, jobId: clientProvidedJobId } = request.body;
    const services = getServices();
    const queue = getQueue();

    // Validate form data
    const formResult =  services.validator.validateForm(videoData);

    if (!formResult.success) {
      return reply.code(400).send({
        success: false,
        error: "Validation failed",
        details: formResult.error
      });
    }

    const configResult = config 
      ? services.validator.validateOptions(config)
      : undefined;
    
    if (configResult && !configResult.success) {
      return reply.code(400).send({
        success: false,
        error: "Config validation failed",
        details: configResult.error
      });
    }

    // Use client-provided jobId if available, otherwise generate one
    // Ensuring we maintain ID synchronization between frontend and backend
    const jobId = clientProvidedJobId ? clientProvidedJobId : crypto.randomUUID();
    
    console.log(`Using job ID: ${jobId}${clientProvidedJobId ? ' (client-provided)' : ' (server-generated)'}`);

    // Create video entity with validated data
    await services.videoProcessing.createPersistedVideo({
      jobId,
      formData: formResult.data,
      options: configResult?.data
    });

    // Add job to queue
    await queue.addJob({
      name: "generate",
      data: {
        jobId,
        formData: formResult.data,
        options: configResult?.data,
      },
    });

    return reply.code(202).send({
      success: true,
      jobId,
      message: "Video generation job queued successfully",
    });
  } catch (error) {
    console.error("Generate handler error:", error);

    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        error: "Validation error",
        details: error.issues,
      });
    }

    return reply.code(500).send({
      success: false,
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
