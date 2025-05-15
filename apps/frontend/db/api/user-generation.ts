import { prisma } from "@/db/prisma";
import { hasSufficientCredits } from "@/db/api/credit";

export async function createUserVideoGenerationWithCredits({
  userId,
  generationJobId,
  creditAmount = 1,
  description = "Video generation"
}: {
  userId: string;
  generationJobId: string;
  creditAmount?: number;
  description?: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Check if user has sufficient credits using the existing API
      const hasEnoughCredits = await hasSufficientCredits(userId, creditAmount);
      if (!hasEnoughCredits) {
        throw new Error(`Insufficient credits for video generation. Required: ${creditAmount}`);
      }

      // 2. Create the pending credit transaction
      const creditTransaction = await tx.creditTransaction.create({
        data: {
          userId,
          jobId: generationJobId,
          amount: creditAmount,
          status: "pending",
          description,
        },
      });

      // 3. Create the user generation record
      const userGeneration = await tx.userVideoGeneration.create({
        data: {
          userId,
          generationJobId,
        },
      });
      
      return {
        userGeneration,
        creditTransaction
      };
    });
  } catch (error) {
    console.error("Error creating user video generation with credits:", error);
    throw error;
  }
}

/**
 * Creates a new video generation as a retry and removes the old one from user's view
 */
export async function retryUserVideoGeneration({
  userId,
  oldGenerationJobId,
  newGenerationJobId,
  creditAmount = 1,
  description = "Video generation retry"
}: {
  userId: string;
  oldGenerationJobId: string;
  newGenerationJobId: string;
  creditAmount?: number;
  description?: string;
}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Check if user has sufficient credits
      const hasEnoughCredits = await hasSufficientCredits(userId, creditAmount);
      if (!hasEnoughCredits) {
        throw new Error(`Insufficient credits for video generation. Required: ${creditAmount}`);
      }

      // 2. Create the pending credit transaction
      const creditTransaction = await tx.creditTransaction.create({
        data: {
          userId,
          jobId: newGenerationJobId,
          amount: creditAmount,
          status: "pending",
          description,
        },
      });

      // 3. Create a new UserVideoGeneration record
      const newUserGeneration = await tx.userVideoGeneration.create({
        data: {
          userId,
          generationJobId: newGenerationJobId,
        },
      });
      
      // 4. Delete the old UserVideoGeneration record
      const deletedUserGeneration = await tx.userVideoGeneration.deleteMany({
        where: {
          userId,
          generationJobId: oldGenerationJobId,
        },
      });
      
      return {
        newUserGeneration,
        creditTransaction,
        deletedCount: deletedUserGeneration.count
      };
    });
  } catch (error) {
    console.error("Error retrying user video generation:", error);
    throw error;
  }
}

export async function getUserVideoGenerations(userId: string) {
  try {
    const generations = await prisma.userVideoGeneration.findMany({
      where: {
        userId,
      },
      select: {
        generation: {
          select: {
            jobId: true,
            status: true,
            step: true,
            statusMessage: true,
            updatedAt: true,
            assets: {
              select: {
                renderS3Key: true,
                posterS3Key: true,
                imageUrls: true,
                audioUrl: true,
                cloudFrontPosterUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        generation: {
          createdAt: 'desc',
        },
      },
    });

    return generations.map((gen) => ({
      jobId: gen.generation.jobId,
      status: gen.generation.status,
      step: gen.generation.step,
      statusMessage: gen.generation.statusMessage,
      renderS3Key: gen.generation.assets[0]?.renderS3Key ?? null,
      posterS3Key: gen.generation.assets[0]?.posterS3Key ?? null,
      imageUrls: gen.generation.assets[0]?.imageUrls ?? null,
      audioUrl: gen.generation.assets[0]?.audioUrl ?? null,
      cloudFrontPosterUrl: gen.generation.assets[0]?.cloudFrontPosterUrl ?? null,
      updatedAt: gen.generation.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error getting user video generations:", error);
    throw error;
  }
}

export async function deleteUserVideoGeneration({
  userId,
  generationJobId,
}: {
  userId: string;
  generationJobId: string;
}) {
  try {
    const result = await prisma.userVideoGeneration.deleteMany({
      where: {
        userId,
        generationJobId,
      }
    });

    return result;
  } catch (error) {
    console.error("Error deleting user video generation:", error);
    throw error;
  }
}

export async function getGenerationForUser(userId: string, jobId: string) {
  try {
    const generation = await prisma.videoGeneration.findFirst({
      where: {
        jobId,
        users: {
          some: {
            userId
          }
        }
      },
      select: {
        formData: true,
        assets: {
          select: {
            imageUrls: true,
            audioUrl: true,
          }
        }
      }
    });

    if (!generation) {
      return null;
    }

    return {
      formData: generation.formData,
      hasImageAssets: Boolean(generation.assets?.[0]?.imageUrls),
      hasAudioAssets: Boolean(generation.assets?.[0]?.audioUrl),
    };
  } catch (error) {
    console.error("Error getting generation for retry:", error);
    throw error;
  }
}

/**
 * Get the poster S3 key for a specific generation job ID and user ID
 * This ensures users can only access their own poster images
 */
export async function getPosterS3KeyByJobId(jobId: string, userId: string): Promise<string | null> {
  try {
    // Find the generation and join with the video assets
    const generation = await prisma.videoGeneration.findFirst({
      where: {
        jobId,
        users: {
          some: {
            userId
          }
        }
      },
      select: {
        assets: {
          select: {
            posterS3Key: true
          }
        }
      }
    });

    // Return the poster S3 key if it exists
    return generation?.assets?.[0]?.posterS3Key || null;
  } catch (error) {
    console.error(`Error fetching poster S3 key for job ID ${jobId}:`, error);
    throw error;
  }
}

/**
 * Get the render S3 key for a specific generation job ID and user ID
 * This ensures users can only access their own video renders
 */
export async function getRenderS3KeyByJobId(jobId: string, userId: string): Promise<string | null> {
  try {
    // Find the generation and join with the video assets
    const generation = await prisma.videoGeneration.findFirst({
      where: {
        jobId,
        users: {
          some: {
            userId
          }
        }
      },
      select: {
        assets: {
          select: {
            renderS3Key: true
          }
        }
      }
    });

    // Return the render S3 key if it exists
    return generation?.assets?.[0]?.renderS3Key || null;
  } catch (error) {
    console.error(`Error fetching render S3 key for job ID ${jobId}:`, error);
    throw error;
  }
}
