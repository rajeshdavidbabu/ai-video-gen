import { prisma } from "@/db/prisma";
import { CreditTransactionStatus } from "@prisma/client";

/**
 * Get a user's credit balance including pending transactions
 * Handles new users who might not have any credit records yet
 */
export const getUserCreditBalance = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        creditBalance: true,
        creditTransactions: {
          where: { status: CreditTransactionStatus.pending },
          select: { amount: true },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate pending amount (sum of absolute values)
    const pendingAmount = user.creditTransactions.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0
    );

    return {
      total: user.creditBalance || 0, // Default to 0 if null
      pending: pendingAmount,
      available: (user.creditBalance || 0) - pendingAmount,
    };
  } catch (error) {
    console.error("Error occurred at getUserCreditBalance", error);
    throw error;
  }
};

/**
 * Check if a user has sufficient credits for an operation
 */
export const hasSufficientCredits = async (
  userId: string,
  amount: number = 1
) => {
  try {
    const balance = await getUserCreditBalance(userId);
    return balance.available >= amount;
  } catch (error) {
    console.error("Error occurred at hasSufficientCredits", error);
    throw error;
  }
};

/**
 * Add credits to a user's balance (purchase or admin action)
 */
export const addCreditsToUser = async (
  userId: string,
  amount: number,
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Verify amount is positive
      if (amount <= 0) {
        throw new Error("Amount must be positive");
      }

      // Add to user's balance
      await tx.user.update({
        where: { id: userId },
        data: { creditBalance: { increment: amount } },
      });

      return {
        success: true,
        message: `Added ${amount} credits to user ${userId}`,
      };
    });
  } catch (error) {
    console.error("Error occurred at addCreditsToUser", error);
    throw error;
  }
};

/**
 * Create a pending credit transaction for a video generation
 */
export const createPendingTransaction = async (
  userId: string,
  jobId: string,
  amount: number = 1,
  description: string = "Reserved for video generation"
) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Verify sufficient credits first
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          creditBalance: true,
          creditTransactions: {
            where: { status: CreditTransactionStatus.pending },
            select: { amount: true },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const pendingAmount = user.creditTransactions.reduce(
        (sum, tx) => sum + Math.abs(tx.amount),
        0
      );

      const availableCredits = (user.creditBalance || 0) - pendingAmount;

      if (availableCredits < amount) {
        throw new Error(
          `Insufficient credits. Available: ${availableCredits}, Required: ${amount}`
        );
      }

      // Create the transaction
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          jobId,
          amount: -amount, // Negative for spending
          status: CreditTransactionStatus.pending,
          description,
        },
      });

      return transaction;
    });
  } catch (error) {
    console.error("Error occurred at createPendingTransaction", error);
    throw error;
  }
};

/**
 * Reconciles pending transactions with actual job statuses
 * Cleans up any "zombie" pending transactions for jobs that are already completed or failed
 */
export async function reconcilePendingTransactions(userId: string) {
  try {
    // 1. Find all pending transactions for this user
    const pendingTransactions = await prisma.creditTransaction.findMany({
      where: {
        userId,
        status: "pending",
      },
      select: {
        id: true,
        jobId: true,
        amount: true,
      },
    });

    if (pendingTransactions.length === 0) return;

    // 2. For each pending transaction, check the job status
    for (const transaction of pendingTransactions) {
      const videoGeneration = await prisma.videoGeneration.findUnique({
        where: { jobId: transaction.jobId },
        select: { status: true },
      });

      // 3. If job doesn't exist or is still pending/processing, skip
      if (
        !videoGeneration ||
        videoGeneration.status === "pending" ||
        videoGeneration.status === "processing"
      ) {
        continue;
      }

      // 4. If job is completed, mark transaction as used and deduct credits
      if (videoGeneration.status === "completed") {
        await prisma.$transaction([
          prisma.creditTransaction.update({
            where: { id: transaction.id },
            data: { status: "used" },
          }),
          prisma.user.update({
            where: { id: userId },
            data: { creditBalance: { decrement: transaction.amount } },
          }),
        ]);
      }
      // 5. If job failed, mark transaction as cancelled
      else if (videoGeneration.status === "failed") {
        await prisma.creditTransaction.update({
          where: { id: transaction.id },
          data: { status: "cancelled" },
        });
      }
    }
  } catch (error) {
    console.error("Error reconciling pending transactions:", error);
    // Don't throw - we don't want to block generation if reconciliation fails
  }
}
