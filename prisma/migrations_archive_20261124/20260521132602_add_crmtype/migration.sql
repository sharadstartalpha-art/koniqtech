/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `crmType` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Made the column `externalId` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CRMType" AS ENUM ('roofing', 'hvac', 'plumbing', 'landscaping', 'cleaning');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "crmType" "CRMType" NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "externalId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_externalId_key" ON "Subscription"("externalId");
