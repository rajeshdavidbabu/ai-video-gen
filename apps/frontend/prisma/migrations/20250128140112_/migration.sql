/*
  Warnings:

  - A unique constraint covering the columns `[generation_id]` on the table `video_assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "video_assets_generation_id_key" ON "video_assets"("generation_id");
