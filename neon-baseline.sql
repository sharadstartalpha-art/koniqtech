-- CreateEnum
CREATE TYPE "AiAgentStatus" AS ENUM ('active', 'inactive', 'draft');

-- CreateEnum
CREATE TYPE "AiApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "AiConversationStatus" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "AiKnowledgeStatus" AS ENUM ('pending', 'processing', 'ready', 'failed', 'archived');

-- CreateEnum
CREATE TYPE "AiLeadCandidateStatus" AS ENUM ('discovered', 'qualified', 'disqualified', 'imported', 'dismissed');

-- CreateEnum
CREATE TYPE "AiLeadSearchStatus" AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('system', 'user', 'assistant', 'tool');

-- CreateEnum
CREATE TYPE "AiToolCallStatus" AS ENUM ('pending', 'running', 'completed', 'failed', 'rejected');

-- CreateEnum
CREATE TYPE "AiToolType" AS ENUM ('crm_read', 'crm_write', 'communication', 'search', 'knowledge', 'analytics', 'scheduling', 'finance', 'system');

-- CreateEnum
CREATE TYPE "AiWorkflowStatus" AS ENUM ('active', 'inactive', 'draft');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AssetAssignmentStatus" AS ENUM ('active', 'returned', 'lost', 'damaged');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('vehicle', 'laptop', 'desktop', 'tablet', 'mobile', 'printer', 'monitor', 'networking', 'server', 'tool', 'machinery', 'equipment', 'furniture', 'safety_equipment', 'software', 'license', 'other');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('excellent', 'good', 'fair', 'damaged', 'broken');

-- CreateEnum
CREATE TYPE "AssetMaintenanceType" AS ENUM ('inspection', 'preventive', 'repair', 'calibration', 'cleaning', 'replacement', 'software_update');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('available', 'assigned', 'maintenance', 'lost', 'retired', 'disposed');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('present', 'absent', 'late', 'half_day', 'leave', 'holiday', 'weekend', 'work_from_home');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('monthly', 'quarterly', 'yearly');

-- CreateEnum
CREATE TYPE "CRMType" AS ENUM ('roofing', 'hvac', 'plumbing', 'landscaping', 'cleaning');

