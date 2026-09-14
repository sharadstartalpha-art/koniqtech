import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

/*
 * --------------------------------------------------------------------------
 * TYPES
 * --------------------------------------------------------------------------
 */

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ToolType =
  | "crm_read"
  | "crm_write"
  | "communication"
  | "search"
  | "knowledge"
  | "analytics"
  | "scheduling"
  | "finance"
  | "system"

type ToolDefinition = {
  name: string
  type: ToolType
  readOnly: boolean
  requiresApproval: boolean
  dangerous: boolean
  supportsDryRun: boolean
}

type ExecutePayload = {
  toolName?: unknown
  agentId?: unknown
  conversationId?: unknown
  input?: unknown
  approvalId?: unknown
  dryRun?: unknown
}

type JsonRecord = Record<string, unknown>

/*
 * --------------------------------------------------------------------------
 * TOOL REGISTRY
 * --------------------------------------------------------------------------
 *
 * Keep this registry intentionally small and explicit.
 *
 * IMPORTANT:
 *
 * A tool is executable here only when it has a corresponding implementation
 * in executeTool().
 *
 * Unknown tools are NEVER dynamically executed.
 */

const TOOL_REGISTRY: readonly ToolDefinition[] = [
  {
    name: "customer_lookup",
    type: "crm_read",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "lead_lookup",
    type: "crm_read",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "job_lookup",
    type: "crm_read",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "invoice_lookup",
    type: "crm_read",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "crm_analytics",
    type: "analytics",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  /*
   * These are registered but deliberately not executable yet.
   *
   * They will be connected to dedicated executors later.
   */
  {
    name: "crm_update",
    type: "crm_write",
    readOnly: false,
    requiresApproval: true,
    dangerous: true,
    supportsDryRun: true,
  },

  {
    name: "email_send",
    type: "communication",
    readOnly: false,
    requiresApproval: true,
    dangerous: true,
    supportsDryRun: true,
  },

  {
    name: "sms_send",
    type: "communication",
    readOnly: false,
    requiresApproval: true,
    dangerous: true,
    supportsDryRun: true,
  },

  {
    name: "web_search",
    type: "search",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "knowledge_search",
    type: "knowledge",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "schedule_create",
    type: "scheduling",
    readOnly: false,
    requiresApproval: true,
    dangerous: true,
    supportsDryRun: true,
  },

  {
    name: "financial_lookup",
    type: "finance",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },

  {
    name: "system_status",
    type: "system",
    readOnly: true,
    requiresApproval: false,
    dangerous: false,
    supportsDryRun: true,
  },
]

/*
 * --------------------------------------------------------------------------
 * HELPERS
 * --------------------------------------------------------------------------
 */

function getSessionContext(session: {
  user?: SessionUser | null
}) {
  const userId =
    typeof session.user?.id === "string"
      ? session.user.id.trim()
      : ""

  const orgId =
    typeof session.user?.orgId === "string"
      ? session.user.orgId.trim()
      : ""

  return {
    userId,
    orgId,
  }
}

function isPlainObject(
  value: unknown,
): value is JsonRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function toJsonValue(
  value: unknown,
): Prisma.InputJsonValue {
  const serialized =
    JSON.stringify(value)

  if (serialized === undefined) {
    return {}
  }

  return JSON.parse(
    serialized,
  ) as Prisma.InputJsonValue
}

function getTool(
  toolName: string,
) {
  const normalized =
    toolName.trim().toLowerCase()

  return TOOL_REGISTRY.find(
    (tool) =>
      tool.name === normalized,
  )
}

function normalizeString(
  value: unknown,
  maxLength = 200,
) {
  if (
    typeof value !== "string"
  ) {
    return null
  }

  const result =
    value.trim()

  if (!result) {
    return null
  }

  return result.slice(
    0,
    maxLength,
  )
}

function normalizeLimit(
  value: unknown,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 20
  }

  return Math.min(
    50,
    Math.max(
      1,
      Math.floor(value),
    ),
  )
}

