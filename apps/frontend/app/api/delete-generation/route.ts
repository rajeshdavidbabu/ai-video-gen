import { auth } from "@/auth";
import { deleteUserVideoGeneration } from "@/db/api/user-generation";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ 
        error: "Unauthorized",
        message: "You must be logged in to delete generations" 
      }, { status: 401 });
    }

    const { jobId } = await request.json();

    // Delete the user's association with this generationn
    await deleteUserVideoGeneration({
      userId: session.user.id,
      generationJobId: jobId
    });

    revalidatePath('/generations');

    return Response.json({ 
      success: true,
      message: "Generation removed from your list"
    });
  } catch (error) {
    console.error('Error deleting user generation:', error);
    return Response.json({ 
      error: "Failed to delete generation", 
      message: error instanceof Error ? error.message : "An unexpected error occurred" 
    }, { status: 500 });
  }
} 