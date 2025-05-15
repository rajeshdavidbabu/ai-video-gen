-- AlterTable
ALTER TABLE "user" ADD COLUMN     "credit_balance" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" TEXT NOT NULL,
    "job_id" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_transactions_job_id_key" ON "credit_transactions"("job_id");

-- CreateIndex
CREATE INDEX "credit_transactions_job_id_idx" ON "credit_transactions"("job_id");

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
