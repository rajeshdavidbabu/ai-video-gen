import type { FastifyRequest, FastifyReply } from "fastify";

export const healthHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.send({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
