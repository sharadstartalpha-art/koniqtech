import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type WorkflowStatus =
  | "draft"
  | "active"
  | "inactive"

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

function normalizeStatus(
  value: unknown,
): WorkflowStatus | undefined {
  if (
    value === "draft" ||
    value === "active" ||
    value === "inactive"
  ) {
    return value
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

const workflowSelect = {
  id: true,
  orgId: true,
  agentId: true,
  name: true,
  description: true,
  triggerEvent: true,
  status: true,
  requiresApproval: true,
  config: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,

  agent: {
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      canAct: true,
      requiresApproval: true,
    },
  },
} satisfies Prisma.AiWorkflowSelect

/**
 * GET /api/ai/workflows
 *
 * Lists AI workflows belonging to the
 * authenticated organization.
 *
 * Optional query parameters:
 *
 * ?status=active
 * ?agentId=...
 * ?limit=50
 */
export async function GET(
  request: Request,
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

    const {
      searchParams,
    } = new URL(
      request.url,
    )

    const statusParam =
      searchParams.get(
        "status",
      )

    const agentId =
      searchParams
        .get("agentId")
        ?.trim() || ""

    const limitParam =
      searchParams.get(
        "limit",
      )

    let status:
      | WorkflowStatus
      | undefined

    if (
      statusParam
    ) {
      status =
        normalizeStatus(
          statusParam,
        )

      if (!status) {
        return NextResponse.json(
          {
            success: false,
            error:
              "status must be draft, active, or inactive.",
          },
          {
            status: 400,
          },
        )
      }
    }

    let limit = 50

    if (limitParam) {
      const parsed =
        Number(
          limitParam,
        )

      if (
        !Number.isInteger(
          parsed,
        ) ||
        parsed < 1 ||
        parsed > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "limit must be an integer between 1 and 100.",
          },
          {
            status: 400,
          },
        )
      }

      limit = parsed
    }

    if (agentId) {
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
    }

    const workflows =
      await prisma.aiWorkflow.findMany(
        {
          where: {
            orgId,

            ...(status
              ? {
                  status:
                    status as any,
                }
              : {}),

            ...(agentId
              ? {
                  agentId,
                }
              : {}),
          },

          orderBy: [
            {
              updatedAt:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],

          take: limit,

          select:
            workflowSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        workflows,
        count:
          workflows.length,
      },
    )
  } catch (error) {
    console.error(
      "[AI_WORKFLOWS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI workflows.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * POST /api/ai/workflows
 *
 * Creates an AI workflow.
 *
 * Body:
 *
 * {
 *   "agentId": "...",
 *   "name": "New Lead Follow Up",
 *   "description": "Follow up with new leads",
 *   "triggerEvent": "lead.created",
 *   "status": "draft",
 *   "requiresApproval": true,
 *   "config": {}
 * }
 */
export async function POST(
  request: Request,
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

    const agentId =
      normalizeText(
        body.agentId,
        200,
      )

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "agentId is required.",
        },
        {
          status: 400,
        },
      )
    }

    const name =
      normalizeText(
        body.name,
        150,
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

    const triggerEvent =
      normalizeText(
        body.triggerEvent,
        150,
      )

    if (!triggerEvent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "triggerEvent is required.",
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
              2000,
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

    const status =
      body.status ===
      undefined
        ? "draft"
        : normalizeStatus(
            body.status,
          )

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error:
            "status must be draft, active, or inactive.",
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

    /**
     * Verify the agent belongs to the same
     * organization and retrieve its action
     * configuration.
     */
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

    /**
     * An inactive agent cannot run an active
     * workflow.
     */
    if (
      status ===
        "active" &&
      agent.status !==
        "active"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An active workflow requires an active AI agent.",
          code:
            "ACTIVE_AGENT_REQUIRED",
        },
        {
          status: 409,
        },
      )
    }

    /**
     * Acting agents must retain approval
     * protection.
     */
    const requiresApproval =
      agent.canAct
        ? true
        : requestedApproval ??
          agent.requiresApproval

    if (
      agent.canAct &&
      requestedApproval ===
        false
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Workflows using an acting agent must require approval.",
          code:
            "AI_APPROVAL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    let workflow

    try {
      workflow =
        await prisma.aiWorkflow.create(
          {
            data: {
              orgId,
              agentId,
              name,
              triggerEvent,

              ...(description !==
              undefined &&
              description !== null
                ? {
                    description,
                  }
                : {}),

              status:
                status as any,

              requiresApproval,

              ...(config !==
              undefined
                ? {
                    config:
                      config as any,
                  }
                : {}),

              createdById:
                userId,
            } as any,

            select:
              workflowSelect,
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
              "A workflow with this name already exists for this organization.",
            code:
              "WORKFLOW_ALREADY_EXISTS",
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
        workflow,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      "[AI_WORKFLOW_POST]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create AI workflow.",
      },
      {
        status: 500,
      },
    )
  }
}