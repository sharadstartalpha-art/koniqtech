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

type RouteContext = {
  params: Promise<{
    workflowId: string
  }>
}

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
 * GET /api/ai/workflows/[workflowId]
 *
 * Returns one organization-owned AI workflow.
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

    const workflowId =
      typeof params.workflowId ===
      "string"
        ? params.workflowId.trim()
        : ""

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Workflow ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const workflow =
      await prisma.aiWorkflow.findFirst(
        {
          where: {
            id: workflowId,
            orgId,
          },

          select:
            workflowSelect,
        },
      )

    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI workflow not found.",
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(
      {
        success: true,
        workflow,
      },
    )
  } catch (error) {
    console.error(
      "[AI_WORKFLOW_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI workflow.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/workflows/[workflowId]
 *
 * Updates one AI workflow.
 *
 * Supported fields:
 *
 * {
 *   "agentId": "...",
 *   "name": "...",
 *   "description": "...",
 *   "triggerEvent": "...",
 *   "status": "draft|active|inactive",
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

    const workflowId =
      typeof params.workflowId ===
      "string"
        ? params.workflowId.trim()
        : ""

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Workflow ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
      await prisma.aiWorkflow.findFirst(
        {
          where: {
            id: workflowId,
            orgId,
          },

          select: {
            id: true,
            agentId: true,
            status: true,
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
            "AI workflow not found.",
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

    let finalAgentId =
      existing.agentId

    let finalStatus =
      existing.status as WorkflowStatus

    let finalRequiresApproval =
      existing.requiresApproval

    /**
     * Agent.
     *
     * The schema permits an agent relation to
     * become null, so null is supported here.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "agentId",
      )
    ) {
      if (
        body.agentId ===
        null
      ) {
        finalAgentId =
          null

        data.agentId =
          null
      } else {
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
                "agentId must be a valid string or null.",
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

        finalAgentId =
          agent.id

        data.agentId =
          agent.id
      }
    }

    /**
     * Load the final agent configuration.
     *
     * This is required for validating an
     * active workflow and approval requirements.
     */
    let finalAgent:
      | {
          id: string
          status: string
          canAct: boolean
          requiresApproval: boolean
        }
      | null =
      null

    if (finalAgentId) {
      finalAgent =
        await prisma.aiAgent.findFirst(
          {
            where: {
              id:
                finalAgentId,
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

      if (!finalAgent) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The selected AI agent is not available in this organization.",
          },
          {
            status: 404,
          },
        )
      }
    }

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
          150,
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
            2000,
          )

        if (!description) {
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

    /**
     * Trigger event.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "triggerEvent",
      )
    ) {
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
              "triggerEvent must be a non-empty string.",
          },
          {
            status: 400,
          },
        )
      }

      data.triggerEvent =
        triggerEvent
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

      finalStatus =
        status

      data.status =
        status as any
    }

    /**
     * Approval requirement.
     */
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
     * Acting agents must never run workflows
     * without approval protection.
     */
    if (
      finalAgent?.canAct &&
      !finalRequiresApproval
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

    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "requiresApproval",
      )
    ) {
      data.requiresApproval =
        finalRequiresApproval
    }

    /**
     * An active workflow requires an active
     * agent.
     */
    if (
      finalStatus ===
        "active" &&
      !finalAgent
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An active workflow must have an active AI agent.",
          code:
            "ACTIVE_AGENT_REQUIRED",
        },
        {
          status: 409,
        },
      )
    }

    if (
  finalStatus ===
    "active" &&
  (
    !finalAgent ||
    finalAgent.status !==
      "active"
  )
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

    if (
      Object.keys(data).length ===
      0
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

    const workflow =
      await prisma.aiWorkflow.update(
        {
          where: {
            id:
              existing.id,
          },

          data:
            data as Prisma.AiWorkflowUpdateInput,

          select:
            workflowSelect,
        },
      )

    return NextResponse.json(
      {
        success: true,
        workflow,
      },
    )
  } catch (error) {
    console.error(
      "[AI_WORKFLOW_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI workflow.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * DELETE /api/ai/workflows/[workflowId]
 *
 * Permanently deletes one AI workflow.
 *
 * This does not delete the associated AI agent.
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

    const workflowId =
      typeof params.workflowId ===
      "string"
        ? params.workflowId.trim()
        : ""

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Workflow ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const existing =
      await prisma.aiWorkflow.findFirst(
        {
          where: {
            id: workflowId,
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
            "AI workflow not found.",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.aiWorkflow.delete(
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
        workflowId:
          existing.id,
      },
    )
  } catch (error) {
    console.error(
      "[AI_WORKFLOW_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete AI workflow.",
      },
      {
        status: 500,
      },
    )
  }
}