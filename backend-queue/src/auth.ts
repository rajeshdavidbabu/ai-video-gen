import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const auth: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request, reply) => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    const authHeader = request.headers.authorization;
    const apiKey = process.env.API_KEY;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply
        .code(401)
        .send({ error: "Missing or invalid Authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (token !== apiKey) {
      reply.code(403).send({ error: "Invalid API key" });
      return;
    }
  });
};

export default fp(auth);
