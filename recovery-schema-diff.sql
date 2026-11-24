-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "locationId" TEXT;

-- CreateIndex
CREATE INDEX "Opportunity_orgId_idx" ON "Opportunity"("orgId");

-- CreateIndex
CREATE INDEX "Opportunity_orgId_locationId_idx" ON "Opportunity"("orgId", "locationId");

-- CreateIndex
CREATE INDEX "Opportunity_ownerId_idx" ON "Opportunity"("ownerId");

-- CreateIndex
CREATE INDEX "Opportunity_leadId_idx" ON "Opportunity"("leadId");

-- CreateIndex
CREATE INDEX "Opportunity_customerId_idx" ON "Opportunity"("customerId");

-- CreateIndex
CREATE INDEX "Opportunity_orgId_stage_idx" ON "Opportunity"("orgId", "stage");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
