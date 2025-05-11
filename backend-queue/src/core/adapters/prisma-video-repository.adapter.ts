// infrastructure/adapters/repositories/prisma-video-repository.adapter.ts
import { prisma } from "../../db/prisma";
import { VideoAsset, VideoGeneration } from "@prisma/client";
import type { VideoRepository } from "../ports/video-repository.port";
import type {
  VideoReadModel,
  VideoWriteModel,
} from "../domain/types/contracts/video-persistence.types";
import type { VideoFormData } from "../domain/types/core/video-formdata.types";
import type { VideoStatus, VideoStep } from "../domain/types/core/video.types";

export class PrismaVideoRepository implements VideoRepository {
  async create(video: VideoWriteModel): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.videoGeneration.create({
        data: {
          jobId: video.jobId,
          status: video.status,
          step: video.step,
          formData: video.formData,
          statusMessage: video.progressMessage,
          creditsUsed: video.creditsUsed ?? 0,
        },
      });
    });
  }

  async update(jobId: string, video: Partial<VideoWriteModel>): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.videoGeneration.update({
        where: { jobId },
        data: {
          status: video.status,
          step: video.step,
          statusMessage: video.progressMessage,
          creditsUsed: video.creditsUsed,
        },
      });
    });
  }

  async updateAssets(
    jobId: string,
    assets: VideoWriteModel["assets"]
  ): Promise<void> {
    if (!assets) return;

    await prisma.$transaction(async (tx) => {
      const generation = await tx.videoGeneration.findUniqueOrThrow({
        where: { jobId },
      });

      await tx.videoAsset.upsert({
        where: { generationId: generation.id },
        create: {
          generationId: generation.id,
          imageUrls: assets.imageUrls,
          audioUrl: assets.audioUrl,
          captionsUrl: assets.captionsUrl,
          backgroundMusicUrl: assets.backgroundMusicUrl,
          renderS3Key: assets.renderS3Key,
          posterS3Key: assets.posterS3Key,
          cloudFrontPosterUrl: assets.cloudfrontPosterUrl,
        },
        update: {
          imageUrls: assets.imageUrls,
          audioUrl: assets.audioUrl,
          captionsUrl: assets.captionsUrl,
          backgroundMusicUrl: assets.backgroundMusicUrl,
          renderS3Key: assets.renderS3Key,
          posterS3Key: assets.posterS3Key,
          cloudFrontPosterUrl: assets.cloudfrontPosterUrl,
        },
      });
    });
  }

  async findById(jobId: string): Promise<VideoReadModel | null> {
    const result = await prisma.videoGeneration.findUnique({
      where: { jobId },
      include: { assets: true },
    });

    if (!result) return null;

    return this.mapToReadModel(result);
  }

  private mapToReadModel(
    result: VideoGeneration & { assets: VideoAsset[] }
  ): VideoReadModel {
    const asset = result.assets[0];

    return {
      jobId: result.jobId,
      status: result.status as VideoStatus,
      step: result.step as VideoStep,
      formData: result.formData as VideoFormData,
      creditsUsed: result.creditsUsed,
      progressMessage: result.statusMessage || undefined,
      assets: asset
        ? {
            imageUrls: (asset.imageUrls as string[]) || [],
            audioUrl: asset.audioUrl || "",
            captionsUrl: asset.captionsUrl || "",
            backgroundMusicUrl: asset.backgroundMusicUrl || undefined,
            renderS3Key: asset.renderS3Key || undefined,
            posterS3Key: asset.posterS3Key || undefined,
            cloudfrontPosterUrl: asset.cloudFrontPosterUrl || undefined,
          }
        : undefined,
    };
  }

  async deductCredits(jobId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        // Find the transaction by jobId
        const transaction = await tx.creditTransaction.findFirst({
          where: {
            jobId,
            status: "pending",
          },
          select: {
            id: true,
            amount: true,
            userId: true,
          },
        });

        if (!transaction) {
          console.log(`No pending transaction found for job ${jobId}`);
          return null;
        }

        // 1. Update transaction status to used
        await tx.creditTransaction.update({
          where: { id: transaction.id },
          data: { status: "used" },
        });

        // 2. Update user's balance by decrementing it
        await tx.user.update({
          where: { id: transaction.userId },
          data: {
            creditBalance: {
              decrement: transaction.amount,
            },
          },
        });
      });
    } catch (error) {
      console.error(`Error deducting credits for job ${jobId}:`, error);
      throw error;
    }
  }

  async revertCredits(jobId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        // Find the transaction by jobId
        const transaction = await tx.creditTransaction.findFirst({
          where: {
            jobId,
            status: "pending",
          },
          select: {
            id: true,
          },
        });

        if (!transaction) {
          console.log(`No pending transaction found for job ${jobId}`);
          return null;
        }

        await tx.creditTransaction.update({
          where: { id: transaction.id },
          data: { status: "cancelled" },
        });
      });
    } catch (error) {
      console.error(`Error reverting credits for job ${jobId}:`, error);
      throw error;
    }
  }
}