-- CreateEnum
CREATE TYPE "CampaignChannel" AS ENUM ('email', 'social', 'ads', 'sms', 'webinar');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('draft', 'running', 'paused', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('new', 'imported', 'verified', 'researching', 'contacted', 'assigned', 'replied', 'demo_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost', 'archived', 'rejected');

-- CreateEnum
CREATE TYPE "DemoFollowUpStatus" AS ENUM ('pending', 'contacted', 'interested', 'trial', 'negotiation', 'won', 'lost', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "DemoFollowUpType" AS ENUM ('call', 'email', 'sms', 'whatsapp', 'meeting', 'trial', 'pricing', 'negotiation');

-- CreateEnum
CREATE TYPE "DemoStatus" AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show');

-- CreateEnum
CREATE TYPE "EmailQueueStatus" AS ENUM ('queued', 'processing', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "EmployeeDocumentCategory" AS ENUM ('id_proof', 'passport', 'visa', 'driving_license', 'contract', 'nda', 'offer_letter', 'salary', 'appraisal', 'certification', 'training', 'insurance', 'medical', 'police_verification', 'tax', 'other');

-- CreateEnum
CREATE TYPE "FleetStatus" AS ENUM ('active', 'maintenance', 'inactive', 'sold');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('roofing', 'hvac', 'plumbing', 'landscaping');

-- CreateEnum
CREATE TYPE "InventoryReferenceType" AS ENUM ('PURCHASE_ORDER', 'SALES_ORDER', 'STOCK_TRANSFER', 'INVENTORY_ADJUSTMENT', 'INVENTORY_COUNT', 'PRODUCTION_ORDER', 'MANUAL');

-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('PURCHASE', 'SALE', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'RETURN_IN', 'RETURN_OUT', 'PRODUCTION_IN', 'PRODUCTION_OUT', 'OPENING_STOCK', 'STOCK_COUNT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('google_maps', 'facebook', 'linkedin', 'website', 'manual', 'import', 'referral');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'estimate', 'won', 'lost', 'converted');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('casual', 'sick', 'earned', 'unpaid', 'maternity', 'paternity', 'emergency');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "MarketingTemplateCategory" AS ENUM ('campaign', 'newsletter', 'demo_invitation', 'demo_reminder', 'follow_up', 'sales_outreach', 'trial', 'onboarding', 're_engagement', 'custom');

-- CreateEnum
CREATE TYPE "MarketingTemplateStatus" AS ENUM ('active', 'inactive', 'archived');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('sms', 'email', 'whatsapp', 'internal');

-- CreateEnum
CREATE TYPE "NewsletterAudience" AS ENUM ('all', 'prospects', 'customers', 'trial', 'inactive');

-- CreateEnum
CREATE TYPE "NewsletterAudienceType" AS ENUM ('all_leads', 'qualified_leads', 'demo_scheduled', 'demo_completed', 'trial_users', 'custom');

-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('draft', 'scheduled', 'queued', 'sending', 'sent', 'partially_failed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'cheque', 'bank_transfer', 'ach', 'paypal', 'stripe', 'credit_card', 'debit_card', 'wire', 'other');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('super_admin', 'user');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('draft', 'approved', 'ordered', 'partially_received', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('pending', 'queued', 'scheduled', 'processing', 'sending', 'sent', 'delivered', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('draft', 'sent', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('pending', 'processed', 'paid', 'failed');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('monthly', 'hourly', 'contract');

-- CreateEnum
CREATE TYPE "SalesStage" AS ENUM ('new', 'contacted', 'demo', 'proposal', 'negotiation', 'won', 'lost');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('starter', 'professional', 'enterprise');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('trial', 'active', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "ActivityTimeline" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityTimeline_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "AiApproval" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
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

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT,
    "title" TEXT,
    "status" "AiConversationStatus" NOT NULL DEFAULT 'active',
    "model" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiExecution" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
    "userId" TEXT,
    "agentId" TEXT,
    "conversationId" TEXT,
    "workflowId" TEXT,
    "feature" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "model" TEXT,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(12,6),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiFeedback" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "locationId" TEXT,
    "conversationId" TEXT,
    "messageId" TEXT,
    "executionId" TEXT,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "category" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiKnowledgeChunk" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
    "sourceId" TEXT NOT NULL,
    "articleId" TEXT,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER,
    "embeddingId" TEXT,
    "vectorId" TEXT,
    "contentHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiKnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiKnowledgeSource" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
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
CREATE TABLE "AiLeadCandidate" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "website" TEXT,
    "businessPhone" TEXT,
    "industry" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "sourceUrl" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "matchScore" INTEGER,
    "matchReasons" JSONB,
    "status" "AiLeadCandidateStatus" NOT NULL DEFAULT 'discovered',
    "importedLeadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiLeadCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLeadSearch" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "industry" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'USA',
    "filters" JSONB,
    "provider" TEXT,
    "status" "AiLeadSearchStatus" NOT NULL DEFAULT 'queued',
    "requestedCount" INTEGER NOT NULL DEFAULT 25,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(12,6),
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiLeadSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLeadSearchResult" (
    "id" TEXT NOT NULL,
    "searchId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "rank" INTEGER,
    "matchScore" INTEGER,
    "matchReasons" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiLeadSearchResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "model" TEXT,
    "feature" TEXT,
    "tokens" INTEGER,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "estimatedCost" DECIMAL(12,6),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMemory" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
    "userId" TEXT,
    "customerId" TEXT,
    "leadId" TEXT,
    "jobId" TEXT,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "importance" INTEGER NOT NULL DEFAULT 50,
    "source" TEXT,
    "confidence" DOUBLE PRECISION,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiMemory_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "AiPromptTemplate" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "userPromptTemplate" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "model" TEXT,
    "temperature" DOUBLE PRECISION,
    "maxTokens" INTEGER,
    "variables" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiToolCall" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
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
CREATE TABLE "AiWorkflowRun" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT,
    "workflowId" TEXT NOT NULL,
    "agentId" TEXT,
    "status" TEXT NOT NULL,
    "triggerEvent" TEXT,
    "input" JSONB,
    "output" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiWorkflowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "permissions" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER,
    "ipAddress" TEXT,
    "request" JSONB,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL,
    "reason" TEXT,
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "serialNumber" TEXT,
    "manufacturer" TEXT,
    "model" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DECIMAL(12,2),
    "warrantyExpiry" TIMESTAMP(3),
    "condition" "AssetCondition" NOT NULL DEFAULT 'good',
    "status" "AssetStatus" NOT NULL DEFAULT 'available',
    "currentValue" DECIMAL(12,2),
    "location" TEXT,
    "qrCode" TEXT,
    "barcode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAssignment" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "expectedReturnDate" TIMESTAMP(3),
    "returnedDate" TIMESTAMP(3),
    "assignedBy" TEXT,
    "receivedBy" TEXT,
    "status" "AssetAssignmentStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetMaintenance" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "maintenanceType" "AssetMaintenanceType" NOT NULL,
    "vendor" TEXT,
    "cost" DECIMAL(12,2),
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "description" TEXT,
    "technician" TEXT,
    "invoiceNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Automation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationStep" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "AutomationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeOrder" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "ChangeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloseoutPackage" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "notes" TEXT,
    "finalInspectionPassed" BOOLEAN NOT NULL DEFAULT false,
    "customerSignOff" BOOLEAN NOT NULL DEFAULT false,
    "warrantyUploaded" BOOLEAN NOT NULL DEFAULT false,
    "photosUploaded" BOOLEAN NOT NULL DEFAULT false,
    "invoicePaid" BOOLEAN NOT NULL DEFAULT false,
    "completionCertificate" BOOLEAN NOT NULL DEFAULT false,
    "crewSignOff" BOOLEAN NOT NULL DEFAULT false,
    "completionDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CloseoutPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyContact" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "linkedin" TEXT,
    "notes" TEXT,

    CONSTRAINT "CompanyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyLead" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "ownerName" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "primaryEmail" TEXT,
    "primaryPhone" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "address" TEXT,
    "googleRating" DOUBLE PRECISION,
    "facebook" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "notes" TEXT,
    "source" "LeadSource" NOT NULL,
    "status" "CompanyStatus" NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractNumber" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "contractType" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "value" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewAssignment" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrewAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "leadId" TEXT,
    "companyName" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerActivity" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerFile" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT,

    CONSTRAINT "CustomerFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerNote" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationRoleId" TEXT,

    CONSTRAINT "CustomerNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "probability" INTEGER,
    "assignedTo" TEXT,
    "expectedClose" TIMESTAMP(3),

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoFollowUp" (
    "id" TEXT NOT NULL,
    "demoScheduleId" TEXT NOT NULL,
    "marketingEmployeeId" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3) NOT NULL,
    "type" "DemoFollowUpType" NOT NULL,
    "status" "DemoFollowUpStatus" NOT NULL DEFAULT 'pending',
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoSchedule" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "marketingEmployeeId" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "meetingLink" TEXT,
    "status" "DemoStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "color" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchBoard" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dispatchDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispatchBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispatchJob" (
    "id" TEXT NOT NULL,
    "dispatchBoardId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "technicianId" TEXT,
    "vehicleId" TEXT,
    "priority" TEXT NOT NULL,
    "estimatedArrival" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DispatchJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailQueue" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT[],
    "bcc" TEXT[],
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "departmentId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "managerId" TEXT,
    "designation" TEXT,
    "avatar" TEXT,
    "joiningDate" TIMESTAMP(3),
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "bloodGroup" TEXT,
    "employmentType" TEXT,
    "salaryType" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "upiId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeActivity" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAttendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "attendanceDate" TIMESTAMP(3) NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "breakMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalHours" DOUBLE PRECISION,
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "AttendanceStatus" NOT NULL,
    "workLocation" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "ipAddress" TEXT,
    "device" TEXT,
    "remarks" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeDocument" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "EmployeeDocumentCategory" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "expiryDate" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeLeave" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "attachment" TEXT,
    "status" "LeaveStatus" NOT NULL,
    "managerRemarks" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeLeave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "canAssign" BOOLEAN NOT NULL DEFAULT false,
    "canExport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSalary" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "salaryType" "SalaryType" NOT NULL,
    "basicSalary" DECIMAL(12,2) NOT NULL,
    "hra" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "allowance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "bonus" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "incentive" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "overtime" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "netSalary" DECIMAL(12,2) NOT NULL,
    "payMonth" INTEGER NOT NULL,
    "payYear" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "status" "SalaryStatus" NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSession" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "ip" TEXT,
    "browser" TEXT,
    "device" TEXT,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTask" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "jobId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetAssignment" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FleetAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetFuelLog" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "filledById" TEXT NOT NULL,
    "liters" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "odometer" DOUBLE PRECISION NOT NULL,
    "fuelStation" TEXT,
    "receipt" TEXT,
    "filledAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetFuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetInspection" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "inspectedById" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "FleetInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetLocation" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetMaintenance" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "vendor" TEXT,
    "cost" DOUBLE PRECISION,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "nextServiceDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "FleetMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetTrip" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "startLatitude" DOUBLE PRECISION,
    "startLongitude" DOUBLE PRECISION,
    "endLatitude" DOUBLE PRECISION,
    "endLongitude" DOUBLE PRECISION,
    "startOdometer" DOUBLE PRECISION,
    "endOdometer" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "duration" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'running',

    CONSTRAINT "FleetTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetVehicle" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "color" TEXT,
    "vin" TEXT,
    "registrationNumber" TEXT,
    "insuranceNumber" TEXT,
    "insuranceExpiry" TIMESTAMP(3),
    "gpsDeviceId" TEXT,
    "fuelType" TEXT,
    "odometer" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driverId" TEXT,

    CONSTRAINT "FleetVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HvacUnit" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "model" TEXT,
    "serialNo" TEXT,
    "installDate" TIMESTAMP(3),

    CONSTRAINT "HvacUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpersonationSession" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImpersonationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryAdjustment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "reason" TEXT,
    "adjustedById" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryCount" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "expectedQty" DOUBLE PRECISION NOT NULL,
    "countedQty" DOUBLE PRECISION NOT NULL,
    "variance" DOUBLE PRECISION NOT NULL,
    "countedById" TEXT NOT NULL,
    "countedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "unit" TEXT,
    "unitPrice" DECIMAL(65,30),
    "reorderLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransfer" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "fromWarehouseId" TEXT NOT NULL,
    "toWarehouseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transferDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "archivedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "quoteId" TEXT,
    "title" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'scheduled',
    "technicianId" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobMilestone" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobNote" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobTask" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "dependsOnId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeArticle" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeAttachment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeCategory" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeComment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeFavorite" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeView" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "employeeId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandscapingProject" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "yardArea" DECIMAL(10,2),
    "irrigation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LandscapingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "source" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "budget" DOUBLE PRECISION,
    "priority" TEXT DEFAULT 'Medium',
    "tags" TEXT,
    "attachment" TEXT,
    "industry" "Industry",
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingCampaign" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channel" "CampaignChannel" NOT NULL,
    "budget" DECIMAL(65,30),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingCampaignLead" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "companyLeadId" TEXT NOT NULL,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "attributedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingCampaignLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingNewsletter" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "previewText" TEXT,
    "content" TEXT NOT NULL,
    "audience" "NewsletterAudience" NOT NULL DEFAULT 'all',
    "status" "NewsletterStatus" NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingNewsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingTemplate" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "MarketingTemplateCategory" NOT NULL,
    "subject" TEXT,
    "previewText" TEXT,
    "content" TEXT NOT NULL,
    "status" "MarketingTemplateStatus" NOT NULL DEFAULT 'active',
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialRequest" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'requested',

    CONSTRAINT "MaterialRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT,
    "title" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'new',
    "value" DOUBLE PRECISION,
    "probability" INTEGER,
    "expectedCloseDate" TIMESTAMP(3),
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "source" TEXT,
    "ownerId" TEXT,
    "contractId" TEXT,
    "quoteId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" "Industry",
    "crmType" "CRMType" NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'starter',
    "logo" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "currency" TEXT DEFAULT 'USD',
    "language" TEXT DEFAULT 'en',
    "taxNumber" TEXT,
    "businessNumber" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "usersLimit" INTEGER NOT NULL DEFAULT 5,
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationLocation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "currency" TEXT DEFAULT 'USD',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationRole" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSettings" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "timezone" TEXT,
    "currency" TEXT,
    "branding" JSONB,
    "integrations" JSONB,
    "aiEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiDefaultModel" TEXT,
    "aiRequireApproval" BOOLEAN NOT NULL DEFAULT true,
    "aiCanAct" BOOLEAN NOT NULL DEFAULT false,
    "aiKnowledgeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiWebSearchEnabled" BOOLEAN NOT NULL DEFAULT false,
    "aiVoiceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "aiMonthlyCreditLimit" INTEGER,
    "aiMonthlySpendLimit" DECIMAL(12,2),
    "aiSettings" JSONB,

    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineStage" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PipelineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "code" "SubscriptionPlan" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "userLimit" INTEGER NOT NULL DEFAULT 5,
    "maxLocations" INTEGER NOT NULL DEFAULT 1,
    "storageLimit" INTEGER NOT NULL DEFAULT 20,
    "aiCredits" INTEGER NOT NULL DEFAULT 1000,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlumbingAsset" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "fixtureType" TEXT,
    "location" TEXT,

    CONSTRAINT "PlumbingAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PunchItem" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PunchItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "jobId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shipping" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "orderedAt" TIMESTAMP(3),
    "expectedDate" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "inventoryItemId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "quoteNumber" TEXT NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'draft',
    "validUntil" TIMESTAMP(3),
    "notes" TEXT,
    "terms" TEXT,
    "discount" DECIMAL(12,2),
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "qty" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2),
    "discount" DECIMAL(12,2),
    "total" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canImport" BOOLEAN NOT NULL DEFAULT false,
    "canExport" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,
    "canAssign" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoofingProject" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "roofType" TEXT,
    "material" TEXT,
    "areaSqft" DECIMAL(10,2),
    "insuranceClaim" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RoofingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteOptimization" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "routeDate" TIMESTAMP(3) NOT NULL,
    "totalDistance" DOUBLE PRECISION,
    "totalDuration" INTEGER,
    "optimized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RouteOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutePlan" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "technicianId" TEXT,
    "distance" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoutePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "optimizationId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    "eta" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesPipeline" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "salesEmployeeId" TEXT NOT NULL,
    "stage" "SalesStage" NOT NULL,
    "expectedRevenue" DECIMAL(65,30),
    "notes" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesPipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsQueue" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT,
    "customerId" TEXT,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'trial',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'monthly',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "renewAt" TIMESTAMP(3),
    "nextInvoiceDate" TIMESTAMP(3),
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "interval" TEXT NOT NULL DEFAULT 'month',
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "userLimit" INTEGER NOT NULL DEFAULT 5,
    "maxLocations" INTEGER NOT NULL DEFAULT 1,
    "storageLimit" INTEGER NOT NULL DEFAULT 20,
    "aiCredits" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionCancellationOtp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verifiedAt" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionCancellationOtp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "paypalPaymentId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "adminNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemIntegration" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "apiKey" TEXT,
    "webhookSecret" TEXT,
    "configuration" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "departmentId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "leaderId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInvitation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "roleId" TEXT NOT NULL,
    "teamId" TEXT,
    "invitedById" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInvitationLocation" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "TeamInvitationLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicianLocation" (
    "id" TEXT NOT NULL,
    "techId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechnicianLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgress" (
    "id" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "role" "PlatformRole" NOT NULL DEFAULT 'user',
    "organizationRoleId" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "departmentId" TEXT,
    "teamId" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "welcomeSeen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityTimeline" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivityTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnnouncement" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnnouncementRead" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnnouncementRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApiKey" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "permissions" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAsset" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "warrantyExpiry" TIMESTAMP(3),
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "qrCode" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssetAssignment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "serialNumber" TEXT,
    "assignedDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "notes" TEXT,
    "assignedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userAssetId" TEXT,

    CONSTRAINT "UserAssetAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssetCategory" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssetCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssetHistory" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "remarks" TEXT,
    "performedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAssetId" TEXT,

    CONSTRAINT "UserAssetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssetMaintenance" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "maintenanceDate" TIMESTAMP(3) NOT NULL,
    "nextMaintenance" TIMESTAMP(3),
    "vendor" TEXT,
    "cost" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdById" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssetMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAttendance" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "totalHours" DOUBLE PRECISION,
    "overtime" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'present',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatChannel" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserChatChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatMember" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChatMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatMessage" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachment" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChecklist" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChecklistItem" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserComment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCommission" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "percentage" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "earnedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCommission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDailyReport" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "completedJobs" INTEGER NOT NULL DEFAULT 0,
    "hoursWorked" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "expiryDate" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEmailQueue" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "newsletterId" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "template" TEXT,
    "provider" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEmailQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEquipment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "customerId" TEXT,
    "jobId" TEXT,
    "equipmentName" TEXT NOT NULL,
    "manufacturer" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "installDate" TIMESTAMP(3),
    "warrantyExpiry" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEquipmentService" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "jobId" TEXT,
    "technicianId" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "serviceType" TEXT NOT NULL,
    "notes" TEXT,
    "nextService" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEquipmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExpense" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGoal" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetValue" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInspection" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "passed" BOOLEAN,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInspectionItem" (
    "id" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "UserInspectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobDocument" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserJobDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobPhoto" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserJobPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobSignature" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserJobSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLeave" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLeave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMaintenanceReminder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assetId" TEXT,
    "equipmentId" TEXT,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMaintenanceReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMeeting" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "meetingUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMeetingAttendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "joinedAt" TIMESTAMP(3),

    CONSTRAINT "UserMeetingAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNote" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPayroll" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basicSalary" DOUBLE PRECISION NOT NULL,
    "overtime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allowance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPayroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPerformance" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reviewPeriod" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "goalsCompleted" INTEGER NOT NULL DEFAULT 0,
    "attendanceScore" DOUBLE PRECISION,
    "qualityScore" DOUBLE PRECISION,
    "productivityScore" DOUBLE PRECISION,
    "reviewerId" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "canExport" BOOLEAN NOT NULL DEFAULT false,
    "canApprove" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'en',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReminder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reminderAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReporting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReporting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoute" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "routeDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "totalDistance" DOUBLE PRECISION,
    "totalDuration" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRouteStop" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "jobId" TEXT,
    "customerId" TEXT,
    "sequence" INTEGER NOT NULL,
    "arrivalTime" TIMESTAMP(3),
    "departureTime" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserRouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSchedule" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "shiftName" TEXT,
    "location" TEXT,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSignature" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "initials" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSmsQueue" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "provider" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retries" INTEGER NOT NULL DEFAULT 0,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSmsQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTask" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTimesheet" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTimesheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToolCheckout" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "expectedReturn" TIMESTAMP(3),
    "returnedDate" TIMESTAMP(3),
    "conditionOut" TEXT,
    "conditionIn" TEXT,
    "notes" TEXT,

    CONSTRAINT "UserToolCheckout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTraining" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructor" TEXT,
    "durationHours" DOUBLE PRECISION,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWarranty" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "assetId" TEXT,
    "warrantyNumber" TEXT,
    "provider" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "coverage" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWarranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWebhook" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "secret" TEXT,
    "events" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggeredAt" TIMESTAMP(3),
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkOrder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "alternatePhone" TEXT,
    "website" TEXT,
    "taxNumber" TEXT,
    "paymentTerms" TEXT,
    "currency" TEXT,
    "rating" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorContact" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorPayment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "referenceNo" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VendorPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "managerId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseStock" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "minimumStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maximumStock" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseTransaction" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "transactionType" "InventoryTransactionType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "previousQty" DOUBLE PRECISION NOT NULL,
    "resultingQty" DOUBLE PRECISION NOT NULL,
    "referenceType" "InventoryReferenceType",
    "referenceId" TEXT,
    "notes" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "secret" TEXT,
    "events" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookDelivery" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "responseCode" INTEGER,
    "responseBody" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityTimeline_createdAt_idx" ON "ActivityTimeline"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ActivityTimeline_entityId_idx" ON "ActivityTimeline"("entityId" ASC);

-- CreateIndex
CREATE INDEX "ActivityTimeline_entity_idx" ON "ActivityTimeline"("entity" ASC);

-- CreateIndex
CREATE INDEX "ActivityTimeline_orgId_idx" ON "ActivityTimeline"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiAgent_orgId_idx" ON "AiAgent"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiAgent_orgId_slug_key" ON "AiAgent"("orgId" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "AiAgentTool_agentId_idx" ON "AiAgentTool"("agentId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiAgentTool_agentId_name_key" ON "AiAgentTool"("agentId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "AiApproval_expiresAt_idx" ON "AiApproval"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "AiApproval_orgId_idx" ON "AiApproval"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiApproval_orgId_locationId_idx" ON "AiApproval"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "AiApproval_status_idx" ON "AiApproval"("status" ASC);

-- CreateIndex
CREATE INDEX "AiApproval_userId_idx" ON "AiApproval"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiConversation_orgId_createdAt_idx" ON "AiConversation"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiConversation_orgId_idx" ON "AiConversation"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiConversation_userId_idx" ON "AiConversation"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_agentId_idx" ON "AiExecution"("agentId" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_conversationId_idx" ON "AiExecution"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_orgId_createdAt_idx" ON "AiExecution"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_orgId_idx" ON "AiExecution"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_status_idx" ON "AiExecution"("status" ASC);

-- CreateIndex
CREATE INDEX "AiExecution_workflowId_idx" ON "AiExecution"("workflowId" ASC);

-- CreateIndex
CREATE INDEX "AiFeedback_conversationId_idx" ON "AiFeedback"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "AiFeedback_executionId_idx" ON "AiFeedback"("executionId" ASC);

-- CreateIndex
CREATE INDEX "AiFeedback_messageId_idx" ON "AiFeedback"("messageId" ASC);

-- CreateIndex
CREATE INDEX "AiFeedback_orgId_idx" ON "AiFeedback"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiFeedback_rating_idx" ON "AiFeedback"("rating" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeChunk_articleId_idx" ON "AiKnowledgeChunk"("articleId" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeChunk_contentHash_idx" ON "AiKnowledgeChunk"("contentHash" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeChunk_orgId_idx" ON "AiKnowledgeChunk"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeChunk_orgId_sourceId_idx" ON "AiKnowledgeChunk"("orgId" ASC, "sourceId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiKnowledgeChunk_sourceId_chunkIndex_key" ON "AiKnowledgeChunk"("sourceId" ASC, "chunkIndex" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeChunk_sourceId_idx" ON "AiKnowledgeChunk"("sourceId" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_articleId_idx" ON "AiKnowledgeSource"("articleId" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_orgId_idx" ON "AiKnowledgeSource"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_status_idx" ON "AiKnowledgeSource"("status" ASC);

-- CreateIndex
CREATE INDEX "AiKnowledgeSource_vectorStoreId_idx" ON "AiKnowledgeSource"("vectorStoreId" ASC);

-- CreateIndex
CREATE INDEX "AiLeadCandidate_orgId_city_industry_idx" ON "AiLeadCandidate"("orgId" ASC, "city" ASC, "industry" ASC);

-- CreateIndex
CREATE INDEX "AiLeadCandidate_orgId_createdAt_idx" ON "AiLeadCandidate"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiLeadCandidate_orgId_source_externalId_key" ON "AiLeadCandidate"("orgId" ASC, "source" ASC, "externalId" ASC);

-- CreateIndex
CREATE INDEX "AiLeadCandidate_orgId_status_idx" ON "AiLeadCandidate"("orgId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "AiLeadSearch_orgId_createdAt_idx" ON "AiLeadSearch"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiLeadSearch_orgId_locationId_idx" ON "AiLeadSearch"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "AiLeadSearch_orgId_status_idx" ON "AiLeadSearch"("orgId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "AiLeadSearch_userId_idx" ON "AiLeadSearch"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiLeadSearchResult_candidateId_idx" ON "AiLeadSearchResult"("candidateId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiLeadSearchResult_searchId_candidateId_key" ON "AiLeadSearchResult"("searchId" ASC, "candidateId" ASC);

-- CreateIndex
CREATE INDEX "AiLog_createdAt_idx" ON "AiLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiLog_orgId_idx" ON "AiLog"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiLog_userId_idx" ON "AiLog"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_category_idx" ON "AiMemory"("orgId" ASC, "category" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_customerId_idx" ON "AiMemory"("orgId" ASC, "customerId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_idx" ON "AiMemory"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_jobId_idx" ON "AiMemory"("orgId" ASC, "jobId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_leadId_idx" ON "AiMemory"("orgId" ASC, "leadId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_locationId_idx" ON "AiMemory"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "AiMemory_orgId_userId_idx" ON "AiMemory"("orgId" ASC, "userId" ASC);

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "AiMessage_createdAt_idx" ON "AiMessage"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiPromptTemplate_active_idx" ON "AiPromptTemplate"("active" ASC);

-- CreateIndex
CREATE INDEX "AiPromptTemplate_key_idx" ON "AiPromptTemplate"("key" ASC);

-- CreateIndex
CREATE INDEX "AiPromptTemplate_orgId_idx" ON "AiPromptTemplate"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AiPromptTemplate_orgId_key_key" ON "AiPromptTemplate"("orgId" ASC, "key" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_agentId_idx" ON "AiToolCall"("agentId" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_conversationId_idx" ON "AiToolCall"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_createdAt_idx" ON "AiToolCall"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_orgId_idx" ON "AiToolCall"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_orgId_locationId_idx" ON "AiToolCall"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "AiToolCall_userId_idx" ON "AiToolCall"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiUsage_createdAt_idx" ON "AiUsage"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiUsage_orgId_createdAt_idx" ON "AiUsage"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiUsage_orgId_idx" ON "AiUsage"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiUsage_userId_idx" ON "AiUsage"("userId" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflow_agentId_idx" ON "AiWorkflow"("agentId" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflow_orgId_idx" ON "AiWorkflow"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflow_status_idx" ON "AiWorkflow"("status" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflowRun_orgId_createdAt_idx" ON "AiWorkflowRun"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflowRun_orgId_idx" ON "AiWorkflowRun"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflowRun_orgId_locationId_idx" ON "AiWorkflowRun"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflowRun_status_idx" ON "AiWorkflowRun"("status" ASC);

-- CreateIndex
CREATE INDEX "AiWorkflowRun_workflowId_idx" ON "AiWorkflowRun"("workflowId" ASC);

-- CreateIndex
CREATE INDEX "ApiKey_active_idx" ON "ApiKey"("active" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_key_key" ON "ApiKey"("key" ASC);

-- CreateIndex
CREATE INDEX "ApiKey_orgId_idx" ON "ApiKey"("orgId" ASC);

-- CreateIndex
CREATE INDEX "ApiLog_apiKeyId_idx" ON "ApiLog"("apiKeyId" ASC);

-- CreateIndex
CREATE INDEX "ApiLog_createdAt_idx" ON "ApiLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ApiLog_orgId_idx" ON "ApiLog"("orgId" ASC);

-- CreateIndex
CREATE INDEX "Approval_companyId_idx" ON "Approval"("companyId" ASC);

-- CreateIndex
CREATE INDEX "Approval_employeeId_idx" ON "Approval"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "Asset_assetCode_idx" ON "Asset"("assetCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetCode_key" ON "Asset"("assetCode" ASC);

-- CreateIndex
CREATE INDEX "Asset_category_idx" ON "Asset"("category" ASC);

-- CreateIndex
CREATE INDEX "Asset_orgId_idx" ON "Asset"("orgId" ASC);

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status" ASC);

-- CreateIndex
CREATE INDEX "AssetAssignment_assetId_idx" ON "AssetAssignment"("assetId" ASC);

-- CreateIndex
CREATE INDEX "AssetAssignment_employeeId_idx" ON "AssetAssignment"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "AssetAssignment_status_idx" ON "AssetAssignment"("status" ASC);

-- CreateIndex
CREATE INDEX "AssetMaintenance_assetId_idx" ON "AssetMaintenance"("assetId" ASC);

-- CreateIndex
CREATE INDEX "AssetMaintenance_scheduledDate_idx" ON "AssetMaintenance"("scheduledDate" ASC);

-- CreateIndex
CREATE INDEX "AssetMaintenance_status_idx" ON "AssetMaintenance"("status" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_orgId_idx" ON "AuditLog"("orgId" ASC);

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "CloseoutPackage_jobId_key" ON "CloseoutPackage"("jobId" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_assignedTo_idx" ON "CompanyLead"("assignedTo" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_city_idx" ON "CompanyLead"("city" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_companyName_idx" ON "CompanyLead"("companyName" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_country_idx" ON "CompanyLead"("country" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_orgId_idx" ON "CompanyLead"("orgId" ASC);

-- CreateIndex
CREATE INDEX "CompanyLead_status_idx" ON "CompanyLead"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_leadId_key" ON "Customer"("leadId" ASC);

-- CreateIndex
CREATE INDEX "Customer_locationId_idx" ON "Customer"("locationId" ASC);

-- CreateIndex
CREATE INDEX "Customer_orgId_locationId_idx" ON "Customer"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "CustomerFile_customerId_idx" ON "CustomerFile"("customerId" ASC);

-- CreateIndex
CREATE INDEX "CustomerFile_orgId_idx" ON "CustomerFile"("orgId" ASC);

-- CreateIndex
CREATE INDEX "CustomerNote_customerId_idx" ON "CustomerNote"("customerId" ASC);

-- CreateIndex
CREATE INDEX "CustomerNote_orgId_idx" ON "CustomerNote"("orgId" ASC);

-- CreateIndex
CREATE INDEX "DemoFollowUp_demoScheduleId_idx" ON "DemoFollowUp"("demoScheduleId" ASC);

-- CreateIndex
CREATE INDEX "DemoFollowUp_followUpDate_idx" ON "DemoFollowUp"("followUpDate" ASC);

-- CreateIndex
CREATE INDEX "DemoFollowUp_marketingEmployeeId_idx" ON "DemoFollowUp"("marketingEmployeeId" ASC);

-- CreateIndex
CREATE INDEX "DemoFollowUp_status_idx" ON "DemoFollowUp"("status" ASC);

-- CreateIndex
CREATE INDEX "DemoFollowUp_type_idx" ON "DemoFollowUp"("type" ASC);

-- CreateIndex
CREATE INDEX "DemoSchedule_companyId_idx" ON "DemoSchedule"("companyId" ASC);

-- CreateIndex
CREATE INDEX "DemoSchedule_createdByUserId_idx" ON "DemoSchedule"("createdByUserId" ASC);

-- CreateIndex
CREATE INDEX "DemoSchedule_marketingEmployeeId_idx" ON "DemoSchedule"("marketingEmployeeId" ASC);

-- CreateIndex
CREATE INDEX "DemoSchedule_meetingDate_idx" ON "DemoSchedule"("meetingDate" ASC);

-- CreateIndex
CREATE INDEX "DemoSchedule_status_idx" ON "DemoSchedule"("status" ASC);

-- CreateIndex
CREATE INDEX "Department_orgId_idx" ON "Department"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Department_orgId_name_key" ON "Department"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "EmailQueue_orgId_idx" ON "EmailQueue"("orgId" ASC);

-- CreateIndex
CREATE INDEX "EmailQueue_status_idx" ON "EmailQueue"("status" ASC);

-- CreateIndex
CREATE INDEX "Employee_active_idx" ON "Employee"("active" ASC);

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode" ASC);

-- CreateIndex
CREATE INDEX "Employee_managerId_idx" ON "Employee"("managerId" ASC);

-- CreateIndex
CREATE INDEX "Employee_roleId_idx" ON "Employee"("roleId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeAttendance_attendanceDate_idx" ON "EmployeeAttendance"("attendanceDate" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeAttendance_employeeId_attendanceDate_key" ON "EmployeeAttendance"("employeeId" ASC, "attendanceDate" ASC);

-- CreateIndex
CREATE INDEX "EmployeeAttendance_employeeId_idx" ON "EmployeeAttendance"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeAttendance_status_idx" ON "EmployeeAttendance"("status" ASC);

-- CreateIndex
CREATE INDEX "EmployeeDocument_category_idx" ON "EmployeeDocument"("category" ASC);

-- CreateIndex
CREATE INDEX "EmployeeDocument_employeeId_idx" ON "EmployeeDocument"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeLeave_employeeId_idx" ON "EmployeeLeave"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeLeave_endDate_idx" ON "EmployeeLeave"("endDate" ASC);

-- CreateIndex
CREATE INDEX "EmployeeLeave_startDate_idx" ON "EmployeeLeave"("startDate" ASC);

-- CreateIndex
CREATE INDEX "EmployeeLeave_status_idx" ON "EmployeeLeave"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeRole_name_key" ON "EmployeeRole"("name" ASC);

-- CreateIndex
CREATE INDEX "EmployeeSalary_employeeId_idx" ON "EmployeeSalary"("employeeId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSalary_employeeId_payMonth_payYear_key" ON "EmployeeSalary"("employeeId" ASC, "payMonth" ASC, "payYear" ASC);

-- CreateIndex
CREATE INDEX "EmployeeSalary_payMonth_payYear_idx" ON "EmployeeSalary"("payMonth" ASC, "payYear" ASC);

-- CreateIndex
CREATE INDEX "EmployeeSalary_status_idx" ON "EmployeeSalary"("status" ASC);

-- CreateIndex
CREATE INDEX "EmployeeSession_employeeId_idx" ON "EmployeeSession"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeTask_employeeId_idx" ON "EmployeeTask"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "EmployeeTask_status_idx" ON "EmployeeTask"("status" ASC);

-- CreateIndex
CREATE INDEX "FleetAssignment_userId_idx" ON "FleetAssignment"("userId" ASC);

-- CreateIndex
CREATE INDEX "FleetLocation_recordedAt_idx" ON "FleetLocation"("recordedAt" ASC);

-- CreateIndex
CREATE INDEX "FleetVehicle_orgId_idx" ON "FleetVehicle"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FleetVehicle_vehicleNumber_key" ON "FleetVehicle"("vehicleNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ImpersonationSession_token_key" ON "ImpersonationSession"("token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber" ASC);

-- CreateIndex
CREATE INDEX "Invoice_orgId_archivedAt_idx" ON "Invoice"("orgId" ASC, "archivedAt" ASC);

-- CreateIndex
CREATE INDEX "Invoice_orgId_idx" ON "Invoice"("orgId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeArticle_orgId_idx" ON "KnowledgeArticle"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeArticle_orgId_slug_key" ON "KnowledgeArticle"("orgId" ASC, "slug" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeAttachment_articleId_idx" ON "KnowledgeAttachment"("articleId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeCategory_orgId_idx" ON "KnowledgeCategory"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeCategory_orgId_name_key" ON "KnowledgeCategory"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeComment_articleId_idx" ON "KnowledgeComment"("articleId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeComment_employeeId_idx" ON "KnowledgeComment"("employeeId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeFavorite_articleId_employeeId_key" ON "KnowledgeFavorite"("articleId" ASC, "employeeId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeFavorite_employeeId_idx" ON "KnowledgeFavorite"("employeeId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeView_articleId_idx" ON "KnowledgeView"("articleId" ASC);

-- CreateIndex
CREATE INDEX "KnowledgeView_employeeId_idx" ON "KnowledgeView"("employeeId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LandscapingProject_jobId_key" ON "LandscapingProject"("jobId" ASC);

-- CreateIndex
CREATE INDEX "Lead_assignedToId_idx" ON "Lead"("assignedToId" ASC);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Lead_locationId_idx" ON "Lead"("locationId" ASC);

-- CreateIndex
CREATE INDEX "Lead_orgId_idx" ON "Lead"("orgId" ASC);

-- CreateIndex
CREATE INDEX "Lead_orgId_locationId_idx" ON "Lead"("orgId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "Lead_orgId_status_idx" ON "Lead"("orgId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "LeadActivity_createdAt_idx" ON "LeadActivity"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId" ASC);

-- CreateIndex
CREATE INDEX "LeadNote_createdAt_idx" ON "LeadNote"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "LeadNote_createdBy_idx" ON "LeadNote"("createdBy" ASC);

-- CreateIndex
CREATE INDEX "LeadNote_leadId_idx" ON "LeadNote"("leadId" ASC);

-- CreateIndex
CREATE INDEX "MarketingCampaign_channel_idx" ON "MarketingCampaign"("channel" ASC);

-- CreateIndex
CREATE INDEX "MarketingCampaign_createdByUserId_idx" ON "MarketingCampaign"("createdByUserId" ASC);

-- CreateIndex
CREATE INDEX "MarketingCampaign_orgId_idx" ON "MarketingCampaign"("orgId" ASC);

-- CreateIndex
CREATE INDEX "MarketingCampaign_status_idx" ON "MarketingCampaign"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "MarketingCampaignLead_campaignId_companyLeadId_key" ON "MarketingCampaignLead"("campaignId" ASC, "companyLeadId" ASC);

-- CreateIndex
CREATE INDEX "MarketingNewsletter_audience_idx" ON "MarketingNewsletter"("audience" ASC);

-- CreateIndex
CREATE INDEX "MarketingNewsletter_createdByUserId_idx" ON "MarketingNewsletter"("createdByUserId" ASC);

-- CreateIndex
CREATE INDEX "MarketingNewsletter_orgId_idx" ON "MarketingNewsletter"("orgId" ASC);

-- CreateIndex
CREATE INDEX "MarketingNewsletter_scheduledAt_idx" ON "MarketingNewsletter"("scheduledAt" ASC);

-- CreateIndex
CREATE INDEX "MarketingNewsletter_status_idx" ON "MarketingNewsletter"("status" ASC);

-- CreateIndex
CREATE INDEX "MarketingTemplate_category_idx" ON "MarketingTemplate"("category" ASC);

-- CreateIndex
CREATE INDEX "MarketingTemplate_createdByUserId_idx" ON "MarketingTemplate"("createdByUserId" ASC);

-- CreateIndex
CREATE INDEX "MarketingTemplate_orgId_idx" ON "MarketingTemplate"("orgId" ASC);

-- CreateIndex
CREATE INDEX "MarketingTemplate_status_idx" ON "MarketingTemplate"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug" ASC);

-- CreateIndex
CREATE INDEX "OrganizationLocation_orgId_active_idx" ON "OrganizationLocation"("orgId" ASC, "active" ASC);

-- CreateIndex
CREATE INDEX "OrganizationLocation_orgId_idx" ON "OrganizationLocation"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationLocation_orgId_name_key" ON "OrganizationLocation"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "OrganizationRole_orgId_idx" ON "OrganizationRole"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationRole_orgId_name_key" ON "OrganizationRole"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSettings_orgId_key" ON "OrganizationSettings"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_code_key" ON "Plan"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON "PurchaseOrder"("orderNumber" ASC);

-- CreateIndex
CREATE INDEX "PurchaseOrder_orgId_idx" ON "PurchaseOrder"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_module_key" ON "RolePermission"("roleId" ASC, "module" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "RoofingProject_jobId_key" ON "RoofingProject"("jobId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token" ASC);

-- CreateIndex
CREATE INDEX "SmsQueue_orgId_idx" ON "SmsQueue"("orgId" ASC);

-- CreateIndex
CREATE INDEX "SmsQueue_status_idx" ON "SmsQueue"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_externalId_key" ON "Subscription"("externalId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_orgId_key" ON "Subscription"("orgId" ASC);

-- CreateIndex
CREATE INDEX "SubscriptionCancellationOtp_expiresAt_idx" ON "SubscriptionCancellationOtp"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "SubscriptionCancellationOtp_userId_orgId_createdAt_idx" ON "SubscriptionCancellationOtp"("userId" ASC, "orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "SupportTicket_orgId_createdAt_idx" ON "SupportTicket"("orgId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "SupportTicket_status_createdAt_idx" ON "SupportTicket"("status" ASC, "createdAt" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber" ASC);

-- CreateIndex
CREATE INDEX "SupportTicket_userId_createdAt_idx" ON "SupportTicket"("userId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "SystemIntegration_orgId_idx" ON "SystemIntegration"("orgId" ASC);

-- CreateIndex
CREATE INDEX "SystemIntegration_provider_idx" ON "SystemIntegration"("provider" ASC);

-- CreateIndex
CREATE INDEX "Team_orgId_idx" ON "Team"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Team_orgId_name_key" ON "Team"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "TeamInvitation_orgId_idx" ON "TeamInvitation"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TeamInvitation_token_key" ON "TeamInvitation"("token" ASC);

-- CreateIndex
CREATE INDEX "TeamInvitationLocation_invitationId_idx" ON "TeamInvitationLocation"("invitationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TeamInvitationLocation_invitationId_locationId_key" ON "TeamInvitationLocation"("invitationId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "TeamInvitationLocation_locationId_idx" ON "TeamInvitationLocation"("locationId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProgress_trainingId_userId_key" ON "TrainingProgress"("trainingId" ASC, "userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email" ASC);

-- CreateIndex
CREATE INDEX "User_orgId_idx" ON "User"("orgId" ASC);

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role" ASC);

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status" ASC);

-- CreateIndex
CREATE INDEX "UserActivityTimeline_entityId_idx" ON "UserActivityTimeline"("entityId" ASC);

-- CreateIndex
CREATE INDEX "UserActivityTimeline_entityType_idx" ON "UserActivityTimeline"("entityType" ASC);

-- CreateIndex
CREATE INDEX "UserActivityTimeline_orgId_idx" ON "UserActivityTimeline"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserAnnouncement_orgId_idx" ON "UserAnnouncement"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserAnnouncementRead_announcementId_userId_key" ON "UserAnnouncementRead"("announcementId" ASC, "userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_apiKey_key" ON "UserApiKey"("apiKey" ASC);

-- CreateIndex
CREATE INDEX "UserApiKey_orgId_idx" ON "UserApiKey"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserAsset_assetCode_key" ON "UserAsset"("assetCode" ASC);

-- CreateIndex
CREATE INDEX "UserAsset_orgId_idx" ON "UserAsset"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserAssetAssignment_orgId_idx" ON "UserAssetAssignment"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserAssetCategory_orgId_name_key" ON "UserAssetCategory"("orgId" ASC, "name" ASC);

-- CreateIndex
CREATE INDEX "UserAssetHistory_assignmentId_idx" ON "UserAssetHistory"("assignmentId" ASC);

-- CreateIndex
CREATE INDEX "UserAssetMaintenance_orgId_idx" ON "UserAssetMaintenance"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserAttendance_orgId_idx" ON "UserAttendance"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserAttendance_userId_workDate_key" ON "UserAttendance"("userId" ASC, "workDate" ASC);

-- CreateIndex
CREATE INDEX "UserChatChannel_orgId_idx" ON "UserChatChannel"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserChatMember_channelId_userId_key" ON "UserChatMember"("channelId" ASC, "userId" ASC);

-- CreateIndex
CREATE INDEX "UserChatMessage_channelId_idx" ON "UserChatMessage"("channelId" ASC);

-- CreateIndex
CREATE INDEX "UserChecklist_orgId_idx" ON "UserChecklist"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserComment_entityId_idx" ON "UserComment"("entityId" ASC);

-- CreateIndex
CREATE INDEX "UserComment_entityType_idx" ON "UserComment"("entityType" ASC);

-- CreateIndex
CREATE INDEX "UserCommission_orgId_idx" ON "UserCommission"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyReport_userId_workDate_key" ON "UserDailyReport"("userId" ASC, "workDate" ASC);

-- CreateIndex
CREATE INDEX "UserDocument_orgId_idx" ON "UserDocument"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserDocument_userId_idx" ON "UserDocument"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserEmailQueue_newsletterId_idx" ON "UserEmailQueue"("newsletterId" ASC);

-- CreateIndex
CREATE INDEX "UserEmailQueue_orgId_idx" ON "UserEmailQueue"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserEmailQueue_scheduledAt_idx" ON "UserEmailQueue"("scheduledAt" ASC);

-- CreateIndex
CREATE INDEX "UserEmailQueue_status_idx" ON "UserEmailQueue"("status" ASC);

-- CreateIndex
CREATE INDEX "UserEquipment_orgId_idx" ON "UserEquipment"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserExpense_orgId_idx" ON "UserExpense"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserGoal_orgId_idx" ON "UserGoal"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserInspection_orgId_idx" ON "UserInspection"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserJobDocument_category_idx" ON "UserJobDocument"("category" ASC);

-- CreateIndex
CREATE INDEX "UserJobDocument_expiresAt_idx" ON "UserJobDocument"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "UserJobDocument_jobId_idx" ON "UserJobDocument"("jobId" ASC);

-- CreateIndex
CREATE INDEX "UserJobDocument_orgId_idx" ON "UserJobDocument"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserJobDocument_uploadedById_idx" ON "UserJobDocument"("uploadedById" ASC);

-- CreateIndex
CREATE INDEX "UserJobPhoto_category_idx" ON "UserJobPhoto"("category" ASC);

-- CreateIndex
CREATE INDEX "UserJobPhoto_isPrimary_idx" ON "UserJobPhoto"("isPrimary" ASC);

-- CreateIndex
CREATE INDEX "UserJobPhoto_jobId_idx" ON "UserJobPhoto"("jobId" ASC);

-- CreateIndex
CREATE INDEX "UserJobPhoto_orgId_idx" ON "UserJobPhoto"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserJobPhoto_uploadedById_idx" ON "UserJobPhoto"("uploadedById" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserJobSignature_jobId_key" ON "UserJobSignature"("jobId" ASC);

-- CreateIndex
CREATE INDEX "UserLeave_orgId_idx" ON "UserLeave"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserLeave_userId_idx" ON "UserLeave"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserLocation_locationId_idx" ON "UserLocation"("locationId" ASC);

-- CreateIndex
CREATE INDEX "UserLocation_userId_idx" ON "UserLocation"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserLocation_userId_locationId_key" ON "UserLocation"("userId" ASC, "locationId" ASC);

-- CreateIndex
CREATE INDEX "UserMaintenanceReminder_orgId_idx" ON "UserMaintenanceReminder"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserMeeting_orgId_idx" ON "UserMeeting"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserMeetingAttendee_meetingId_userId_key" ON "UserMeetingAttendee"("meetingId" ASC, "userId" ASC);

-- CreateIndex
CREATE INDEX "UserNote_orgId_idx" ON "UserNote"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserNotification_orgId_idx" ON "UserNotification"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserNotification_userId_idx" ON "UserNotification"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserPayroll_orgId_idx" ON "UserPayroll"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPayroll_userId_month_year_key" ON "UserPayroll"("userId" ASC, "month" ASC, "year" ASC);

-- CreateIndex
CREATE INDEX "UserPerformance_orgId_idx" ON "UserPerformance"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_module_key" ON "UserPermission"("userId" ASC, "module" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserReminder_orgId_idx" ON "UserReminder"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserReporting_userId_key" ON "UserReporting"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserRoute_orgId_idx" ON "UserRoute"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserRouteStop_routeId_idx" ON "UserRouteStop"("routeId" ASC);

-- CreateIndex
CREATE INDEX "UserSchedule_orgId_idx" ON "UserSchedule"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserSignature_userId_key" ON "UserSignature"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserSmsQueue_orgId_idx" ON "UserSmsQueue"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserTask_assignedToId_idx" ON "UserTask"("assignedToId" ASC);

-- CreateIndex
CREATE INDEX "UserTask_orgId_idx" ON "UserTask"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserTimesheet_orgId_idx" ON "UserTimesheet"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserToolCheckout_orgId_idx" ON "UserToolCheckout"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserTraining_orgId_idx" ON "UserTraining"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserWarranty_orgId_idx" ON "UserWarranty"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserWebhook_orgId_idx" ON "UserWebhook"("orgId" ASC);

-- CreateIndex
CREATE INDEX "UserWorkOrder_orgId_idx" ON "UserWorkOrder"("orgId" ASC);

-- CreateIndex
CREATE INDEX "Vendor_orgId_idx" ON "Vendor"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorCode_key" ON "Vendor"("vendorCode" ASC);

-- CreateIndex
CREATE INDEX "VendorPayment_orgId_idx" ON "VendorPayment"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_code_key" ON "Warehouse"("code" ASC);

-- CreateIndex
CREATE INDEX "Warehouse_orgId_idx" ON "Warehouse"("orgId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_warehouseId_inventoryItemId_key" ON "WarehouseStock"("warehouseId" ASC, "inventoryItemId" ASC);

-- CreateIndex
CREATE INDEX "WarehouseTransaction_createdAt_idx" ON "WarehouseTransaction"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "WarehouseTransaction_inventoryItemId_idx" ON "WarehouseTransaction"("inventoryItemId" ASC);

-- CreateIndex
CREATE INDEX "WarehouseTransaction_orgId_idx" ON "WarehouseTransaction"("orgId" ASC);

-- CreateIndex
CREATE INDEX "WarehouseTransaction_transactionType_idx" ON "WarehouseTransaction"("transactionType" ASC);

-- CreateIndex
CREATE INDEX "WarehouseTransaction_warehouseId_idx" ON "WarehouseTransaction"("warehouseId" ASC);

-- CreateIndex
CREATE INDEX "Webhook_orgId_idx" ON "Webhook"("orgId" ASC);

-- CreateIndex
CREATE INDEX "WebhookDelivery_success_idx" ON "WebhookDelivery"("success" ASC);

-- CreateIndex
CREATE INDEX "WebhookDelivery_webhookId_idx" ON "WebhookDelivery"("webhookId" ASC);

-- AddForeignKey
ALTER TABLE "ActivityTimeline" ADD CONSTRAINT "ActivityTimeline_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimeline" ADD CONSTRAINT "ActivityTimeline_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimeline" ADD CONSTRAINT "ActivityTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgent" ADD CONSTRAINT "AiAgent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAgentTool" ADD CONSTRAINT "AiAgentTool_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiApproval" ADD CONSTRAINT "AiApproval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledgeChunk" ADD CONSTRAINT "AiKnowledgeChunk_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "AiKnowledgeSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledgeSource" ADD CONSTRAINT "AiKnowledgeSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiKnowledgeSource" ADD CONSTRAINT "AiKnowledgeSource_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLeadCandidate" ADD CONSTRAINT "AiLeadCandidate_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLeadSearch" ADD CONSTRAINT "AiLeadSearch_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLeadSearchResult" ADD CONSTRAINT "AiLeadSearchResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "AiLeadCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLeadSearchResult" ADD CONSTRAINT "AiLeadSearchResult_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "AiLeadSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLog" ADD CONSTRAINT "AiLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLog" ADD CONSTRAINT "AiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiToolCall" ADD CONSTRAINT "AiToolCall_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiWorkflow" ADD CONSTRAINT "AiWorkflow_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyLead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMaintenance" ADD CONSTRAINT "AssetMaintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationStep" ADD CONSTRAINT "AutomationStep_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeOrder" ADD CONSTRAINT "ChangeOrder_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloseoutPackage" ADD CONSTRAINT "CloseoutPackage_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyContact" ADD CONSTRAINT "CompanyContact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLead" ADD CONSTRAINT "CompanyLead_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyLead" ADD CONSTRAINT "CompanyLead_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewAssignment" ADD CONSTRAINT "CrewAssignment_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CrewMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewAssignment" ADD CONSTRAINT "CrewAssignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerActivity" ADD CONSTRAINT "CustomerActivity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerFile" ADD CONSTRAINT "CustomerFile_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerNote" ADD CONSTRAINT "CustomerNote_organizationRoleId_fkey" FOREIGN KEY ("organizationRoleId") REFERENCES "OrganizationRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "PipelineStage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoFollowUp" ADD CONSTRAINT "DemoFollowUp_demoScheduleId_fkey" FOREIGN KEY ("demoScheduleId") REFERENCES "DemoSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoFollowUp" ADD CONSTRAINT "DemoFollowUp_marketingEmployeeId_fkey" FOREIGN KEY ("marketingEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSchedule" ADD CONSTRAINT "DemoSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSchedule" ADD CONSTRAINT "DemoSchedule_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSchedule" ADD CONSTRAINT "DemoSchedule_marketingEmployeeId_fkey" FOREIGN KEY ("marketingEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchBoard" ADD CONSTRAINT "DispatchBoard_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchBoard" ADD CONSTRAINT "DispatchBoard_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchJob" ADD CONSTRAINT "DispatchJob_dispatchBoardId_fkey" FOREIGN KEY ("dispatchBoardId") REFERENCES "DispatchBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchJob" ADD CONSTRAINT "DispatchJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchJob" ADD CONSTRAINT "DispatchJob_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchJob" ADD CONSTRAINT "DispatchJob_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailQueue" ADD CONSTRAINT "EmailQueue_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "EmployeeRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeActivity" ADD CONSTRAINT "EmployeeActivity_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeAttendance" ADD CONSTRAINT "EmployeeAttendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDocument" ADD CONSTRAINT "EmployeeDocument_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLeave" ADD CONSTRAINT "EmployeeLeave_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLeave" ADD CONSTRAINT "EmployeeLeave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSalary" ADD CONSTRAINT "EmployeeSalary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSession" ADD CONSTRAINT "EmployeeSession_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTask" ADD CONSTRAINT "EmployeeTask_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetAssignment" ADD CONSTRAINT "FleetAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetAssignment" ADD CONSTRAINT "FleetAssignment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetFuelLog" ADD CONSTRAINT "FleetFuelLog_filledById_fkey" FOREIGN KEY ("filledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetFuelLog" ADD CONSTRAINT "FleetFuelLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetInspection" ADD CONSTRAINT "FleetInspection_inspectedById_fkey" FOREIGN KEY ("inspectedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetInspection" ADD CONSTRAINT "FleetInspection_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetLocation" ADD CONSTRAINT "FleetLocation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetMaintenance" ADD CONSTRAINT "FleetMaintenance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetTrip" ADD CONSTRAINT "FleetTrip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetTrip" ADD CONSTRAINT "FleetTrip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "FleetVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetVehicle" ADD CONSTRAINT "FleetVehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetVehicle" ADD CONSTRAINT "FleetVehicle_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HvacUnit" ADD CONSTRAINT "HvacUnit_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpersonationSession" ADD CONSTRAINT "ImpersonationSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpersonationSession" ADD CONSTRAINT "ImpersonationSession_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_adjustedById_fkey" FOREIGN KEY ("adjustedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_countedById_fkey" FOREIGN KEY ("countedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCount" ADD CONSTRAINT "InventoryCount_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMilestone" ADD CONSTRAINT "JobMilestone_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobNote" ADD CONSTRAINT "JobNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobNote" ADD CONSTRAINT "JobNote_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTask" ADD CONSTRAINT "JobTask_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "KnowledgeCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeAttachment" ADD CONSTRAINT "KnowledgeAttachment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeCategory" ADD CONSTRAINT "KnowledgeCategory_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeComment" ADD CONSTRAINT "KnowledgeComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeComment" ADD CONSTRAINT "KnowledgeComment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeFavorite" ADD CONSTRAINT "KnowledgeFavorite_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeFavorite" ADD CONSTRAINT "KnowledgeFavorite_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeView" ADD CONSTRAINT "KnowledgeView_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeView" ADD CONSTRAINT "KnowledgeView_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandscapingProject" ADD CONSTRAINT "LandscapingProject_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaign" ADD CONSTRAINT "MarketingCampaign_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignLead" ADD CONSTRAINT "MarketingCampaignLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "MarketingCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingCampaignLead" ADD CONSTRAINT "MarketingCampaignLead_companyLeadId_fkey" FOREIGN KEY ("companyLeadId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingNewsletter" ADD CONSTRAINT "MarketingNewsletter_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingNewsletter" ADD CONSTRAINT "MarketingNewsletter_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingTemplate" ADD CONSTRAINT "MarketingTemplate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingTemplate" ADD CONSTRAINT "MarketingTemplate_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialRequest" ADD CONSTRAINT "MaterialRequest_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationLocation" ADD CONSTRAINT "OrganizationLocation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRole" ADD CONSTRAINT "OrganizationRole_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSettings" ADD CONSTRAINT "OrganizationSettings_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStage" ADD CONSTRAINT "PipelineStage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformLog" ADD CONSTRAINT "PlatformLog_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlumbingAsset" ADD CONSTRAINT "PlumbingAsset_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PunchItem" ADD CONSTRAINT "PunchItem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "OrganizationRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoofingProject" ADD CONSTRAINT "RoofingProject_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteOptimization" ADD CONSTRAINT "RouteOptimization_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteOptimization" ADD CONSTRAINT "RouteOptimization_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePlan" ADD CONSTRAINT "RoutePlan_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_optimizationId_fkey" FOREIGN KEY ("optimizationId") REFERENCES "RouteOptimization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPipeline" ADD CONSTRAINT "SalesPipeline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesPipeline" ADD CONSTRAINT "SalesPipeline_salesEmployeeId_fkey" FOREIGN KEY ("salesEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SmsQueue" ADD CONSTRAINT "SmsQueue_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemIntegration" ADD CONSTRAINT "SystemIntegration_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "OrganizationRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitationLocation" ADD CONSTRAINT "TeamInvitationLocation_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "TeamInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitationLocation" ADD CONSTRAINT "TeamInvitationLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicianLocation" ADD CONSTRAINT "TechnicianLocation_techId_fkey" FOREIGN KEY ("techId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "UserTraining"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgress" ADD CONSTRAINT "TrainingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationRoleId_fkey" FOREIGN KEY ("organizationRoleId") REFERENCES "OrganizationRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityTimeline" ADD CONSTRAINT "UserActivityTimeline_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityTimeline" ADD CONSTRAINT "UserActivityTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnouncement" ADD CONSTRAINT "UserAnnouncement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnouncement" ADD CONSTRAINT "UserAnnouncement_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnouncementRead" ADD CONSTRAINT "UserAnnouncementRead_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "UserAnnouncement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnnouncementRead" ADD CONSTRAINT "UserAnnouncementRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAsset" ADD CONSTRAINT "UserAsset_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetAssignment" ADD CONSTRAINT "UserAssetAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetAssignment" ADD CONSTRAINT "UserAssetAssignment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetAssignment" ADD CONSTRAINT "UserAssetAssignment_userAssetId_fkey" FOREIGN KEY ("userAssetId") REFERENCES "UserAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetAssignment" ADD CONSTRAINT "UserAssetAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetCategory" ADD CONSTRAINT "UserAssetCategory_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetHistory" ADD CONSTRAINT "UserAssetHistory_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "UserAssetAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetHistory" ADD CONSTRAINT "UserAssetHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetHistory" ADD CONSTRAINT "UserAssetHistory_userAssetId_fkey" FOREIGN KEY ("userAssetId") REFERENCES "UserAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetMaintenance" ADD CONSTRAINT "UserAssetMaintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "UserAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetMaintenance" ADD CONSTRAINT "UserAssetMaintenance_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetMaintenance" ADD CONSTRAINT "UserAssetMaintenance_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttendance" ADD CONSTRAINT "UserAttendance_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttendance" ADD CONSTRAINT "UserAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatChannel" ADD CONSTRAINT "UserChatChannel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatChannel" ADD CONSTRAINT "UserChatChannel_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMember" ADD CONSTRAINT "UserChatMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMember" ADD CONSTRAINT "UserChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD CONSTRAINT "UserChatMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "UserChatChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatMessage" ADD CONSTRAINT "UserChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklist" ADD CONSTRAINT "UserChecklist_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklist" ADD CONSTRAINT "UserChecklist_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklist" ADD CONSTRAINT "UserChecklist_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistItem" ADD CONSTRAINT "UserChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "UserChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComment" ADD CONSTRAINT "UserComment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComment" ADD CONSTRAINT "UserComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommission" ADD CONSTRAINT "UserCommission_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommission" ADD CONSTRAINT "UserCommission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyReport" ADD CONSTRAINT "UserDailyReport_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDailyReport" ADD CONSTRAINT "UserDailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmailQueue" ADD CONSTRAINT "UserEmailQueue_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "MarketingNewsletter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmailQueue" ADD CONSTRAINT "UserEmailQueue_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmailQueue" ADD CONSTRAINT "UserEmailQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipment" ADD CONSTRAINT "UserEquipment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipment" ADD CONSTRAINT "UserEquipment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipment" ADD CONSTRAINT "UserEquipment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipmentService" ADD CONSTRAINT "UserEquipmentService_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "UserEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipmentService" ADD CONSTRAINT "UserEquipmentService_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipmentService" ADD CONSTRAINT "UserEquipmentService_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEquipmentService" ADD CONSTRAINT "UserEquipmentService_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExpense" ADD CONSTRAINT "UserExpense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExpense" ADD CONSTRAINT "UserExpense_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExpense" ADD CONSTRAINT "UserExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGoal" ADD CONSTRAINT "UserGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInspection" ADD CONSTRAINT "UserInspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInspection" ADD CONSTRAINT "UserInspection_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInspection" ADD CONSTRAINT "UserInspection_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInspectionItem" ADD CONSTRAINT "UserInspectionItem_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "UserInspection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobDocument" ADD CONSTRAINT "UserJobDocument_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobDocument" ADD CONSTRAINT "UserJobDocument_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobDocument" ADD CONSTRAINT "UserJobDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobPhoto" ADD CONSTRAINT "UserJobPhoto_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobPhoto" ADD CONSTRAINT "UserJobPhoto_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobPhoto" ADD CONSTRAINT "UserJobPhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobSignature" ADD CONSTRAINT "UserJobSignature_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJobSignature" ADD CONSTRAINT "UserJobSignature_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeave" ADD CONSTRAINT "UserLeave_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeave" ADD CONSTRAINT "UserLeave_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLeave" ADD CONSTRAINT "UserLeave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "OrganizationLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLocation" ADD CONSTRAINT "UserLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMaintenanceReminder" ADD CONSTRAINT "UserMaintenanceReminder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "UserAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMaintenanceReminder" ADD CONSTRAINT "UserMaintenanceReminder_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "UserEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMaintenanceReminder" ADD CONSTRAINT "UserMaintenanceReminder_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeeting" ADD CONSTRAINT "UserMeeting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeeting" ADD CONSTRAINT "UserMeeting_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeetingAttendee" ADD CONSTRAINT "UserMeetingAttendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "UserMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMeetingAttendee" ADD CONSTRAINT "UserMeetingAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNote" ADD CONSTRAINT "UserNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayroll" ADD CONSTRAINT "UserPayroll_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPayroll" ADD CONSTRAINT "UserPayroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformance" ADD CONSTRAINT "UserPerformance_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformance" ADD CONSTRAINT "UserPerformance_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformance" ADD CONSTRAINT "UserPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReminder" ADD CONSTRAINT "UserReminder_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReminder" ADD CONSTRAINT "UserReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReporting" ADD CONSTRAINT "UserReporting_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReporting" ADD CONSTRAINT "UserReporting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoute" ADD CONSTRAINT "UserRoute_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoute" ADD CONSTRAINT "UserRoute_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRouteStop" ADD CONSTRAINT "UserRouteStop_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRouteStop" ADD CONSTRAINT "UserRouteStop_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRouteStop" ADD CONSTRAINT "UserRouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "UserRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSchedule" ADD CONSTRAINT "UserSchedule_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSchedule" ADD CONSTRAINT "UserSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSignature" ADD CONSTRAINT "UserSignature_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSignature" ADD CONSTRAINT "UserSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSmsQueue" ADD CONSTRAINT "UserSmsQueue_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSmsQueue" ADD CONSTRAINT "UserSmsQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimesheet" ADD CONSTRAINT "UserTimesheet_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimesheet" ADD CONSTRAINT "UserTimesheet_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTimesheet" ADD CONSTRAINT "UserTimesheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToolCheckout" ADD CONSTRAINT "UserToolCheckout_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "UserAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToolCheckout" ADD CONSTRAINT "UserToolCheckout_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToolCheckout" ADD CONSTRAINT "UserToolCheckout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraining" ADD CONSTRAINT "UserTraining_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTraining" ADD CONSTRAINT "UserTraining_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWarranty" ADD CONSTRAINT "UserWarranty_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "UserAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWarranty" ADD CONSTRAINT "UserWarranty_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "UserEquipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWarranty" ADD CONSTRAINT "UserWarranty_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWebhook" ADD CONSTRAINT "UserWebhook_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWebhook" ADD CONSTRAINT "UserWebhook_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkOrder" ADD CONSTRAINT "UserWorkOrder_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkOrder" ADD CONSTRAINT "UserWorkOrder_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkOrder" ADD CONSTRAINT "UserWorkOrder_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPayment" ADD CONSTRAINT "VendorPayment_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorPayment" ADD CONSTRAINT "VendorPayment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransaction" ADD CONSTRAINT "WarehouseTransaction_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransaction" ADD CONSTRAINT "WarehouseTransaction_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransaction" ADD CONSTRAINT "WarehouseTransaction_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransaction" ADD CONSTRAINT "WarehouseTransaction_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
