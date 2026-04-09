/*
  Warnings:

  - You are about to drop the column `credits` on the `Balance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "credits",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 10;
