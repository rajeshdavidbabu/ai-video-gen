import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand, 
    HeadObjectCommand,
    CopyObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";
import fetch from "node-fetch";
import { env } from "../utils/env";
import type { AssetRepository } from "../ports/asset-repository.port";

export class S3AssetRepository implements AssetRepository {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: env.S3_BUCKET_REGION,
    });
  }

  async uploadFile(params: { key: string; body: Buffer; contentType: string }): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      })
    );
  }

  async getFile(key: string): Promise<{ Body: ReadableStream; ContentType?: string }> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      })
    );

    return {
      Body: response.Body as unknown as ReadableStream,
      ContentType: response.ContentType,
    };
  }

  async copyFile(params: { 
    sourceKey: string; 
    destinationKey: string; 
    preserveContentType?: boolean 
  }): Promise<void> {
    await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        CopySource: `${env.S3_BUCKET_NAME}/${params.sourceKey}`,
        Key: params.destinationKey,
        MetadataDirective: params.preserveContentType ? 'COPY' : 'REPLACE',
      })
    );
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
      }),
      { expiresIn }
    );
  }

  async getJsonFile<T = unknown>(key: string): Promise<T | null> {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: key,
        })
      );
      const content = await response.Body?.transformToString();
      return content ? JSON.parse(content) : null;
    } catch (error: any) {
      if (error.$metadata?.httpStatusCode === 404 || error.name === "NoSuchKey") {
        return null;
      }
      throw error;
    }
  }

  async saveJsonFile(key: string, data: Record<string, unknown>): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
      })
    );
  }

  async checkIfFileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: key,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === "NotFound") {
        return false;
      }
      throw error;
    }
  }

  async checkImageProgress(params: { jobId: string; totalPrompts: number }): Promise<{
    existingImages: Record<string, string>;
    remainingCount: number;
    startIndex: number;
  }> {
    const imagesJsonKey = `${params.jobId}/images.json`;
    const exists = await this.checkIfFileExists(imagesJsonKey);
    
    if (!exists) {
      return {
        existingImages: {},
        remainingCount: params.totalPrompts,
        startIndex: 0,
      };
    }

    const existingImages = await this.getJsonFile<Record<string, string>>(imagesJsonKey);
    const existingCount = existingImages ? Object.keys(existingImages).length : 0;

    return {
      existingImages: existingImages || {},
      remainingCount: params.totalPrompts - existingCount,
      startIndex: existingCount,
    };
  }

  async getStyleReferenceImageUrl(styleReference: string): Promise<{ url1: string; url2: string }> {
    const [url1, url2] = await Promise.all([
      this.getPresignedUrl(`image-reference/${styleReference}-1.png`),
      this.getPresignedUrl(`image-reference/${styleReference}-2.png`),
    ]);

    return { url1, url2 };
  }

  async copyImageJsonFromJob(params: { 
    sourceJobId: string; 
    destinationJobId: string 
  }): Promise<Record<string, string>> {
    const existingImages = await this.getJsonFile<Record<string, string>>(
      `${params.sourceJobId}/images.json`
    );
    
    if (!existingImages) {
      throw new Error("Source images.json not found");
    }

    await this.saveJsonFile(
      `${params.destinationJobId}/images.json`,
      existingImages
    );

    return existingImages;
  }

  async uploadImageFromUrl(params: { url: string; jobId: string }): Promise<string> {
    const response = await fetch(params.url);
    if (!response.ok) throw new Error('Failed to download image');

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const key = `posters/${params.jobId}.${contentType.includes('png') ? 'png' : 'jpg'}`;

    await this.uploadFile({
      key,
      body: buffer,
      contentType,
    });

    return key;
  }

  async getPosterUrl(posterKey: string, expiresIn: number = 604800): Promise<string> {
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    return getCloudFrontSignedUrl({
      url: `https://${env.CLOUDFRONT_DOMAIN}/${posterKey}`,
      keyPairId: env.CLOUDFRONT_KEY_PAIR_ID,
      privateKey: env.CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: expirationDate.toISOString(),
    });
  }
}