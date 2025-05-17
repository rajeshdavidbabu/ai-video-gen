import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";
import { env } from "@/lib/env.server";

const MAX_DOWNLOADS = parseInt(env.MAX_DOWNLOADS);

export async function GET(
  _req: Request,
  { params }: { params: { jobId: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { jobId } = await params;

  // Count previous downloads
  const count = await prisma.downloadLog.count({ where: { jobId, userId } });
  if (count >= MAX_DOWNLOADS) {
    return NextResponse.json(
      { error: "Download limit reached" },
      { status: 429 }
    );
  }

  // Log this download
  await prisma.downloadLog.create({ data: { jobId, userId } });

  // Lookup internal generation ID via jobId
  const generation = await prisma.videoGeneration.findUnique({ where: { jobId } });
  if (!generation) {
    return NextResponse.json({ error: "Generation not found" }, { status: 404 });
  }
  // Fetch asset record for render key via generation.id
  const asset = await prisma.videoAsset.findUnique({ where: { generationId: generation.id } });
  const key = asset?.renderS3Key;

  if (!key) {
    return NextResponse.json({ error: "No asset found" }, { status: 404 });
  }

  // Generate short-lived CloudFront signed URL (5 min TTL)
  const expirationDate = new Date(Date.now() + 300 * 1000);
  const url = getCloudFrontSignedUrl({
    url: `https://${env.CLOUDFRONT_DOMAIN}/${key}`,
    keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: env.CLOUDFRONT_PRIVATE_KEY,
    dateLessThan: expirationDate.toISOString(),
  });

  return NextResponse.json({ url });
}
