import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getGenerationForUser, deleteUserVideoGeneration, createUserVideoGenerationWithCredits } from "@/db/api/user-generation";
import { env } from "@/lib/env.server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();
  
    // Get the existing generation with its form data
    const generation = await getGenerationForUser(session.user.id, jobId);

    if (!generation) {
      return Response.json({ error: "Generation not found" }, { status: 404 });
    }

    // Create new generation with reference to existing assets
    const response = await fetch(`${env.BACKEND_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoData: generation.formData,
        config: {
          referenceJobId: {
            images: generation.hasImageAssets ? jobId : undefined,
            audio: generation.hasAudioAssets ? jobId : undefined,
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create new generation');
    }

    const { jobId: newJobId } = await response.json();

    // Create the user generation record
    await createUserVideoGenerationWithCredits({
      userId: session.user.id,
      generationJobId: newJobId
    });

    // Delete the old generation after successful creation
    await deleteUserVideoGeneration({
      userId: session.user.id,
      generationJobId: jobId
    });

    revalidatePath('/generations');
    
    return Response.json({ success: true, jobId: newJobId });
  } catch (error) {
    console.error('Error retrying generation:', error);
    return Response.json(
      { error: "Failed to retry generation" }, 
      { status: 500 }
    );
  }
}