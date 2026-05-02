/*
  Warnings:

  - You are about to drop the column `amount` on the `PaymentLink` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `PaymentLink` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PaymentLink_link_key";

-- AlterTable
ALTER TABLE "PaymentLink" DROP COLUMN "amount",
DROP COLUMN "link";