function decimalToNumber(
  value: unknown,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (
    typeof value === "number"
  ) {
    return value
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (
      value as {
        toNumber?: unknown
      }
    ).toNumber === "function"
  ) {
    return (
      value as {
        toNumber: () => number
      }
    ).toNumber()
  }

  const number =
    Number(value)

  return Number.isFinite(
    number,
  )
    ? number
    : null
}

function sanitizeOutput(
  value: unknown,
): unknown {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }

  if (
    typeof value === "bigint"
  ) {
    return value.toString()
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString()
  }

  if (
    typeof value === "object"
  ) {
    if (
      "toNumber" in
        (value as object) &&
      typeof (
        value as {
          toNumber?: unknown
        }
      ).toNumber === "function"
    ) {
      return (
        value as {
          toNumber: () => number
        }
      ).toNumber()
    }

    if (Array.isArray(value)) {
      return value.map(
        sanitizeOutput,
      )
    }

    const result: Record<
      string,
      unknown
    > = {}

    for (const [
      key,
      item,
    ] of Object.entries(
      value as Record<
        string,
        unknown
      >,
    )) {
      result[key] =
        sanitizeOutput(item)
    }

    return result
  }

  return value
}

function validateInput(
  input: unknown,
) {
  if (
    input === undefined ||
    input === null
  ) {
    return {}
  }

  if (
    !isPlainObject(input)
  ) {
    throw new Error(
      "Tool input must be a JSON object.",
    )
  }

  /*
   * Prevent unexpectedly large tool payloads.
   */
  const serialized =
    JSON.stringify(input)

  if (
    serialized.length >
    20_000
  ) {
    throw new Error(
      "Tool input is too large.",
    )
  }

  return input
}

/*
 * --------------------------------------------------------------------------
 * ORGANIZATION / AGENT AUTHORIZATION
 * --------------------------------------------------------------------------
 */

async function getOrganizationSettings(
  orgId: string,
) {
  return prisma.organizationSettings.findUnique(
    {
      where: {
        orgId,
      },

      select: {
        aiEnabled: true,
        aiCanAct: true,
        aiRequireApproval: true,
        aiKnowledgeEnabled: true,
        aiWebSearchEnabled: true,
      },
    },
  )
}

async function authorizeAgentTool({
  orgId,
  agentId,
  tool,
}: {
  orgId: string
  agentId: string
  tool: ToolDefinition
}) {
  const agent =
    await prisma.aiAgent.findFirst({
      where: {
        id: agentId,
        orgId,
      },

      select: {
        id: true,
        name: true,
        status: true,
        canAct: true,
        requiresApproval: true,
      },
    })

  if (!agent) {
    return {
      authorized: false as const,
      status: 404,
      error:
        "AI agent not found.",
    }
  }

  if (
    agent.status !== "active"
  ) {
    return {
      authorized: false as const,
      status: 409,
      error:
        "AI agent is not active.",
    }
  }

  const agentTool =
    await prisma.aiAgentTool.findFirst(
      {
        where: {
          agentId:
            agent.id,
          name:
            tool.name,
        },

        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          enabled: true,
          requiresApproval: true,
        },
      },
    )

  if (!agentTool) {
    return {
      authorized: false as const,
      status: 403,
      error:
        "This tool is not assigned to the selected AI agent.",
    }
  }

  if (!agentTool.enabled) {
    return {
      authorized: false as const,
      status: 409,
      error:
        "This tool is disabled for the selected AI agent.",
    }
  }

  if (
    agentTool.type !==
    tool.type
  ) {
    return {
      authorized: false as const,
      status: 409,
      error:
        "Agent tool configuration does not match the registered tool type.",
    }
  }

  if (
    !tool.readOnly &&
    !agent.canAct
  ) {
    return {
      authorized: false as const,
      status: 403,
      error:
        "This AI agent is not permitted to perform actions.",
    }
  }

  return {
    authorized: true as const,
    agent,
    agentTool,
  }
}

