/*
  Warnings:

  - The primary key for the `user_video_generations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `video_assets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `video_generations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[generation_job_id]` on the table `user_video_generations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "video_assets" DROP CONSTRAINT "video_assets_generation_id_fkey";

-- AlterTable
ALTER TABLE "user_video_generations" DROP CONSTRAINT "user_video_generations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_video_generations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_video_generations_id_seq";

-- AlterTable
ALTER TABLE "video_assets" DROP CONSTRAINT "video_assets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "generation_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "video_assets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "video_assets_id_seq";

-- AlterTable
ALTER TABLE "video_generations" DROP CONSTRAINT "video_generations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "video_generations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "video_generations_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "user_video_generations_generation_job_id_key" ON "user_video_generations"("generation_job_id");

-- AddForeignKey
ALTER TABLE "video_assets" ADD CONSTRAINT "video_assets_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "video_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
