-- AlterTable
ALTER TABLE "CampaignRecipient" ADD COLUMN     "repliedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CampaignRecipient_campaignId_idx" ON "CampaignRecipient"("campaignId");