/*
 * --------------------------------------------------------------------------
 * CONVERSATION AUTHORIZATION
 * --------------------------------------------------------------------------
 */

async function verifyConversation(
  conversationId: string,
  orgId: string,
  userId: string,
) {
  return prisma.aiConversation.findFirst(
    {
      where: {
        id: conversationId,
        orgId,
        userId,
      },

      select: {
        id: true,
      },
    },
  )
}

/*
 * --------------------------------------------------------------------------
 * CUSTOMER LOOKUP
 * --------------------------------------------------------------------------
 */

async function executeCustomerLookup(
  orgId: string,
  input: JsonRecord,
) {
  const id =
    normalizeString(
      input.id,
      100,
    )

  const email =
    normalizeString(
      input.email,
      320,
    )

  const phone =
    normalizeString(
      input.phone,
      100,
    )

  const search =
    normalizeString(
      input.search ??
        input.query,
      200,
    )

  const limit =
    normalizeLimit(
      input.limit,
    )

  const where: Prisma.CustomerWhereInput =
    {
      orgId,
    }

  if (id) {
    where.id = id
  } else if (email) {
    where.email = {
      equals: email,
      mode: "insensitive",
    }
  } else if (phone) {
    where.phone = {
      contains: phone,
    }
  } else if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
        },
      },
    ]
  }

  const customers =
    await prisma.customer.findMany(
      {
        where,

        orderBy: {
          createdAt: "desc",
        },

        take: limit,

        select: {
          id: true,
          companyName: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          zip: true,
          notes: true,
          createdAt: true,
        },
      },
    )

  return {
    type: "customer_lookup",
    count: customers.length,
    customers:
      sanitizeOutput(
        customers,
      ),
  }
}

/*
 * --------------------------------------------------------------------------
 * LEAD LOOKUP
 * --------------------------------------------------------------------------
 */

async function executeLeadLookup(
  orgId: string,
  input: JsonRecord,
) {
  const id =
    normalizeString(
      input.id,
      100,
    )

  const search =
    normalizeString(
      input.search ??
        input.query,
      200,
    )

  const email =
    normalizeString(
      input.email,
      320,
    )

  const phone =
    normalizeString(
      input.phone,
      100,
    )

  const companyName =
    normalizeString(
      input.companyName,
      200,
    )

  const limit =
    normalizeLimit(
      input.limit,
    )

  const where: Prisma.LeadWhereInput =
    {
      orgId,
    }

  if (id) {
    where.id = id
  } else if (email) {
    where.email = {
      equals: email,
      mode: "insensitive",
    }
  } else if (phone) {
    where.phone = {
      contains: phone,
    }
  } else if (companyName) {
    where.companyName = {
      contains:
        companyName,
      mode: "insensitive",
    }
  } else if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        companyName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
        },
      },
    ]
  }

  const leads =
    await prisma.lead.findMany(
      {
        where,

        orderBy: {
          createdAt: "desc",
        },

        take: limit,

        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          email: true,
          phone: true,
          address: true,
          budget: true,
          priority: true,
          tags: true,
          status: true,
          assignedTo: true,
          createdAt: true,
        },
      },
    )

  return {
    type: "lead_lookup",
    count: leads.length,
    leads:
      sanitizeOutput(
        leads,
      ),
  }
}

/*
 * --------------------------------------------------------------------------
 * JOB LOOKUP
 * --------------------------------------------------------------------------
 */

