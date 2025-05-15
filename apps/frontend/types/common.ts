import { GenerationStatus } from "@prisma/client";

export type Generation = {
  jobId: string;
  status: GenerationStatus;
  step?: string;
  statusMessage?: string;
  posterS3Key?: string | null;
  renderS3Key?: string | null;
  updatedAt: string;
  hasImageAssets: boolean;
  hasAudioAssets: boolean;
  cloudFrontPosterUrl?: string | null;
};
