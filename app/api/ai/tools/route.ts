import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

/**
 * ============================================================
 * AI TOOL TYPES
 * ============================================================
 *
 * These values must match the production AiToolType enum.
 *
 * We intentionally use a local literal union instead of
 * Prisma.AiToolType because the generated Prisma namespace
 * in this project does not reliably expose all enums there.
 * ============================================================
 */

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

/**
 * ============================================================
 * REQUEST TYPES
 * ============================================================
 */

type SessionUser = {
  id?: string
  orgId?: string | null
}

type ToolPayload = {
  id?: unknown
  agentId?: unknown
  name?: unknown
  description?: unknown
  type?: unknown
  enabled?: unknown
  requiresApproval?: unknown
  config?: unknown
}

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function getSessionContext(
  session: {
    user?: SessionUser | null
  },
) {
  const userId =
    typeof session.user?.id ===
    "string"
      ? session.user.id.trim()
      : ""

  const orgId =
    typeof session.user?.orgId ===
    "string"
      ? session.user.orgId.trim()
      : ""

  return {
    userId,
    orgId,
  }
}

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function isAiToolType(
  value: unknown,
): value is AiToolType {
  return (
    typeof value ===
      "string" &&
    (
      AI_TOOL_TYPES as
        readonly string[]
    ).includes(value)
  )
}

function normalizeText(
  value: unknown,
  field: string,
  maxLength: number,
  options?: {
    required?: boolean
    nullable?: boolean
  },
) {
  const required =
    options?.required ?? false

  const nullable =
    options?.nullable ?? false

  if (
    value === undefined
  ) {
    return {
      valid: !required,
      value:
        undefined as
          | string
          | null
          | undefined,
      error: required
        ? `${field} is required.`
        : undefined,
    }
  }

  if (
    value === null &&
    nullable
  ) {
    return {
      valid: true,
      value: null,
      error: undefined,
    }
  }

  if (
    typeof value !==
    "string"
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        `${field} must be a string.`,
    }
  }

  const normalized =
    value.trim()

  if (!normalized) {
    if (required) {
      return {
        valid: false,
        value: undefined,
        error:
          `${field} is required.`,
      }
    }

    if (nullable) {
      return {
        valid: true,
        value: null,
        error: undefined,
      }
    }

    return {
      valid: true,
      value: "",
      error: undefined,
    }
  }

  if (
    normalized.length >
    maxLength
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        `${field} cannot exceed ${maxLength} characters.`,
    }
  }

  return {
    valid: true,
    value: normalized,
    error: undefined,
  }
}

function normalizeBoolean(
  value: unknown,
  field: string,
) {
  if (
    value === undefined
  ) {
    return {
      valid: true,
      value:
        undefined as
          | boolean
          | undefined,
      error: undefined,
    }
  }

  if (
    typeof value !==
    "boolean"
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        `${field} must be a boolean.`,
    }
  }

  return {
    valid: true,
    value,
    error: undefined,
  }
}

function normalizeToolType(
  value: unknown,
  required = false,
) {
  if (
    value === undefined
  ) {
    return {
      valid: !required,
      value:
        undefined as
          | AiToolType
          | undefined,
      error: required
        ? "Tool type is required."
        : undefined,
    }
  }

  if (
    !isAiToolType(value)
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        "Invalid tool type.",
    }
  }

  return {
    valid: true,
    value:
      value as AiToolType,
    error: undefined,
  }
}

function normalizeConfig(
  value: unknown,
) {
  if (
    value === undefined
  ) {
    return {
      valid: true,
      value:
        undefined as
          | Prisma.InputJsonValue
          | Prisma.NullableJsonNullValueInput
          | undefined,
      error: undefined,
    }
  }

  if (value === null) {
    return {
      valid: true,
      value:
        Prisma.JsonNull,
      error: undefined,
    }
  }

  if (
    !isPlainObject(value)
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        "config must be an object or null.",
    }
  }

  try {
    const serialized =
      JSON.stringify(value)

    if (
      serialized.length >
      50_000
    ) {
      return {
        valid: false,
        value: undefined,
        error:
          "config cannot exceed 50000 characters.",
      }
    }

    const parsed =
      JSON.parse(serialized)

    return {
      valid: true,
      value:
        parsed as Prisma.InputJsonValue,
      error: undefined,
    }
  } catch {
    return {
      valid: false,
      value: undefined,
      error:
        "config contains invalid JSON data.",
    }
  }
}

