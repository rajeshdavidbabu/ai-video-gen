import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceContainer } from "../../core/application/bootstrap";

export const statusHandler = async (
  request: FastifyRequest<{
    Params: { jobId: string };
  }>,
  reply: FastifyReply
) => {
  const { jobId } = request.params;
  const queue = ServiceContainer.getInstance().getQueue();

  const { state, result } = await queue.getJobStatus(jobId);

  return reply.send({ jobId, state, result });
};
