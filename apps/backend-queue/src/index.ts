import Fastify from "fastify";
import cors from "@fastify/cors";
import { generateHandler } from "./api/handlers/generate";
import { statusHandler } from "./api/handlers/status";
import { healthHandler } from "./api/handlers/health";
import { clearAllHandler } from "./api/handlers/clearall";
import { getJobStatsHandler } from "./api/handlers/stats";
import { directRenderHandler } from "./api/handlers/direct-render";
import { ServiceContainer } from "./core/application/bootstrap";
import dotenv from "dotenv";
import auth from "./auth";
import { rerenderHandler } from "./api/handlers/rerender";

dotenv.config();

const start = async () => {
  try {
    const fastify = Fastify({
      logger: {
        level: "info",
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
      },
    });

    // Initialize ServiceContainer
    const container = ServiceContainer.initialize(fastify);

    // Register plugins
    await fastify.register(cors);
    await fastify.register(auth);

    // Health check endpoint
    fastify.get("/health", healthHandler);

    // Group all API routes
    fastify.register(
      async (fastify) => {
        // GET endpoints
        fastify.get("/status/:jobId", statusHandler);
        fastify.get("/stats", getJobStatsHandler);

        // POST endpoints
        fastify.post("/generate", generateHandler);
        fastify.post("/direct-render", directRenderHandler);
        fastify.post("/clearall", clearAllHandler);
        fastify.post("/rerender", rerenderHandler);
      },
      { prefix: "/api" }
    );

    // Root route
    fastify.get("/", (request, reply) => {
      reply.send("Hello World");
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      try {
        await container.shutdown();
        await fastify.close();
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Register shutdown handlers
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: "::",
    });
    console.log(
      `🚀 Server is running on http://localhost:${process.env.PORT || 3000}`
    );

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
