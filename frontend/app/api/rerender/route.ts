import { auth } from "@/auth";
import { env } from "@/lib/env.server";
import { getGenerationForUser } from "@/db/api/user-generation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma";

// Use the environment variable or fallback to 3
const MAX_RERENDERS = process.env.MAX_RERENDERS ? parseInt(process.env.MAX_RERENDERS) : 5;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();
    const userId = session.user.id;

    // Enforce rerender limit
    const count = await prisma.rerenderLog.count({ where: { jobId, userId } });
    console.log("Rerender count:", count);
    
    if (count >= MAX_RERENDERS) {
      console.log("Rerender limit reached");
      return Response.json({ error: "Rerender limit reached" }, { status: 429 });
    }
    await prisma.rerenderLog.create({ data: { jobId, userId } });

    // Verify user owns this generation
    const generation = await getGenerationForUser(session.user.id, jobId);
    if (!generation) {
      return Response.json(
        { error: "Generation not found or not owned by user" }, 
        { status: 404 }
      );
    }

    // Forward the request to the backend service
    const response = await fetch(`${env.BACKEND_URL}/api/rerender`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to rerender video');
    }

    const result = await response.json();

    revalidatePath('/generations');

    return Response.json({ 
      success: true, 
      jobId: result.jobId 
    });
  } catch (error) {
    console.error('Error rerendering video:', error);
    return Response.json(
      { error: "Failed to rerender video" }, 
      { status: 500 }
    );
  }
}