async function executeJobLookup(
  orgId: string,
  input: JsonRecord,
) {
  const id =
    normalizeString(
      input.id,
      100,
    )

  const customerId =
    normalizeString(
      input.customerId,
      100,
    )

  const search =
    normalizeString(
      input.search ??
        input.query,
      200,
    )

  const status =
    normalizeString(
      input.status,
      50,
    )

  const limit =
    normalizeLimit(
      input.limit,
    )

  const where: Prisma.JobWhereInput =
    {
      orgId,
    }

  if (id) {
    where.id = id
  }

  if (customerId) {
    where.customerId =
      customerId
  }

  if (status) {
    where.status =
      status as Prisma.JobWhereInput["status"]
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    }
  }

  const jobs =
    await prisma.job.findMany(
      {
        where,

        orderBy: {
          scheduledDate:
            "asc",
        },

        take: limit,

        select: {
          id: true,
          customerId: true,
          quoteId: true,
          title: true,
          status: true,
          technicianId: true,
          scheduledDate: true,
          completedDate: true,
          notes: true,
          createdAt: true,

          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
              phone: true,
              email: true,
            },
          },

          technician: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    )

  return {
    type: "job_lookup",
    count: jobs.length,
    jobs:
      sanitizeOutput(
        jobs,
      ),
  }
}

/*
 * --------------------------------------------------------------------------
 * INVOICE LOOKUP
 * --------------------------------------------------------------------------
 */

async function executeInvoiceLookup(
  orgId: string,
  input: JsonRecord,
) {
  const id =
    normalizeString(
      input.id,
      100,
    )

  const customerId =
    normalizeString(
      input.customerId,
      100,
    )

  const jobId =
    normalizeString(
      input.jobId,
      100,
    )

  const invoiceNumber =
    normalizeString(
      input.invoiceNumber,
      100,
    )

  const status =
    normalizeString(
      input.status,
      50,
    )

  const limit =
    normalizeLimit(
      input.limit,
    )

  const where: Prisma.InvoiceWhereInput =
    {
      orgId,
    }

  if (id) {
    where.id = id
  }

  if (customerId) {
    where.customerId =
      customerId
  }

  if (jobId) {
    where.jobId =
      jobId
  }

  if (invoiceNumber) {
    where.invoiceNumber = {
      equals:
        invoiceNumber,
      mode: "insensitive",
    }
  }

  if (status) {
    where.status =
      status as Prisma.InvoiceWhereInput["status"]
  }

  const invoices =
    await prisma.invoice.findMany(
      {
        where,

        orderBy: {
          createdAt: "desc",
        },

        take: limit,

        select: {
          id: true,
          customerId: true,
          jobId: true,
          invoiceNumber: true,
          subtotal: true,
          tax: true,
          total: true,
          dueDate: true,
          status: true,
          sentAt: true,
          paidAt: true,
          createdAt: true,

          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
              email: true,
              phone: true,
            },
          },

          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      },
    )

  return {
    type: "invoice_lookup",
    count: invoices.length,
    invoices:
      sanitizeOutput(
        invoices,
      ),
  }
}

/*
 * --------------------------------------------------------------------------
 * CRM ANALYTICS
 * --------------------------------------------------------------------------
 */

async function executeCrmAnalytics(
  orgId: string,
) {
  const [
    customers,
    leads,
    jobs,
    invoices,
    overdueInvoices,
    completedJobs,
  ] = await Promise.all([
    prisma.customer.count({
      where: {
        orgId,
      },
    }),

    prisma.lead.count({
      where: {
        orgId,
      },
    }),

    prisma.job.count({
      where: {
        orgId,
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
      },
    }),

    prisma.invoice.count({
      where: {
        orgId,
        status: "overdue",
      },
    }),

    prisma.job.count({
      where: {
        orgId,
        status: "completed",
      },
    }),
  ])

  const revenue =
    await prisma.invoice.aggregate(
      {
        where: {
          orgId,
          status: "paid",
        },

        _sum: {
          total: true,
        },
      },
    )

  return {
    type: "crm_analytics",

    metrics: {
      customers,
      leads,
      jobs,
      invoices,
      overdueInvoices,
      completedJobs,

      paidInvoiceTotal:
        decimalToNumber(
          revenue._sum.total,
        ),
    },
  }
}

