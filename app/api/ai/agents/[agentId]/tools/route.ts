import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type RouteContext = {
  params: Promise<{
    agentId: string
  }>
}

const AI_TOOL_TYPES = [
  "crm_read",
  "crm_write",
  "communication",
  "search",
  "knowledge",
  "analytics",
  "scheduling",
  "finance",
  "system",
] as const

type AiToolType =
  (typeof AI_TOOL_TYPES)[number]

const ACTION_TOOL_TYPES: AiToolType[] = [
  "crm_write",
  "communication",
  "scheduling",
  "finance",
]

function getSessionContext(
  session: {
    user?: SessionUser | null
  },
) {
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

function normalizeText(
  value: unknown,
  maxLength: number,
): string | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  const normalized =
    value.trim()

  if (!normalized) {
    return undefined
  }

  return normalized.slice(
    0,
    maxLength,
  )
}

function normalizeBoolean(
  value: unknown,
): boolean | undefined {
  if (
    typeof value !== "boolean"
  ) {
    return undefined
  }

  return value
}

function normalizeToolType(
  value: unknown,
): AiToolType | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  if (
    AI_TOOL_TYPES.includes(
      value as AiToolType,
    )
  ) {
    return value as AiToolType
  }

  return undefined
}

function normalizeConfig(
  value: unknown,
): Prisma.InputJsonValue | undefined {
  if (
    value === undefined
  ) {
    return undefined
  }

  if (
    value === null
  ) {
    return null as any
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value
  }

  if (
    Array.isArray(value)
  ) {
    return value as Prisma.InputJsonValue
  }

  if (
    typeof value === "object"
  ) {
    return value as Prisma.InputJsonObject
  }

  return undefined
}

function isActionTool(
  type: AiToolType,
) {
  return ACTION_TOOL_TYPES.includes(
    type,
  )
}

