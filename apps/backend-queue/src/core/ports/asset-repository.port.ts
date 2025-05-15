export interface AssetRepository {
  uploadFile(params: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<void>;

  getFile(key: string): Promise<{
    Body: ReadableStream;
    ContentType?: string;
  }>;

  copyFile(params: {
    sourceKey: string;
    destinationKey: string;
    preserveContentType?: boolean;
  }): Promise<void>;

  // Presigned URL
  getPresignedUrl(key: string, expiresIn?: number): Promise<string>;

  // JSON operations
  getJsonFile<T = unknown>(key: string): Promise<T | null>;
  
  saveJsonFile(key: string, data: Record<string, unknown>): Promise<void>;

  // File existence check
  checkIfFileExists(key: string): Promise<boolean>;

  // Image specific operations
  checkImageProgress(params: {
    jobId: string;
    totalPrompts: number;
  }): Promise<{
    existingImages: Record<string, string>;
    remainingCount: number;
    startIndex: number;
  }>;

  getStyleReferenceImageUrl(styleReference: string): Promise<{
    url1: string;
    url2: string;
  }>;

  // Job specific operations
  copyImageJsonFromJob(params: {
    sourceJobId: string;
    destinationJobId: string;
  }): Promise<Record<string, string>>;

  uploadImageFromUrl(params: {
    url: string;
    jobId: string;
  }): Promise<string>;

  // CloudFront signed URLs
  getPosterUrl(key: string, expiresIn?: number): Promise<string>;
}