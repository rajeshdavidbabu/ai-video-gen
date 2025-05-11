/*
  Warnings:

  - You are about to drop the column `render_url` on the `video_assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_assets" DROP COLUMN "render_url",
ADD COLUMN     "render_s3_key" TEXT;
