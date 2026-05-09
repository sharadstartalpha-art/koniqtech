/*
  Warnings:

  - You are about to drop the column `daysAfter` on the `ReminderSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `ReminderSchedule` table. All the data in the column will be lost.
  - Added the required column `invoiceId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mode` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sendAt` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step` to the `ReminderSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('pending', 'sent', 'failed');

-- DropIndex
DROP INDEX "ReminderSchedule_userId_type_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReminderSchedule" DROP COLUMN "daysAfter",
DROP COLUMN "enabled",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "invoiceId" TEXT NOT NULL,
ADD COLUMN     "mode" "ReminderMode" NOT NULL,
ADD COLUMN     "sendAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ReminderStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "step" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReminderSchedule" ADD CONSTRAINT "ReminderSchedule_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
