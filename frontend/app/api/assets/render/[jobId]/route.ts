import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cloudFrontAssetRepository } from "@/lib/cloudfront-assets";
import { getRenderS3KeyByJobId } from "@/db/api/user-generation";

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = params;
    
    // Get the render S3 key from the database
    const renderS3Key = await getRenderS3KeyByJobId(jobId, userId);
    
    if (!renderS3Key) {
      return NextResponse.json({ error: "Video render not found" }, { status: 404 });
    }
    
    // Generate a signed URL for the video render
    const url = cloudFrontAssetRepository.getRemotionCloudFrontUrl(renderS3Key);
    
    // Return the signed URL with cache headers
    return NextResponse.json(
      { url },
      { 
        headers: {
          'Cache-Control': 'public, max-age=604800' // 7 days
        }
      }
    );
  } catch (error) {
    console.error("Error fetching video render:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
