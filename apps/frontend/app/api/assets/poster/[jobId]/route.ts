import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { cloudFrontAssetRepository } from "@/lib/cloudfront-assets";
import { getPosterS3KeyByJobId } from "@/db/api/user-generation";

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
    
    // Get the poster S3 key from the database
    const posterS3Key = await getPosterS3KeyByJobId(jobId, userId);
    
    if (!posterS3Key) {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }
    
    // Use S3 presigned URL instead of CloudFront
    // This is a temporary solution to troubleshoot the CloudFront 404 issue
    const url = cloudFrontAssetRepository.getPosterCloudFrontUrl(posterS3Key);
    
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
    console.error("Error fetching poster:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
