/*
  Warnings:

  - You are about to drop the column `credits` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `UserCredits` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balance` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserCredits" DROP CONSTRAINT "UserCredits_userId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "credits",
ADD COLUMN     "balance" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "credits",
ADD COLUMN     "balance" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserCredits";

-- CreateTable
CREATE TABLE "balance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "balance_userId_key" ON "balance"("userId");

-- AddForeignKey
ALTER TABLE "balance" ADD CONSTRAINT "balance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
