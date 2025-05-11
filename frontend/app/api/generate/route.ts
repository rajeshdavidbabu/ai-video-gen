import { auth } from "@/auth";
import { env } from "@/lib/env.server";
import { hasSufficientCredits } from "@/db/api/credit";
import { createUserVideoGenerationWithCredits } from "@/db/api/user-generation";
import { revalidatePath } from "next/cache";
import { reconcilePendingTransactions } from "@/db/api/credit";
import { prisma } from "@/db/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized", message: "You must be logged in to generate videos" }, { status: 401 });
  }

  const { videoData, config } = await request.json();
  const jobId = `job_${nanoid()}`;
  let jobAddedToQueue = false;

  try {
    // Clean up any stuck credit transactions and verify credits
    await reconcilePendingTransactions(session.user.id);
    const hasCredit = await hasSufficientCredits(session.user.id);
    if (!hasCredit) {
      return Response.json({ error: "Insufficient credits", message: "You don't have enough credits to generate a video" }, { status: 402 });
    }

    // 2) Call external service (Backend will create the VideoGeneration record)
    const response = await fetch(`${env.BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, videoData, ...(config && { config }) })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to initiate video generation on backend');
    }
    jobAddedToQueue = true;

    // 3) Record user generation & consume credits (AFTER successful backend call)
    await createUserVideoGenerationWithCredits({ userId: session.user.id, generationJobId: jobId });

    // 4) Success
    revalidatePath('/generations');
    return Response.json({ success: true, jobId });

  } catch (error) {
    const failureStage = jobAddedToQueue 
      ? "after successful backend call (likely during user linking/credit deduction)" 
      : "before or during backend call";
    
    console.error(`[POST /api/generate] Error for user ${session.user.id} job ${jobId} occurred ${failureStage}:`, error);

    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return Response.json({ error: "Generation failed", message: "Something went wrong during video generation." }, { status: 500 });
  }
}