const toolSelect = {
  id: true,
  agentId: true,
  name: true,
  description: true,
  type: true,
  enabled: true,
  requiresApproval: true,
  config: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AiAgentToolSelect

/**
 * GET /api/ai/agents/[agentId]/tools
 *
 * Lists all tools assigned to one agent.
 *
 * Optional:
 *
 *   ?enabled=true
 *   ?enabled=false
 */
export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
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
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const params =
      await context.params

    const agentId =
      typeof params.agentId ===
      "string"
        ? params.agentId.trim()
        : ""

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const agent =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
            name: true,
            status: true,
            canAct: true,
            requiresApproval:
              true,
          },
        },
      )

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        {
          status: 404,
        },
      )
    }

    const {
      searchParams,
    } = new URL(
      request.url,
    )

    const enabledParam =
      searchParams.get(
        "enabled",
      )

    let enabled:
      | boolean
      | undefined

    if (
      enabledParam === "true"
    ) {
      enabled = true
    } else if (
      enabledParam === "false"
    ) {
      enabled = false
    }

    const tools =
      await prisma.aiAgentTool.findMany(
        {
          where: {
            agentId,

            ...(enabled !==
            undefined
              ? {
                  enabled,
                }
              : {}),
          },

          orderBy: {
            createdAt:
              "asc",
          },

          select:
            toolSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,

        agent: {
          id: agent.id,
          name: agent.name,
          status: agent.status,
          canAct: agent.canAct,
          requiresApproval:
            agent.requiresApproval,
        },

        tools,

        count:
          tools.length,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_TOOLS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load agent tools.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * POST /api/ai/agents/[agentId]/tools
 *
 * Assigns a tool to an agent.
 *
 * Body:
 *
 * {
 *   "name": "customer_lookup",
 *   "description": "Look up a customer",
 *   "type": "crm_read",
 *   "enabled": true,
 *   "requiresApproval": true,
 *   "config": {}
 * }
 */
export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
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
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const params =
      await context.params

    const agentId =
      typeof params.agentId ===
      "string"
        ? params.agentId.trim()
        : ""

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const agent =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
            name: true,
            status: true,
            canAct: true,
            requiresApproval:
              true,
          },
        },
      )

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        {
          status: 404,
        },
      )
    }

    if (
      agent.status ===
      "inactive"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tools cannot be assigned to an inactive agent.",
        },
        {
          status: 409,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

    try {
      const parsed =
        await request.json()

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Request body must be a JSON object.",
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const name =
      normalizeText(
        body.name,
        120,
      )

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "name is required.",
        },
        {
          status: 400,
        },
      )
    }

    const description =
      body.description ===
      null
        ? null
        : body.description !==
            undefined
          ? normalizeText(
              body.description,
              1000,
            )
          : undefined

    if (
      body.description !==
        undefined &&
      body.description !==
        null &&
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "description must be a non-empty string or null.",
        },
        {
          status: 400,
        },
      )
    }

    const type =
      normalizeToolType(
        body.type,
      )

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error:
            "type must be one of: crm_read, crm_write, communication, search, knowledge, analytics, scheduling, finance, system.",
        },
        {
          status: 400,
        },
      )
    }

    const enabled =
      body.enabled ===
      undefined
        ? true
        : normalizeBoolean(
            body.enabled,
          )

    if (
      enabled === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "enabled must be a boolean.",
        },
        {
          status: 400,
        },
      )
    }

    const requestedApproval =
      body.requiresApproval ===
      undefined
        ? undefined
        : normalizeBoolean(
            body.requiresApproval,
          )

    if (
      body.requiresApproval !==
        undefined &&
      requestedApproval ===
        undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "requiresApproval must be a boolean.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Action tools must be approval-protected
     * whenever the agent is capable of acting.
     */
    const requiresApproval =
      agent.canAct &&
      isActionTool(type)
        ? true
        : requestedApproval ??
          agent.requiresApproval

    if (
      agent.canAct &&
      isActionTool(type) &&
      requestedApproval ===
        false
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Action tools assigned to an acting agent must require approval.",
          code:
            "AI_APPROVAL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    const config =
      normalizeConfig(
        body.config,
      )

    if (
      body.config !==
        undefined &&
      config ===
        undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "config must contain valid JSON.",
        },
        {
          status: 400,
        },
      )
    }

    try {
      const tool =
  await prisma.aiAgentTool.create(
    {
      data: {
        agentId,

        name,

        ...(description !==
        undefined &&
        description !== null
          ? {
              description,
            }
          : {}),

        type:
          type as any,

        enabled,

        requiresApproval,

        ...(config !==
        undefined
          ? {
              config:
                config as any,
            }
          : {}),
      } as any,

      select:
        toolSelect,
    },
  )

      return NextResponse.json(
        {
          success: true,
          tool,
        },
        {
          status: 201,
        },
      )
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code ===
          "P2002"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This tool is already assigned to the agent.",
            code:
              "TOOL_ALREADY_ASSIGNED",
          },
          {
            status: 409,
          },
        )
      }

      throw error
    }
  } catch (error) {
    console.error(
      "[AI_AGENT_TOOLS_POST]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to assign tool to agent.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/agents/[agentId]/tools
 *
 * Updates an assigned tool.
 *
 * Body:
 *
 * {
 *   "toolId": "...",
 *   "name": "customer_lookup",
 *   "enabled": true,
 *   "requiresApproval": true,
 *   "config": {}
 * }
 */
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
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
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const params =
      await context.params

    const agentId =
      typeof params.agentId ===
      "string"
        ? params.agentId.trim()
        : ""

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const agent =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
            status: true,
            canAct: true,
            requiresApproval:
              true,
          },
        },
      )

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        {
          status: 404,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

    try {
      const parsed =
        await request.json()

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Request body must be a JSON object.",
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const toolId =
      typeof body.toolId ===
      "string"
        ? body.toolId.trim()
        : ""

    if (!toolId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "toolId is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
      await prisma.aiAgentTool.findFirst(
        {
          where: {
            id: toolId,
            agentId,
          },

          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            enabled: true,
            requiresApproval:
              true,
            config: true,
          },
        },
      )

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent tool not found.",
        },
        {
          status: 404,
        },
      )
    }

    const hasName =
      Object.prototype.hasOwnProperty.call(
        body,
        "name",
      )

    const hasDescription =
      Object.prototype.hasOwnProperty.call(
        body,
        "description",
      )

    const hasType =
      Object.prototype.hasOwnProperty.call(
        body,
        "type",
      )

    const hasEnabled =
      Object.prototype.hasOwnProperty.call(
        body,
        "enabled",
      )

    const hasApproval =
      Object.prototype.hasOwnProperty.call(
        body,
        "requiresApproval",
      )

    const hasConfig =
      Object.prototype.hasOwnProperty.call(
        body,
        "config",
      )

    if (
      !hasName &&
      !hasDescription &&
      !hasType &&
      !hasEnabled &&
      !hasApproval &&
      !hasConfig
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No supported fields were provided.",
        },
        {
          status: 400,
        },
      )
    }

    const data: Record<
      string,
      unknown
    > = {}

    if (hasName) {
      const name =
        normalizeText(
          body.name,
          120,
        )

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            error:
              "name must be a non-empty string.",
          },
          {
            status: 400,
          },
        )
      }

      data.name =
        name
    }

    if (hasDescription) {
      if (
        body.description ===
        null
      ) {
        data.description =
          null
      } else {
        const description =
          normalizeText(
            body.description,
            1000,
          )

        if (
          !description
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "description must be a non-empty string or null.",
            },
            {
              status: 400,
            },
          )
        }

        data.description =
          description
      }
    }

    let finalType =
      existing.type as AiToolType

    if (hasType) {
      const type =
        normalizeToolType(
          body.type,
        )

      if (!type) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Invalid AI tool type.",
          },
          {
            status: 400,
          },
        )
      }

      finalType =
        type

      data.type =
        type as any
    }

    let finalEnabled =
      existing.enabled

    if (hasEnabled) {
      const enabled =
        normalizeBoolean(
          body.enabled,
        )

      if (
        enabled ===
        undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "enabled must be a boolean.",
          },
          {
            status: 400,
          },
        )
      }

      finalEnabled =
        enabled

      data.enabled =
        enabled
    }

    let finalRequiresApproval =
      existing.requiresApproval

    if (hasApproval) {
      const requiresApproval =
        normalizeBoolean(
          body.requiresApproval,
        )

      if (
        requiresApproval ===
        undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "requiresApproval must be a boolean.",
          },
          {
            status: 400,
          },
        )
      }

      finalRequiresApproval =
        requiresApproval
    }

    /**
     * Safety invariant.
     *
     * Action tools cannot bypass approval
     * when assigned to an acting agent.
     */
    if (
      agent.canAct &&
      isActionTool(
        finalType,
      ) &&
      !finalRequiresApproval
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Action tools assigned to an acting agent must require approval.",
          code:
            "AI_APPROVAL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    if (hasApproval) {
      data.requiresApproval =
        finalRequiresApproval
    }

    if (hasConfig) {
      const config =
        normalizeConfig(
          body.config,
        )

      if (
        config ===
        undefined
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "config must contain valid JSON.",
          },
          {
            status: 400,
          },
        )
      }

      data.config =
        config as any
    }

    let tool

    try {
      tool =
        await prisma.aiAgentTool.update(
          {
            where: {
              id:
                existing.id,
            },

            data,

            select:
              toolSelect,
          },
        )
    } catch (error) {
      if (
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
        error.code ===
          "P2002"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "A tool with this name is already assigned to the agent.",
            code:
              "TOOL_ALREADY_ASSIGNED",
          },
          {
            status: 409,
          },
        )
      }

      throw error
    }

    return NextResponse.json(
      {
        success: true,
        tool,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_TOOLS_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update agent tool.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * DELETE /api/ai/agents/[agentId]/tools
 *
 * Body:
 *
 * {
 *   "toolId": "..."
 * }
 */
export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const session =
      await auth()

    if (
      !session?.user?.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
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
        {
          status: 401,
        },
      )
    }

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization context is required.",
        },
        {
          status: 403,
        },
      )
    }

    const params =
      await context.params

    const agentId =
      typeof params.agentId ===
      "string"
        ? params.agentId.trim()
        : ""

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const agent =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
          },
        },
      )

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        {
          status: 404,
        },
      )
    }

    let body: Record<
      string,
      unknown
    >

    try {
      const parsed =
        await request.json()

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Request body must be a JSON object.",
          },
          {
            status: 400,
          },
        )
      }

      body =
        parsed as Record<
          string,
          unknown
        >
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      )
    }

    const toolId =
      typeof body.toolId ===
      "string"
        ? body.toolId.trim()
        : ""

    if (!toolId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "toolId is required.",
        },
        {
          status: 400,
        },
      )
    }

    const tool =
      await prisma.aiAgentTool.findFirst(
        {
          where: {
            id: toolId,
            agentId,
          },

          select: {
            id: true,
            name: true,
          },
        },
      )

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent tool not found.",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.aiAgentTool.delete(
      {
        where: {
          id:
            tool.id,
        },
      },
    )

    return NextResponse.json(
      {
        success: true,
        deleted: true,
        toolId:
          tool.id,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_TOOLS_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to remove agent tool.",
      },
      {
        status: 500,
      },
    )
  }
}