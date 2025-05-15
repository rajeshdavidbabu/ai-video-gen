import { FastifyInstance } from 'fastify';
import { Job, Worker } from 'bullmq';
import { VideoEntity } from '../domain/entities/video.entity';
import { generateVideo, rerender } from './orchestrator';

// Services
import { VideoProcessingService } from "./services/video-processing.service";
import { ScriptGenerationService } from "./services/use-cases/script-generation.service";
import { PromptGenerationService } from "./services/use-cases/image-prompts-generation.service";
import { ImageGenerationFromPromptsService } from "./services/use-cases/image-generation-from-prompts.service";
import { ImageReorderingService } from "./services/use-cases/image-reordering.service";
import { AudioCaptionsGenerationService } from "./services/use-cases/audio-captions-generation.service";
import { VideoRenderingService } from "./services/use-cases/video-rendering.service";
import { ZodFormValidator } from '../adapters/zod-form-validator.adapter';

// Adapters
import { BullJobQueueAdapter } from '../adapters/bull-job-queue.adapter';
import { OpenAIContentGenAdapter } from '../adapters/openai-content-gen.adapter';
import { ElevenLabsSpeechGenAdapter } from '../adapters/elevenlabs-speech-gen.adapter';
import { S3AssetRepository } from '../adapters/s3-asset-repository.adapter';
import { PrismaVideoRepository } from '../adapters/prisma-video-repository.adapter';
import { MidjourneyImageGenAdapter } from '../adapters/midjourney-image-gen.adapter';
import { RemotionVideoRenderAdapter } from '../adapters/remotion-video-render.adapter';
import { DiscordMidjourneyClient } from '../services/discord-midjourney.client';

// Singleton container for services
export class ServiceContainer {
  private static instance: ServiceContainer | null = null;
  private services: ReturnType<typeof initializeServices>;
  private queue: BullJobQueueAdapter;
  private worker: Worker;

  private constructor(fastify: FastifyInstance) {
    // Initialize adapters
    const adapters = initializeAdapters();
    
    // Initialize services with adapters
    this.services = initializeServices(adapters);
    
    // Initialize queue
    this.queue = new BullJobQueueAdapter();
    
    // Initialize worker
    this.worker = this.initializeWorker(fastify);
  }

  private initializeWorker(fastify: FastifyInstance): Worker {
    const worker = this.queue.createWorker(async (job) => {
      console.log(`Processing job ${job.name} with jobId ${job.jobId}`);
      try {
        if (job.name === 'rerender') {
          if (!job.data.renderedJobId) {
            throw new Error('Rerender job: Rendered job ID is missing');
          }

          await rerender(job.data.renderedJobId, this.services);

          return {
            success: true,
            jobId: job.jobId
          };
        } else {
          const video = VideoEntity.create({
            jobId: job.jobId,
            formData: job.data.formData,
            options: job.data.options
          });

          const result = await generateVideo(video, this.services);

          if (!result.assets?.imageUrls?.[0] || !result.assets?.renderS3Key) {
            throw new Error("Failed to generate video correctly and no render s3 key found");
          }

          return {
            success: true,
            jobId: job.jobId
          };
        }
      } catch (error) {
        console.error(`Error processing ${job.name} job:`, error);
        throw error;
      }
    });

    initializeWorkerHandlers(worker, this.queue, this.services.videoProcessing, fastify.log);
    return worker;
  }

  static initialize(fastify: FastifyInstance): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer(fastify);
    }
    return ServiceContainer.instance;
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      throw new Error('ServiceContainer not initialized, initialize first');
    }
    return ServiceContainer.instance;
  }

  getServices() {
    return this.services;
  }

  getQueue() {
    return this.queue;
  }

  getWorker() {
    return this.worker;
  }

  async shutdown() {
    if (this.worker) {
      await this.worker.close();
    }
    if (this.queue) {
      await this.queue.close();
    }
    ServiceContainer.instance = null;
  }
}

// Pure functions for initialization
function initializeAdapters() {

  const discordMidjourneyClient = new DiscordMidjourneyClient();
  return {
    openai: new OpenAIContentGenAdapter(),
    elevenlabs: new ElevenLabsSpeechGenAdapter(),
    storage: new S3AssetRepository(),
    db: new PrismaVideoRepository(),
    midjourney: new MidjourneyImageGenAdapter(discordMidjourneyClient),
    remotion: new RemotionVideoRenderAdapter(),
    validator: new ZodFormValidator()
  };
}

function initializeServices(adapters: ReturnType<typeof initializeAdapters>) {
  const videoProcessing = new VideoProcessingService(adapters.db, adapters.storage);

  return {
    videoProcessing,
    validator: adapters.validator,
    script: new ScriptGenerationService(adapters.openai),
    prompts: new PromptGenerationService(adapters.openai),
    images: new ImageGenerationFromPromptsService(adapters.midjourney),
    reordering: new ImageReorderingService(adapters.openai),
    audioCaptions: new AudioCaptionsGenerationService(adapters.elevenlabs),
    render: new VideoRenderingService(adapters.remotion)
  };
}

// Export a convenient function for getting services
export const getServices = () => ServiceContainer.getInstance().getServices();
export const getQueue = () => ServiceContainer.getInstance().getQueue();

// Worker event handlers
const initializeWorkerHandlers = (
  worker: Worker,
  queue: BullJobQueueAdapter,
  videoProcessing: VideoProcessingService,
  logger: FastifyInstance['log']
) => {
  worker.on('ready', () => {
    logger.info('Worker is ready and connected to Redis.');
  });

  worker.on('active', async (job: Job) => {
    logger.info({ jobId: job.id }, '✅ Job is now active');
  });

  worker.on('progress', async (job: Job, progress: any) => {
    logger.info({ jobId: job.id, progress }, '📈 Job progress');
    await videoProcessing.updateAndPersistVideo(
      VideoEntity.fromReadModel({ jobId: job.data.jobId, ...progress }),
      progress.step,
      progress.message
    );
  });

  worker.on('completed', async (job: Job) => {
    logger.info({ jobId: job.id }, '✅ Job has completed');
  });

  worker.on('failed', async (job: Job, error: Error) => {
    logger.error({ jobId: job.id, error: error.message }, '❌ Job failed');
  });

  worker.on('error', (error) => {
    logger.error({ error: error.message, stack: error.stack }, '=== Worker Error ===');
  });

  worker.on('stalled', async (jobId: string) => {
    const job = await queue.getJob(jobId);
    if (job) {
      const video = VideoEntity.fromReadModel({
        jobId: job.jobId,
        status: 'failed',
        formData: job.data.formData,
        creditsUsed: 0,
        step: 'unknown',
        progressMessage: 'Job stalled - timeout occurred'
      });
      
      await videoProcessing.markVideoAsFailed(video, {
        step: 'unknown',
        code: 'JOB_STALLED',
        message: 'Job stalled - timeout occurred'
      });
    }

    logger.warn({ jobId }, '⚠️ Job has stalled');
  });

  logger.info('📋 Worker handlers initialized...');
};
