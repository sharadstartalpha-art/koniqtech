/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileUrl]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_userId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "CampaignRecipient" ADD COLUMN     "sentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "category" TEXT,
ADD COLUMN     "companyKey" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "fundingStage" TEXT,
ADD COLUMN     "isHiring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nameKey" TEXT,
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "queryId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'raw',
ADD COLUMN     "techStack" TEXT[],
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "logs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scrapeStatus" TEXT NOT NULL DEFAULT 'idle',
    "enrichStatus" TEXT NOT NULL DEFAULT 'idle',
    "dedupStatus" TEXT NOT NULL DEFAULT 'idle',

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_profileUrl_key" ON "Lead"("profileUrl");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_profileUrl_idx" ON "Lead"("profileUrl");

-- CreateIndex
CREATE INDEX "Lead_companyKey_country_idx" ON "Lead"("companyKey", "country");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "Query"("id") ON DELETE SET NULL ON UPDATE CASCADE;
