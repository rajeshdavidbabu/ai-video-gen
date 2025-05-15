import type {
  VideoReadModel,
  VideoWriteModel,
} from "../domain/types/contracts/video-persistence.types";

export interface VideoRepository {
  // Write operations
  create(video: VideoWriteModel): Promise<void>;
  update(jobId: string, video: Partial<VideoWriteModel>): Promise<void>;
  updateAssets(jobId: string, assets: VideoWriteModel['assets']): Promise<void>;
  
  // Read operations
  findById(jobId: string): Promise<VideoReadModel | null>;
  deductCredits(jobId: string): Promise<void>;
  revertCredits(jobId: string): Promise<void>;
  // findByUserId(userId: string): Promise<VideoReadModel[]>;
}
