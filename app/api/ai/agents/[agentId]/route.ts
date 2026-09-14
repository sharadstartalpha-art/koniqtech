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

type AgentStatus =
  | "draft"
  | "active"
  | "inactive"

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

function normalizeSlug(
  value: unknown,
): string | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined
  }

  const slug =
    value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(
        0,
        100,
      )

  return slug || undefined
}

function normalizeStatus(
  value: unknown,
): AgentStatus | undefined {
  if (
    value === "draft" ||
    value === "active" ||
    value === "inactive"
  ) {
    return value
  }

  return undefined
}

function normalizeNumber(
  value: unknown,
): number | undefined {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return undefined
  }

  return value
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

function isValidTemperature(
  value: number,
) {
  return (
    value >= 0 &&
    value <= 2
  )
}

function isValidMaxTokens(
  value: number,
) {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 100000
  )
}

const agentSelect = {
  id: true,
  orgId: true,
  name: true,
  slug: true,
  description: true,
  instructions: true,
  model: true,
  status: true,
  temperature: true,
  maxTokens: true,
  requiresApproval: true,
  canAct: true,
  config: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,

  tools: {
    orderBy: {
      createdAt:
        "asc",
    },

    select: {
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
    },
  },
} satisfies Prisma.AiAgentSelect

/**
 * GET /api/ai/agents/[agentId]
 *
 * Returns one AI agent and its configured tools.
 */
export async function GET(
  _request: Request,
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

          select:
            agentSelect,
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

    return NextResponse.json(
      {
        success: true,
        agent,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI agent.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/agents/[agentId]
 *
 * Updates one AI agent.
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

    const existing =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
            canAct: true,
            requiresApproval:
              true,
          },
        },
      )

    if (!existing) {
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

    const data: Record<
      string,
      unknown
    > = {}

    const errors: string[] =
      []

    /**
     * Name.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "name",
      )
    ) {
      const name =
        normalizeText(
          body.name,
          120,
        )

      if (!name) {
        errors.push(
          "name must be a non-empty string.",
        )
      } else {
        data.name =
          name
      }
    }

    /**
     * Slug.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "slug",
      )
    ) {
      const slug =
        normalizeSlug(
          body.slug,
        )

      if (!slug) {
        errors.push(
          "slug must contain at least one valid character.",
        )
      } else {
        data.slug =
          slug
      }
    }

    /**
     * Description.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "description",
      )
    ) {
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
          body.description !==
            "" &&
          !description
        ) {
          errors.push(
            "description must be a string or null.",
          )
        } else {
          data.description =
            description ??
            null
        }
      }
    }

    /**
     * Instructions.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "instructions",
      )
    ) {
      if (
        body.instructions ===
        null
      ) {
        data.instructions =
          null
      } else {
        const instructions =
          normalizeText(
            body.instructions,
            20000,
          )

        if (!instructions) {
          errors.push(
            "instructions must be a non-empty string or null.",
          )
        } else {
          data.instructions =
            instructions
        }
      }
    }

    /**
     * Model.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "model",
      )
    ) {
      const model =
        normalizeText(
          body.model,
          100,
        )

      if (!model) {
        errors.push(
          "model must be a non-empty string.",
        )
      } else {
        data.model =
          model
      }
    }

    /**
     * Status.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "status",
      )
    ) {
      const status =
        normalizeStatus(
          body.status,
        )

      if (!status) {
        errors.push(
          "status must be draft, active, or inactive.",
        )
      } else {
        data.status =
          status
      }
    }

    /**
     * Temperature.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "temperature",
      )
    ) {
      const temperature =
        normalizeNumber(
          body.temperature,
        )

      if (
        temperature ===
          undefined ||
        !isValidTemperature(
          temperature,
        )
      ) {
        errors.push(
          "temperature must be a number between 0 and 2.",
        )
      } else {
        data.temperature =
          temperature
      }
    }

    /**
     * Maximum output tokens.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "maxTokens",
      )
    ) {
      const maxTokens =
        normalizeNumber(
          body.maxTokens,
        )

      if (
        maxTokens ===
          undefined ||
        !isValidMaxTokens(
          maxTokens,
        )
      ) {
        errors.push(
          "maxTokens must be an integer between 1 and 100000.",
        )
      } else {
        data.maxTokens =
          maxTokens
      }
    }

    /**
     * canAct.
     */
    let finalCanAct =
      existing.canAct

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "canAct",
      )
    ) {
      const canAct =
        normalizeBoolean(
          body.canAct,
        )

      if (
        canAct === undefined
      ) {
        errors.push(
          "canAct must be a boolean.",
        )
      } else {
        finalCanAct =
          canAct

        data.canAct =
          canAct
      }
    }

    /**
     * requiresApproval.
     */
    let finalRequiresApproval =
      existing.requiresApproval

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "requiresApproval",
      )
    ) {
      const requiresApproval =
        normalizeBoolean(
          body.requiresApproval,
        )

      if (
        requiresApproval ===
        undefined
      ) {
        errors.push(
          "requiresApproval must be a boolean.",
        )
      } else {
        finalRequiresApproval =
          requiresApproval

        data.requiresApproval =
          requiresApproval
      }
    }

    /**
     * Safety invariant:
     *
     * An agent capable of acting must remain
     * approval-protected.
     */
    if (
      finalCanAct &&
      !finalRequiresApproval
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agents with canAct enabled must require approval.",
          code:
            "AI_APPROVAL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Config.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "config",
      )
    ) {
      const config =
        normalizeConfig(
          body.config,
        )

      if (
        config === undefined
      ) {
        errors.push(
          "config must be valid JSON.",
        )
      } else {
        data.config =
          config
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid AI agent data.",
          details:
            errors,
        },
        {
          status: 400,
        },
      )
    }

    if (
      Object.keys(data).length === 0
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

    let agent

    try {
      agent =
        await prisma.aiAgent.update(
          {
            where: {
              id:
                agentId,
            },

            data:
              data as Prisma.AiAgentUpdateInput,

            select:
              agentSelect,
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
              "An agent with this slug already exists in this organization.",
            code:
              "AGENT_SLUG_EXISTS",
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
        agent,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI agent.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * DELETE /api/ai/agents/[agentId]
 *
 * Permanently deletes one AI agent.
 *
 * Its assigned AiAgentTool records are
 * removed through the database cascade.
 */
export async function DELETE(
  _request: Request,
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

    const existing =
      await prisma.aiAgent.findFirst(
        {
          where: {
            id: agentId,
            orgId,
          },

          select: {
            id: true,
            name: true,
          },
        },
      )

    if (!existing) {
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

    await prisma.aiAgent.delete(
      {
        where: {
          id:
            existing.id,
        },
      },
    )

    return NextResponse.json(
      {
        success: true,
        deleted: true,
        agentId:
          existing.id,
      },
    )
  } catch (error) {
    console.error(
      "[AI_AGENT_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete AI agent.",
      },
      {
        status: 500,
      },
    )
  }
}