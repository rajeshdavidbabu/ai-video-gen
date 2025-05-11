/*
  Warnings:

  - You are about to drop the column `cloudfront_render_url` on the `video_assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_assets" DROP COLUMN "cloudfront_render_url";

-- CreateTable
CREATE TABLE "rerender_logs" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rerender_logs_pkey" PRIMARY KEY ("id")
);