/*
 * --------------------------------------------------------------------------
 * TOOL EXECUTOR
 * --------------------------------------------------------------------------
 *
 * Only explicitly implemented tools can execute.
 */

async function executeTool({
  tool,
  orgId,
  input,
  dryRun,
}: {
  tool: ToolDefinition
  orgId: string
  input: JsonRecord
  dryRun: boolean
}) {
  if (dryRun) {
    return {
      dryRun: true,
      executed: false,
      toolName: tool.name,
      message:
        "Dry run completed. No CRM data was changed.",
    }
  }

  switch (tool.name) {
    case "customer_lookup":
      return executeCustomerLookup(
        orgId,
        input,
      )

    case "lead_lookup":
      return executeLeadLookup(
        orgId,
        input,
      )

    case "job_lookup":
      return executeJobLookup(
        orgId,
        input,
      )

    case "invoice_lookup":
      return executeInvoiceLookup(
        orgId,
        input,
      )

    case "crm_analytics":
      return executeCrmAnalytics(
        orgId,
      )

    default:
      throw new Error(
        `Tool "${tool.name}" does not have an execution handler yet.`,
      )
  }
}

/*
 * --------------------------------------------------------------------------
 * APPROVAL HELPERS
 * --------------------------------------------------------------------------
 */

type ApprovalPayload = {
  toolCallId: string
  toolName: string
  toolType: ToolType
  agentId: string
  input: unknown
}

function extractApprovalPayload(
  value: unknown,
): ApprovalPayload | null {
  if (
    !isPlainObject(value)
  ) {
    return null
  }

  if (
    typeof value.toolCallId !==
      "string" ||
    typeof value.toolName !==
      "string" ||
    typeof value.toolType !==
      "string" ||
    typeof value.agentId !==
      "string"
  ) {
    return null
  }

  return {
    toolCallId:
      value.toolCallId,
    toolName:
      value.toolName,
    toolType:
      value.toolType as ToolType,
    agentId:
      value.agentId,
    input:
      value.input,
  }
}

/*
 * --------------------------------------------------------------------------
 * POST /api/ai/execute
 * --------------------------------------------------------------------------
 *
 * Body:
 *
 * {
 *   "toolName": "customer_lookup",
 *   "agentId": "...",
 *   "conversationId": "...",
 *   "input": {
 *     "search": "John"
 *   }
 * }
 *
 * For an already approved action:
 *
 * {
 *   "toolName": "crm_update",
 *   "agentId": "...",
 *   "approvalId": "..."
 * }
 */
