import { auth } from "@/auth";
import { getUserVideoGenerations } from "@/db/api/user-generation";
import { NextResponse } from "next/server";
import { Generation } from "@/types/common";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const generations = await getUserVideoGenerations(userId);

    // Process each generation to add necessary data
    const updates: Generation[] = await Promise.all(generations.map(async gen => {
      return {
        ...gen,
        step: gen.step ?? undefined,
        statusMessage: gen.statusMessage ?? undefined,
        renderS3Key: gen.renderS3Key,
        posterS3Key: gen.posterS3Key,
        // we check if assets are already generated and present for the generation
        hasImageAssets: Boolean(gen.imageUrls && Array.isArray(gen.imageUrls) && gen.imageUrls.length > 0),
        hasAudioAssets: Boolean(gen.audioUrl && gen.audioUrl.length > 0),
        cloudFrontPosterUrl: gen.cloudFrontPosterUrl,
      };
    }));

    return NextResponse.json(updates);
    
  } catch (error) {
    console.error("Error fetching generations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}