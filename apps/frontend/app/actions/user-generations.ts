'use server'

import { deleteUserVideoGeneration } from "@/db/api/user-generation";
import { auth } from "@/auth"

export async function deleteUserGenerationAction(generationJobId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized');
    }

    await deleteUserVideoGeneration({
      userId: session.user.id,
      generationJobId
    });
  } catch (error) {
    console.error('Failed to delete user-video generation:', error);
    throw new Error('Failed to delete user-video generation relationship');
  }
}