export async function POST(
  request: Request,
) {
  let toolCallId:
    | string
    | null = null

  try {
    /*
     * ---------------------------------------------------------------
     * AUTH
     * ---------------------------------------------------------------
     */

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    const {
      userId,
      orgId,
    } = getSessionContext(
      session,
    )

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        { status: 403 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * REQUEST BODY
     * ---------------------------------------------------------------
     */

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        { status: 400 },
      )
    }

    if (
      !isPlainObject(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Request body must be an object.",
        },
        { status: 400 },
      )
    }

    const payload =
      body as ExecutePayload

    const toolName =
      normalizeString(
        payload.toolName,
        100,
      )

    if (!toolName) {
      return NextResponse.json(
        {
          success: false,
          error:
            "toolName is required.",
        },
        { status: 400 },
      )
    }

    const agentId =
      normalizeString(
        payload.agentId,
        100,
      )

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "agentId is required.",
        },
        { status: 400 },
      )
    }

    const conversationId =
      normalizeString(
        payload.conversationId,
        100,
      )

    const approvalId =
      normalizeString(
        payload.approvalId,
        100,
      )

    const dryRun =
      payload.dryRun === true

    /*
     * ---------------------------------------------------------------
     * TOOL REGISTRY
     * ---------------------------------------------------------------
     */

    const tool =
      getTool(toolName)

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI tool is not registered.",
          toolName,
        },
        { status: 404 },
      )
    }

    if (
      !tool.supportsDryRun &&
      dryRun
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This tool does not support dry-run mode.",
        },
        { status: 400 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * ORGANIZATION SETTINGS
     * ---------------------------------------------------------------
     */

    const settings =
      await getOrganizationSettings(
        orgId,
      )

    const aiEnabled =
      settings?.aiEnabled ??
      true

    const aiCanAct =
      settings?.aiCanAct ??
      false

    const aiRequireApproval =
      settings?.aiRequireApproval ??
      true

    const aiKnowledgeEnabled =
      settings?.aiKnowledgeEnabled ??
      true

    const aiWebSearchEnabled =
      settings?.aiWebSearchEnabled ??
      false

    if (!aiEnabled) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI is disabled for this organization.",
        },
        { status: 403 },
      )
    }

    if (
      tool.type === "knowledge" &&
      !aiKnowledgeEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI knowledge access is disabled.",
        },
        { status: 403 },
      )
    }

    if (
      tool.type === "search" &&
      !aiWebSearchEnabled
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI web search is disabled.",
        },
        { status: 403 },
      )
    }

    if (
      !tool.readOnly &&
      !aiCanAct
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI actions are disabled for this organization.",
        },
        { status: 403 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * AGENT AUTHORIZATION
     * ---------------------------------------------------------------
     */

    const authorization =
      await authorizeAgentTool({
        orgId,
        agentId,
        tool,
      })

    if (!authorization.authorized) {
      return NextResponse.json(
        {
          success: false,
          error:
            authorization.error,
        },
        {
          status:
            authorization.status,
        },
      )
    }

    const {
      agent,
      agentTool,
    } = authorization

    /*
     * ---------------------------------------------------------------
     * CONVERSATION AUTHORIZATION
     * ---------------------------------------------------------------
     */

    if (conversationId) {
      const conversation =
        await verifyConversation(
          conversationId,
          orgId,
          userId,
        )

      if (!conversation) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Conversation not found.",
          },
          { status: 404 },
        )
      }
    }

    /*
     * ---------------------------------------------------------------
     * INPUT
     * ---------------------------------------------------------------
     */

    let input: JsonRecord

    try {
      input =
        validateInput(
          payload.input,
        )
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Invalid tool input.",
        },
        { status: 400 },
      )
    }

    /*
     * ---------------------------------------------------------------
     * APPROVED EXECUTION
     * ---------------------------------------------------------------
     *
     * If approvalId is supplied, the approval must:
     *
     * - belong to this organization
     * - belong to this user
     * - be approved
     * - reference this tool call
     * - reference this agent
     * - reference this tool
     */

    if (approvalId) {
      const approval =
        await prisma.aiApproval.findFirst(
          {
            where: {
              id: approvalId,
              orgId,
              userId,
            },

            select: {
              id: true,
              status: true,
              payload: true,
              expiresAt: true,
            },
          },
        )

      if (!approval) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval not found.",
          },
          { status: 404 },
        )
      }

      if (
        approval.status !==
        "approved"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval has not been approved.",
            approvalStatus:
              approval.status,
          },
          { status: 409 },
        )
      }

      if (
        approval.expiresAt &&
        approval.expiresAt <=
          new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval has expired.",
          },
          { status: 409 },
        )
      }

      const approvalPayload =
        extractApprovalPayload(
          approval.payload,
        )

      if (!approvalPayload) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval payload is invalid.",
          },
          { status: 409 },
        )
      }

      if (
        approvalPayload.toolName !==
        tool.name
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval does not match the requested tool.",
          },
          { status: 403 },
        )
      }

      if (
        approvalPayload.agentId !==
        agent.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approval does not match the requested agent.",
          },
          { status: 403 },
        )
      }

      toolCallId =
        approvalPayload.toolCallId

      const existingToolCall =
        await prisma.aiToolCall.findFirst(
          {
            where: {
              id: toolCallId,
              orgId,
              userId,
              agentId:
                agent.id,
              toolName:
                tool.name,
            },

            select: {
              id: true,
              status: true,
              input: true,
            },
          },
        )

      if (!existingToolCall) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Approved tool call not found.",
          },
          { status: 404 },
        )
      }

      if (
        existingToolCall.status !==
        "pending"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This tool call has already been processed.",
            toolCallStatus:
              existingToolCall.status,
          },
          { status: 409 },
        )
      }

      /*
       * Use the originally approved input.
       *
       * Never allow a caller to replace an approved
       * action's payload at execution time.
       */
      if (
        existingToolCall.input !==
          null &&
        existingToolCall.input !==
          undefined
      ) {
        input =
          validateInput(
            existingToolCall.input,
          )
      }

      /*
       * An approved action must still satisfy the
       * current organization/agent permissions.
       */
      if (
        !tool.readOnly &&
        !agent.canAct
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "AI agent is no longer permitted to perform actions.",
          },
          { status: 403 },
        )
      }

      /*
       * Mark the tool call as running.
       */
      await prisma.aiToolCall.update({
        where: {
          id: toolCallId,
        },

        data: {
          status: "running",
          startedAt:
            new Date(),
          error: null,
        },
      })

      try {
        const output =
          await executeTool({
            tool,
            orgId,
            input,
            dryRun,
          })

        const completed =
          await prisma.aiToolCall.update(
            {
              where: {
                id: toolCallId,
              },

              data: {
                status:
                  "completed",
                output:
                  toJsonValue(
                    output,
                  ),
                completedAt:
                  new Date(),
                error: null,
              },

              select: {
                id: true,
                status: true,
                toolName: true,
                toolType: true,
                output: true,
                startedAt: true,
                completedAt: true,
                createdAt: true,
              },
            },
          )

        return NextResponse.json({
          success: true,
          executed: true,
          requiresApproval:
            false,
          toolCall:
            sanitizeOutput(
              completed,
            ),
          output:
            sanitizeOutput(
              output,
            ),
        })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Tool execution failed."

        await prisma.aiToolCall.update(
          {
            where: {
              id: toolCallId,
            },

            data: {
              status: "failed",
              error: message.slice(
                0,
                2_000,
              ),
              completedAt:
                new Date(),
            },
          },
        )

        return NextResponse.json(
          {
            success: false,
            executed: false,
            error:
              "Tool execution failed.",
            toolCallId,
          },
          { status: 500 },
        )
      }
    }

    /*
     * ---------------------------------------------------------------
     * APPROVAL REQUIREMENT
     * ---------------------------------------------------------------
     *
     * Read-only tools can execute immediately.
     *
     * Action tools create a pending AiToolCall and an AiApproval.
     */

    const requiresApproval =
      !tool.readOnly &&
      (
        tool.requiresApproval ||
        aiRequireApproval ||
        agent.requiresApproval ||
        agentTool.requiresApproval
      )

    /*
     * ---------------------------------------------------------------
     * CREATE TOOL CALL
     * ---------------------------------------------------------------
     */

    const createdToolCall =
      await prisma.aiToolCall.create(
        {
          data: {
            orgId,
            conversationId:
              conversationId ??
              undefined,
            agentId: agent.id,
            userId,
            toolName:
              tool.name,
            toolType:
              tool.type,
            input:
              toJsonValue(input),
            status:
              requiresApproval
                ? "pending"
                : "running",
            startedAt:
              requiresApproval
                ? undefined
                : new Date(),
          },

          select: {
            id: true,
            orgId: true,
            conversationId: true,
            agentId: true,
            userId: true,
            toolName: true,
            toolType: true,
            input: true,
            status: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,
          },
        },
      )

    toolCallId =
      createdToolCall.id

    /*
     * ---------------------------------------------------------------
     * ACTION REQUIRES APPROVAL
     * ---------------------------------------------------------------
     */

    if (requiresApproval) {
      const expiresAt =
        new Date(
          Date.now() +
            30 * 60 * 1000,
        )

      try {
        const approval =
          await prisma.aiApproval.create(
            {
              data: {
                orgId,
                conversationId:
                  conversationId ??
                  undefined,
                userId,

                actionType:
                  tool.name,

                description:
                  `AI agent "${agent.name}" requested execution of "${tool.name}".`,

                payload:
                  toJsonValue({
                    toolCallId:
                      createdToolCall.id,
                    toolName:
                      tool.name,
                    toolType:
                      tool.type,
                    agentId:
                      agent.id,
                    input,
                  }),

                status:
                  "pending",

                expiresAt,
              },

              select: {
                id: true,
                status: true,
                actionType: true,
                description: true,
                expiresAt: true,
                createdAt: true,
              },
            },
          )

        return NextResponse.json(
          {
            success: true,
            executed: false,
            requiresApproval:
              true,

            toolCall: {
              ...createdToolCall,
              status:
                "pending",
            },

            approval,

            message:
              "The requested AI action requires approval before execution.",
          },
          { status: 202 },
        )
      } catch (error) {
        /*
         * Do not leave an orphaned pending tool call
         * if approval creation fails.
         */
        await prisma.aiToolCall.update(
          {
            where: {
              id: createdToolCall.id,
            },

            data: {
              status:
                "failed",
              error:
                "Unable to create approval request.",
              completedAt:
                new Date(),
            },
          },
        )

        throw error
      }
    }

    /*
     * ---------------------------------------------------------------
     * IMMEDIATE READ-ONLY EXECUTION
     * ---------------------------------------------------------------
     */

    try {
      const output =
        await executeTool({
          tool,
          orgId,
          input,
          dryRun,
        })

      const completed =
        await prisma.aiToolCall.update(
          {
            where: {
              id: createdToolCall.id,
            },

            data: {
              status:
                "completed",
              output:
                toJsonValue(
                  output,
                ),
              completedAt:
                new Date(),
              error: null,
            },

            select: {
              id: true,
              orgId: true,
              conversationId: true,
              agentId: true,
              userId: true,
              toolName: true,
              toolType: true,
              input: true,
              output: true,
              status: true,
              startedAt: true,
              completedAt: true,
              createdAt: true,
            },
          },
        )

      return NextResponse.json({
        success: true,
        executed: true,
        requiresApproval:
          false,

        toolCall:
          sanitizeOutput(
            completed,
          ),

        output:
          sanitizeOutput(
            output,
          ),
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Tool execution failed."

      await prisma.aiToolCall.update(
        {
          where: {
            id: createdToolCall.id,
          },

          data: {
            status: "failed",
            error: message.slice(
              0,
              2_000,
            ),
            completedAt:
              new Date(),
          },
        },
      )

      return NextResponse.json(
        {
          success: false,
          executed: false,
          error:
            "Tool execution failed.",
          toolCallId:
            createdToolCall.id,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error(
      "[AI_EXECUTE]",
      error,
    )

    /*
     * If a tool call was created but an unexpected
     * error occurred afterward, attempt to record
     * the failure without exposing internal details.
     */
    if (toolCallId) {
      try {
        await prisma.aiToolCall.update(
          {
            where: {
              id: toolCallId,
            },

            data: {
              status: "failed",
              error:
                "Unexpected tool execution error.",
              completedAt:
                new Date(),
            },
          },
        )
      } catch (updateError) {
        console.error(
          "[AI_EXECUTE_UPDATE_FAILURE]",
          updateError,
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        executed: false,
        error:
          "Unable to execute AI tool.",
      },
      { status: 500 },
    )
  }
}