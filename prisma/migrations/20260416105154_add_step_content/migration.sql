/*
  Warnings:

  - Added the required column `body` to the `CampaignStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `CampaignStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignStep" ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;
