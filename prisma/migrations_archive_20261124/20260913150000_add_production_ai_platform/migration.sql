-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('system', 'user', 'assistant', 'tool');

-- CreateEnum
CREATE TYPE "AiConversationStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "AiAgentStatus" AS ENUM ('active', 'inactive', 'draft');

-- CreateEnum
CREATE TYPE "AiToolType" AS ENUM ('crm_read', 'crm_write', 'communication', 'search', 'knowledge', 'analytics', 'scheduling', 'finance', 'system');

-- CreateEnum
CREATE TYPE "AiToolCallStatus" AS ENUM ('pending', 'running', 'completed', 'failed', 'rejected');

-- CreateEnum
CREATE TYPE "AiApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "AiWorkflowStatus" AS ENUM ('active', 'inactive', 'draft');

-- CreateEnum
CREATE TYPE "AiKnowledgeStatus" AS ENUM ('pending', 'processing', 'ready', 'failed', 'archived');

-- DropForeignKey
ALTER TABLE "AiLog" DROP CONSTRAINT "AiLog_orgId_fkey";

-- DropForeignKey
ALTER TABLE "AiLog" DROP CONSTRAINT "AiLog_userId_fkey";

-- AlterTable
ALTER TABLE "AiLog" ADD COLUMN     "estimatedCost" DECIMAL(12,6),
ADD COLUMN     "feature" TEXT,
ADD COLUMN     "inputTokens" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "outputTokens" INTEGER;

-- AlterTable
ALTER TABLE "OrganizationSettings" ADD COLUMN     "aiCanAct" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiDefaultModel" TEXT,
ADD COLUMN     "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aiKnowledgeEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aiMonthlyCreditLimit" INTEGER,
ADD COLUMN     "aiMonthlySpendLimit" DECIMAL(12,2),
ADD COLUMN     "aiRequireApproval" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "aiSettings" JSONB,
ADD COLUMN     "aiVoiceEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiWebSearchEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "status" "AiConversationStatus" NOT NULL DEFAULT 'active',
    "model" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AiMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "totalTokens" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAgent" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL,
    "model" TEXT,
    "status" "AiAgentStatus" NOT NULL DEFAULT 'draft',
    "temperature" DOUBLE PRECISION,
    "maxTokens" INTEGER,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "canAct" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAgentTool" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "AiToolType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiAgentTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiToolCall" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "conversationId" TEXT,
    "agentId" TEXT,
    "userId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "toolType" "AiToolType" NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "status" "AiToolCallStatus" NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiToolCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "feature" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(12,6),
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiKnowledgeSource" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "articleId" TEXT,
    "name" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "vectorStoreId" TEXT,
    "vectorFileId" TEXT,
    "status" "AiKnowledgeStatus" NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiKnowledgeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiWorkflow" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "agentId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerEvent" TEXT NOT NULL,
    "status" "AiWorkflowStatus" NOT NULL DEFAULT 'draft',
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiApproval" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "conversationId" TEXT,
    "userId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "AiApprovalStatus" NOT NULL DEFAULT 'pending',
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiConversation_orgId_idx" ON "AiConversation"("orgId");

-- CreateIndex
CREATE INDEX "AiConversation_userId_idx" ON "AiConversation"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_orgId_createdAt_idx" ON "AiConversation"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "AiMessage_createdAt_idx" ON "AiMessage"("createdAt");

-- CreateIndex
CREATE INDEX "AiAgent_orgId_idx" ON "AiAgent"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "AiAgent_orgId_slug_key" ON "AiAgent"("orgId", "slug");

-- CreateIndex
CREATE INDEX "AiAgentTool_agentId_idx" ON "AiAgentTool"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AiAgentTool_agentId_name_key" ON "AiAgentTool"("agentId", "name");

-- CreateIndex
CREATE INDEX "AiToolCall_orgId_idx" ON "AiToolCall"("orgId");

-- CreateIndex
CREATE INDEX "AiToolCall_userId_idx" ON "AiToolCall"("userId");

-- CreateIndex
CREATE INDEX "AiToolCall_conversationId_idx" ON "AiToolCall"("conversationId");

-- CreateIndex
CREATE INDEX "AiToolCall_agentId_idx" ON "AiToolCall"("agentId");

-- CreateIndex
CREATE INDEX "AiToolCall_createdAt_idx" ON "AiToolCall"("createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_orgId_idx" ON "AiUsage"("orgId");

-- CreateIndex
CREATE INDEX "AiUsage_userId_idx" ON "AiUsage"("userId");

-- CreateIndex
CREATE INDEX "AiUsage_createdAt_idx" ON "AiUsage"("createdAt");

-- CreateIndex
CREATE INDEX "AiUsage_orgId_createdAt_idx" ON "AiUsage"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_orgId_idx" ON "AiKnowledgeSource"("orgId");

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_articleId_idx" ON "AiKnowledgeSource"("articleId");

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_vectorStoreId_idx" ON "AiKnowledgeSource"("vectorStoreId");

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_status_idx" ON "AiKnowledgeSource"("status");

-- CreateIndex
CREATE INDEX "AiWorkflow_orgId_idx" ON "AiWorkflow"("orgId");

-- CreateIndex
CREATE INDEX "AiWorkflow_agentId_idx" ON "AiWorkflow"("agentId");

-- CreateIndex
CREATE INDEX "AiWorkflow_status_idx" ON "AiWorkflow"("status");

-- CreateIndex
CREATE INDEX "AiApproval_orgId_idx" ON "AiApproval"("orgId");

-- CreateIndex
CREATE INDEX "AiApproval_userId_idx" ON "AiApproval"("userId");

-- CreateIndex
CREATE INDEX "AiApproval_status_idx" ON "AiApproval"("status");

-- CreateIndex
CREATE INDEX "AiApproval_expiresAt_idx" ON "AiApproval"("expiresAt");

-- CreateIndex
CREATE INDEX "AiLog_orgId_idx" ON "AiLog"("orgId");

-- CreateIndex
CREATE INDEX "AiLog_userId_idx" ON "AiLog"("userId");

-- CreateIndex
CREATE INDEX "AiLog_createdAt_idx" ON "AiLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgentTool" ADD CONSTRAINT "AiAgentTool_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledgeSource" ADD CONSTRAINT "AiKnowledgeSource_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledgeSource" ADD CONSTRAINT "AiKnowledgeSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLog" ADD CONSTRAINT "AiLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLog" ADD CONSTRAINT "AiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