function parseBody(
  body: unknown,
):
  | {
      valid: true
      payload: ToolPayload
      error?: undefined
    }
  | {
      valid: false
      payload: null
      error: string
    } {
  if (
    !isPlainObject(body)
  ) {
    return {
      valid: false,
      payload: null,
      error:
        "Request body must be an object.",
    }
  }

  return {
    valid: true,
    payload:
      body as ToolPayload,
  }
}

/**
 * ============================================================
 * TOOL SELECT
 * ============================================================
 */

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
} as const

/**
 * ============================================================
 * GET /api/ai/tools
 * ============================================================
 *
 * List tools assigned to an AI agent.
 *
 * Supported:
 *
 * /api/ai/tools?agentId=...
 * /api/ai/tools?agentId=...&enabled=true
 * /api/ai/tools?id=...
 * ============================================================
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

    const toolId =
      searchParams
        .get("id")
        ?.trim() || ""

    const agentId =
      searchParams
        .get("agentId")
        ?.trim() || ""

    const enabledParam =
      searchParams
        .get("enabled")
        ?.trim()
        .toLowerCase() || ""

    let enabled:
      | boolean
      | undefined

    if (
      enabledParam
    ) {
      if (
        enabledParam ===
        "true"
      ) {
        enabled = true
      } else if (
        enabledParam ===
        "false"
      ) {
        enabled = false
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              'enabled must be "true" or "false".',
          },
          {
            status: 400,
          },
        )
      }
    }

    /**
     * Single tool lookup.
     */
    if (toolId) {
      const tool =
        await prisma.aiAgentTool.findFirst(
          {
            where: {
              id: toolId,

              agent: {
                orgId,
              },
            },

            select:
              toolSelect,
          },
        )

      if (!tool) {
        return NextResponse.json(
          {
            success: false,
            error:
              "AI tool not found.",
          },
          {
            status: 404,
          },
        )
      }

      return NextResponse.json({
        success: true,
        tool,
      })
    }

    /**
     * Agent is required for a collection.
     */
    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "agentId is required when listing tools.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Verify the agent belongs to this organization.
     */
    const agent =
      await prisma.aiAgent.findFirst({
        where: {
          id: agentId,
          orgId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })

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

          orderBy: [
            {
              enabled:
                "desc",
            },
            {
              name:
                "asc",
            },
          ],

          select:
            toolSelect,
        },
      )

    return NextResponse.json({
      success: true,
      agent,
      tools,
      count: tools.length,
      toolTypes:
        AI_TOOL_TYPES,
    })
  } catch (error) {
    console.error(
      "[AI_TOOLS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI tools.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * ============================================================
 * POST /api/ai/tools
 * ============================================================
 *
 * Assign a tool to an AI agent.
 *
 * Body:
 *
 * {
 *   "agentId": "...",
 *   "name": "customer_lookup",
 *   "description": "Look up CRM customer information",
 *   "type": "crm_read",
 *   "enabled": true,
 *   "requiresApproval": true,
 *   "config": {}
 * }
 * ============================================================
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

    let body: unknown

    try {
      body =
        await request.json()
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

    const parsed =
      parseBody(body)

    if (!parsed.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error,
        },
        {
          status: 400,
        },
      )
    }

    const payload =
      parsed.payload

    /**
     * Agent ID.
     */
    if (
      typeof payload.agentId !==
        "string" ||
      !payload.agentId.trim()
    ) {
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

    const agentId =
      payload.agentId.trim()

    /**
     * Name.
     */
    const nameResult =
      normalizeText(
        payload.name,
        "Name",
        120,
        {
          required: true,
        },
      )

    if (
      !nameResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            nameResult.error,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Description.
     */
    const descriptionResult =
      normalizeText(
        payload.description,
        "Description",
        2_000,
        {
          required: true,
        },
      )

    if (
      !descriptionResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            descriptionResult.error,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Tool type.
     */
    const typeResult =
      normalizeToolType(
        payload.type,
        true,
      )

    if (
      !typeResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            typeResult.error,
          allowedTypes:
            AI_TOOL_TYPES,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Enabled.
     */
    const enabledResult =
      normalizeBoolean(
        payload.enabled,
        "enabled",
      )

    if (
      !enabledResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            enabledResult.error,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Approval.
     */
    const approvalResult =
      normalizeBoolean(
        payload.requiresApproval,
        "requiresApproval",
      )

    if (
      !approvalResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            approvalResult.error,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Config.
     */
    const configResult =
      normalizeConfig(
        payload.config,
      )

    if (
      !configResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            configResult.error,
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Verify agent ownership.
     */
    const agent =
      await prisma.aiAgent.findFirst({
        where: {
          id: agentId,
          orgId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          canAct: true,
          requiresApproval: true,
        },
      })

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

    const requiresApproval =
      approvalResult.value ??
      true

    /**
     * An action-capable agent must not have
     * an action tool with approval disabled.
     *
     * Read-only tools may safely operate without
     * action approval.
     */
    if (
      agent.canAct &&
      !requiresApproval &&
      typeResult.value ===
        "crm_write"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "CRM write tools must require approval for action-capable agents.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Prevent duplicate tool names for this agent.
     */
    const existingTool =
      await prisma.aiAgentTool.findFirst(
        {
          where: {
            agentId,
            name:
              nameResult.value as string,
          },
          select: {
            id: true,
          },
        },
      )

    if (existingTool) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A tool with this name is already assigned to this agent.",
        },
        {
          status: 409,
        },
      )
    }

    const tool =
      await prisma.aiAgentTool.create(
        {
          data: {
            agentId,

            name:
              nameResult.value as string,

            description:
              descriptionResult.value as string,

            type:
              typeResult.value as any,

            enabled:
              enabledResult.value ??
              true,

            requiresApproval,

            ...(configResult.value !==
            undefined
              ? {
                  config:
                    configResult.value,
                }
              : {}),
          },

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
    console.error(
      "[AI_TOOLS_POST]",
      error,
    )

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A tool with this name is already assigned to this agent.",
        },
        {
          status: 409,
        },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create AI tool.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * ============================================================
 * PATCH /api/ai/tools
 * ============================================================
 *
 * Update an assigned tool.
 *
 * Body:
 *
 * {
 *   "id": "...",
 *   "name": "...",
 *   "enabled": true
 * }
 * ============================================================
 */

export async function PATCH(
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

    let body: unknown

    try {
      body =
        await request.json()
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

    const parsed =
      parseBody(body)

    if (!parsed.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            parsed.error,
        },
        {
          status: 400,
        },
      )
    }

    const payload =
      parsed.payload

    if (
      typeof payload.id !==
        "string" ||
      !payload.id.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tool ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    const toolId =
      payload.id.trim()

    /**
     * Load tool and verify that its agent
     * belongs to this organization.
     */
    const existingTool =
      await prisma.aiAgentTool.findFirst(
        {
          where: {
            id: toolId,

            agent: {
              orgId,
            },
          },

          select: {
            id: true,
            agentId: true,
            name: true,
            description: true,
            type: true,
            enabled: true,
            requiresApproval: true,
          },
        },
      )

    if (!existingTool) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI tool not found.",
        },
        {
          status: 404,
        },
      )
    }

    const data: Prisma.AiAgentToolUpdateInput =
      {}

    /**
     * Name.
     */
    if (
      payload.name !==
      undefined
    ) {
      const result =
        normalizeText(
          payload.name,
          "Name",
          120,
          {
            required: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
          },
          {
            status: 400,
          },
        )
      }

      const duplicate =
        await prisma.aiAgentTool.findFirst(
          {
            where: {
              agentId:
                existingTool.agentId,

              name:
                result.value as string,

              NOT: {
                id: toolId,
              },
            },

            select: {
              id: true,
            },
          },
        )

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error:
              "A tool with this name is already assigned to this agent.",
          },
          {
            status: 409,
          },
        )
      }

      data.name =
        result.value as string
    }

    /**
     * Description.
     */
    if (
      payload.description !==
      undefined
    ) {
      const result =
        normalizeText(
          payload.description,
          "Description",
          2_000,
          {
            required: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
          },
          {
            status: 400,
          },
        )
      }

      data.description =
        result.value as string
    }

    /**
     * Type.
     */
    let finalType:
      | AiToolType
      | undefined

    if (
      payload.type !==
      undefined
    ) {
      const result =
        normalizeToolType(
          payload.type,
          true,
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
            allowedTypes:
              AI_TOOL_TYPES,
          },
          {
            status: 400,
          },
        )
      }

      finalType =
        result.value

      data.type =
        result.value as any
    }

    /**
     * Enabled.
     */
    if (
      payload.enabled !==
      undefined
    ) {
      const result =
        normalizeBoolean(
          payload.enabled,
          "enabled",
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
          },
          {
            status: 400,
          },
        )
      }

      data.enabled =
        result.value as boolean
    }

    /**
     * Approval.
     */
    let finalRequiresApproval:
      | boolean
      | undefined

    if (
      payload.requiresApproval !==
      undefined
    ) {
      const result =
        normalizeBoolean(
          payload.requiresApproval,
          "requiresApproval",
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
          },
          {
            status: 400,
          },
        )
      }

      finalRequiresApproval =
        result.value

      data.requiresApproval =
        result.value as boolean
    }

    /**
     * Config.
     */
    if (
      payload.config !==
      undefined
    ) {
      const result =
        normalizeConfig(
          payload.config,
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error,
          },
          {
            status: 400,
          },
        )
      }

      data.config =
        result.value
    }

    /**
     * Load the parent agent's action settings
     * to validate the FINAL tool configuration.
     */
    if (
      finalType ===
        undefined ||
      finalRequiresApproval ===
        undefined
    ) {
      if (
        payload.type !==
          undefined ||
        payload.requiresApproval !==
          undefined
      ) {
        const agent =
          await prisma.aiAgent.findFirst(
            {
              where: {
                id:
                  existingTool.agentId,
                orgId,
              },
              select: {
                canAct: true,
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

        finalType =
          finalType ??
          (existingTool.type as AiToolType)

        finalRequiresApproval =
          finalRequiresApproval ??
          existingTool.requiresApproval

        /**
         * CRM write tools on action-capable
         * agents must require approval.
         */
        if (
          agent.canAct &&
          !finalRequiresApproval &&
          finalType ===
            "crm_write"
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "CRM write tools must require approval for action-capable agents.",
            },
            {
              status: 400,
            },
          )
        }
      }
    } else {
      /**
       * Both values were supplied.
       *
       * Still need the agent's canAct state.
       */
      const agent =
        await prisma.aiAgent.findFirst(
          {
            where: {
              id:
                existingTool.agentId,
              orgId,
            },
            select: {
              canAct: true,
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
        agent.canAct &&
        !finalRequiresApproval &&
        finalType ===
          "crm_write"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "CRM write tools must require approval for action-capable agents.",
          },
          {
            status: 400,
          },
        )
      }
    }

    if (
      Object.keys(data).length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No valid tool fields were provided.",
        },
        {
          status: 400,
        },
      )
    }

    const tool =
      await prisma.aiAgentTool.update(
        {
          where: {
            id: toolId,
          },

          data,

          select:
            toolSelect,
        },
      )

    return NextResponse.json({
      success: true,
      tool,
    })
  } catch (error) {
    console.error(
      "[AI_TOOLS_PATCH]",
      error,
    )

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A tool with this name is already assigned to this agent.",
        },
        {
          status: 409,
        },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI tool.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * ============================================================
 * DELETE /api/ai/tools
 * ============================================================
 *
 * Remove an assigned tool from an agent.
 *
 * Supports:
 *
 * DELETE /api/ai/tools?id=toolId
 *
 * or:
 *
 * {
 *   "id": "toolId"
 * }
 * ============================================================
 */

export async function DELETE(
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

    let toolId =
      searchParams
        .get("id")
        ?.trim() || ""

    /**
     * Also accept a JSON body.
     */
    if (!toolId) {
      try {
        const body =
          await request.json()

        if (
          isPlainObject(body) &&
          typeof body.id ===
            "string"
        ) {
          toolId =
            body.id.trim()
        }
      } catch {
        /*
         * Missing body is handled below.
         */
      }
    }

    if (!toolId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tool ID is required.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Verify ownership through the parent agent.
     */
    const tool =
      await prisma.aiAgentTool.findFirst(
        {
          where: {
            id: toolId,

            agent: {
              orgId,
            },
          },

          select: {
            id: true,
            agentId: true,
            name: true,
          },
        },
      )

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI tool not found.",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.aiAgentTool.delete(
      {
        where: {
          id: tool.id,
        },
      },
    )

    return NextResponse.json({
      success: true,
      deleted: true,
      toolId: tool.id,
    })
  } catch (error) {
    console.error(
      "[AI_TOOLS_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete AI tool.",
      },
      {
        status: 500,
      },
    )
  }
}