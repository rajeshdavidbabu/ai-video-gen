import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceContainer } from "../../core/application/bootstrap";

export const getJobStatsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const queue = ServiceContainer.getInstance().getQueue();
    const stats = await queue.getStats();

    return reply.send({
      stats,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error getting job counts:", error);
    return reply.code(500).send({ error: "Failed to fetch job counts" });
  }
};
