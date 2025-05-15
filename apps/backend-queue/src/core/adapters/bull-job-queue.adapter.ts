import { Queue, Worker, type Job } from 'bullmq';
import type { JobQueue, JobOptions, JobProgress, JobProcessResult } from '../ports/job-queue.port';
import type { VideoFormData, VideoOptions } from '../domain/types/core/video-formdata.types';
import { env } from '../utils/env';
import { VideoStatus } from '~/core/domain/types/core/video.types';

export class BullJobQueueAdapter implements JobQueue {
  private static readonly DEFAULT_OPTIONS: Required<JobOptions> = {
    attempts: 1,
    delay: 1000,
    removeOnComplete: {
      age: 3600,    // 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600, // 24 hours
    },
  };

  private readonly queue: Queue;
  private worker: Worker | null = null;  // Track single worker
  
  constructor(queueName: string = 'video-generation') {
    this.queue = new Queue(queueName, {
      connection: {
        url: env.REDIS_URL,
        enableOfflineQueue: true,
        showFriendlyErrorStack: true,
        family: process.env.NODE_ENV === "production" ? 0 : undefined,
      }
    });
  }

  async addJob(params: {
    name: string;
    data: {
      jobId: string;
      renderedJobId?: string;
      formData?: VideoFormData;
      options?: VideoOptions;
    };
    options?: JobOptions;
  }): Promise<{ jobId: string }> {
    const job = await this.queue.add(params.name, params.data, {
      // Important for custom jobId
      jobId: params.data.jobId,
      ...BullJobQueueAdapter.DEFAULT_OPTIONS,
      // Remove the job after it is completed
      removeOnComplete: true,
      ...params.options,
    });

    if (!job.id) throw new Error('Failed to create job');
    return { jobId: job.id.toString() };
  }

  async getJob(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job || !job.id) return null;

    return {
      jobId: job.id.toString(),
      data: {
        formData: job.data.formData,
        options: job.data.options,
      },
      status: await job.getState() as VideoStatus,
    };
  }

  createWorker(
    processor: (job: {
      jobId: string;
      name: string;
      data: {
        formData: VideoFormData;
        options?: VideoOptions;
        renderedJobId?: string;
      };
      updateProgress: (progress: JobProgress) => Promise<void>;
    }) => Promise<JobProcessResult>
  ): Worker {
    if (this.worker) {
      throw new Error('Worker already exists');
    }

    // For now we will only have one worker for the queue
    this.worker = new Worker(
      this.queue.name,
      async (job: Job) => {
        if (!job.id) throw new Error('Create worker: Job ID is missing');
        
        return processor({
          jobId: job.id.toString(),
          name: job.name,
          data: job.data,
          updateProgress: async (progress) => {
            await job.updateProgress(progress);
          },
        });
      },
      {
        connection: this.queue.opts.connection,
        concurrency: 1,
        lockDuration: 300000, // 5 minutes
        stalledInterval: 30000,  // Check for stalled jobs every 30 seconds
        maxStalledCount: 1,      // Fail after 1 stall
      }
    );

    return this.worker;
  }

  async close(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
    }
    await this.queue.close();
  }
  
  async clearAll(): Promise<void> {
    await this.queue.drain();
    await this.queue.clean(0, 0, "completed");
    await this.queue.clean(0, 0, "failed");
    await this.queue.clean(0, 0, "delayed");
    await this.queue.clean(0, 0, "active");
  }

  async getStats() {
    const counts = await this.queue.getJobCounts(
      "wait",
      "active",
      "completed",
      "failed",
      "delayed",
      "paused"
    );

    return counts;
  }

  async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return { state, result };
  }
}
