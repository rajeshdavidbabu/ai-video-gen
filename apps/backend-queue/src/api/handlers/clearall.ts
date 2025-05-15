import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceContainer } from "../../core/application/bootstrap";

export const clearAllHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const queue = ServiceContainer.getInstance().getQueue();
    await queue.clearAll();

    return reply.code(200).send({
      message: "All jobs have been cleared from the queue",
    });
  } catch (error) {
    console.error("Error clearing queue:", error);
    return reply.code(500).send({
      error: "Failed to clear queue",
    });
  }
};
