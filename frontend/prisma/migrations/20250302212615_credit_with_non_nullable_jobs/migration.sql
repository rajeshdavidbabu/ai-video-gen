/*
  Warnings:

  - Made the column `job_id` on table `credit_transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "credit_transactions" ALTER COLUMN "job_id" SET NOT NULL;
