/*
  Warnings:

  - Changed the type of `status` on the `credit_transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CreditTransactionStatus" AS ENUM ('pending', 'used', 'refunded', 'cancelled');

-- DropIndex
DROP INDEX "credit_transactions_job_id_idx";

-- AlterTable
ALTER TABLE "credit_transactions" DROP COLUMN "status",
ADD COLUMN     "status" "CreditTransactionStatus" NOT NULL;
