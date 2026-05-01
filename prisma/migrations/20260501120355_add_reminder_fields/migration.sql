/*
  Warnings:

  - Added the required column `amount` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Made the column `sentAt` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "clicked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "opens" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "sentAt" SET NOT NULL,
ALTER COLUMN "sentAt" SET DEFAULT CURRENT_TIMESTAMP;
