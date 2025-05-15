import "server-only";

import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env.server";

class CloudFrontAssetRepository {
  private s3Client: S3Client;
  
  constructor() {
    this.s3Client = new S3Client({
      region: "us-east-1", // Adjust to your region if needed
    });
  }

  /**
   * Get a CloudFront signed URL for a poster image
   */
  getPosterCloudFrontUrl(posterKey: string, expiresIn: number = 604800): string {
    // Create an expiration date for the signed URL (7 days by default)
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    
    // Generate a CloudFront signed URL
    return getCloudFrontSignedUrl({
      url: `https://${env.CLOUDFRONT_DOMAIN}/${posterKey}`,
      keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: env.CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: expirationDate.toISOString(),
    });
  }

  /**
   * Get a CloudFront signed URL for a Remotion render
   */
  getRemotionCloudFrontUrl(renderKey: string, expiresIn: number = 604800): string {
    // Create an expiration date for the signed URL (7 days by default)
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    
    // Generate a CloudFront signed URL
    return getCloudFrontSignedUrl({
      url: `https://${env.CLOUDFRONT_DOMAIN}/${renderKey}`,
      keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: env.CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: expirationDate.toISOString(),
    });
  }
  
  /**
   * Get an S3 presigned URL for a poster image (alternative to CloudFront)
   */
  async getPosterS3Url(posterKey: string, expiresIn: number = 3600): Promise<string> {
    return getS3SignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: "bullmq-job-assets-storage", // Your S3 bucket name
        Key: posterKey,
      }),
      { expiresIn }
    );
  }
  
  /**
   * Get an S3 presigned URL for a Remotion render (alternative to CloudFront)
   */
  async getRemotionS3Url(renderKey: string, expiresIn: number = 3600): Promise<string> {
    return getS3SignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: "bullmq-job-assets-storage", // Your S3 bucket name
        Key: renderKey,
      }),
      { expiresIn }
    );
  }
}

// Create a singleton instance
export const cloudFrontAssetRepository = new CloudFrontAssetRepository();
