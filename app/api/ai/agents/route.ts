import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { Prisma } from "@prisma/client"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type AgentStatus =
  | "draft"
  | "active"
  | "inactive"

type AgentPayload = {
  id?: unknown
  name?: unknown
  slug?: unknown
  description?: unknown
  instructions?: unknown
  model?: unknown
  status?: unknown
  temperature?: unknown
  maxTokens?: unknown
  requiresApproval?: unknown
  canAct?: unknown
  config?: unknown
}

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
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
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

  if (value === undefined) {
    return {
      valid: !required,
      value: undefined as
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

  if (typeof value !== "string") {
    return {
      valid: false,
      value: undefined,
      error: `${field} must be a string.`,
    }
  }

  const normalized = value.trim()

  if (!normalized) {
    if (required) {
      return {
        valid: false,
        value: undefined,
        error: `${field} is required.`,
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

  if (normalized.length > maxLength) {
    return {
      valid: false,
      value: undefined,
      error: `${field} cannot exceed ${maxLength} characters.`,
    }
  }

  return {
    valid: true,
    value: normalized,
    error: undefined,
  }
}

function normalizeSlug(
  value: unknown,
  required = false,
) {
  if (value === undefined) {
    return {
      valid: !required,
      value: undefined as
        | string
        | undefined,
      error: required
        ? "Slug is required."
        : undefined,
    }
  }

  if (typeof value !== "string") {
    return {
      valid: false,
      value: undefined,
      error: "Slug must be a string.",
    }
  }

  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)

  if (!slug) {
    return {
      valid: false,
      value: undefined,
      error: "Slug is required.",
    }
  }

  return {
    valid: true,
    value: slug,
    error: undefined,
  }
}

function normalizeStatus(
  value: unknown,
  required = false,
) {
  if (value === undefined) {
    return {
      valid: !required,
      value: undefined as
        | AgentStatus
        | undefined,
      error: required
        ? "Status is required."
        : undefined,
    }
  }

  if (
    value !== "draft" &&
    value !== "active" &&
    value !== "inactive"
  ) {
    return {
      valid: false,
      value: undefined,
      error:
        'Status must be "draft", "active", or "inactive".',
    }
  }

  return {
    valid: true,
    value: value as AgentStatus,
    error: undefined,
  }
}

function normalizeNumber(
  value: unknown,
  field: string,
  options?: {
    integer?: boolean
    min?: number
    max?: number
    nullable?: boolean
  },
) {
  const nullable =
    options?.nullable ?? false

  if (value === undefined) {
    return {
      valid: true,
      value: undefined as
        | number
        | null
        | undefined,
      error: undefined,
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
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return {
      valid: false,
      value: undefined,
      error: `${field} must be a valid number.`,
    }
  }

  if (
    options?.integer &&
    !Number.isInteger(value)
  ) {
    return {
      valid: false,
      value: undefined,
      error: `${field} must be an integer.`,
    }
  }

  if (
    options?.min !== undefined &&
    value < options.min
  ) {
    return {
      valid: false,
      value: undefined,
      error: `${field} must be at least ${options.min}.`,
    }
  }

  if (
    options?.max !== undefined &&
    value > options.max
  ) {
    return {
      valid: false,
      value: undefined,
      error: `${field} cannot exceed ${options.max}.`,
    }
  }

  return {
    valid: true,
    value,
    error: undefined,
  }
}

function normalizeBoolean(
  value: unknown,
  field: string,
) {
  if (value === undefined) {
    return {
      valid: true,
      value: undefined as
        | boolean
        | undefined,
      error: undefined,
    }
  }

  if (typeof value !== "boolean") {
    return {
      valid: false,
      value: undefined,
      error: `${field} must be a boolean.`,
    }
  }

  return {
    valid: true,
    value,
    error: undefined,
  }
}

function normalizeConfig(
  value: unknown,
) {
  if (value === undefined) {
    return {
      valid: true,
      value: undefined as
        | Prisma.InputJsonValue
        | undefined,
      error: undefined,
    }
  }

  if (value === null) {
    return {
      valid: true,
      value: Prisma.JsonNull,
      error: undefined,
    }
  }

  if (!isPlainObject(value)) {
    return {
      valid: false,
      value: undefined,
      error:
        "config must be an object or null.",
    }
  }

  try {
    /*
     * JSON serialization also guarantees that
     * undefined/function/symbol values are not
     * accidentally persisted.
     */
    const serialized =
      JSON.stringify(value)

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
      payload: AgentPayload
      error?: undefined
    }
  | {
      valid: false
      payload: null
      error: string
    } {
  if (!isPlainObject(body)) {
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
      body as AgentPayload,
  }
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
      createdAt: "asc",
    },

    select: {
      id: true,
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
} as const

/**
 * GET /api/ai/agents
 *
 * List the authenticated organization's AI agents.
 *
 * Optional:
 *
 * ?id=agentId
 * ?status=active
 * ?limit=50
 */
export async function GET(
  request: Request,
) {
  try {
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

    const { userId, orgId } =
      getSessionContext(session)

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

    const { searchParams } =
      new URL(request.url)

    const agentId =
      searchParams.get("id")?.trim() ||
      null

    const statusParam =
      searchParams
        .get("status")
        ?.trim()
        .toLowerCase() || null

    const status =
      statusParam === "draft" ||
      statusParam === "active" ||
      statusParam === "inactive"
        ? (statusParam as AgentStatus)
        : null

    if (
      statusParam &&
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid status. Use "draft", "active", or "inactive".',
        },
        { status: 400 },
      )
    }

    const rawLimit =
      Number.parseInt(
        searchParams.get("limit") ||
          "50",
        10,
      )

    const limit =
      Number.isFinite(rawLimit)
        ? Math.min(
            Math.max(rawLimit, 1),
            100,
          )
        : 50

    /*
     * Load one agent.
     */
    if (agentId) {
      const agent =
        await prisma.aiAgent.findFirst({
          where: {
            id: agentId,
            orgId,
          },
          select: agentSelect,
        })

      if (!agent) {
        return NextResponse.json(
          {
            success: false,
            error:
              "AI agent not found.",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        agent,
      })
    }

    /*
     * Load organization agents.
     */
    const agents =
      await prisma.aiAgent.findMany({
        where: {
          orgId,

          ...(status
            ? {
                status,
              }
            : {}),
        },

        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        take: limit,

        select: agentSelect,
      })

    return NextResponse.json({
      success: true,
      agents,
      count: agents.length,
    })
  } catch (error) {
    console.error(
      "[AI_AGENTS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI agents.",
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/ai/agents
 *
 * Creates an organization AI agent.
 */
export async function POST(
  request: Request,
) {
  try {
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

    const { userId, orgId } =
      getSessionContext(session)

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

    const parsed =
      parseBody(body)

    if (!parsed.valid) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error,
        },
        { status: 400 },
      )
    }

    const payload =
      parsed.payload

    /*
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

    if (!nameResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: nameResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Slug.
     *
     * If omitted, generate it from the name.
     */
    const generatedSlug =
      typeof nameResult.value ===
      "string"
        ? nameResult.value
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-",
            )
            .replace(
              /^-+|-+$/g,
              "",
            )
        : ""

    const slugInput =
      payload.slug ??
      generatedSlug

    const slugResult =
      normalizeSlug(
        slugInput,
        true,
      )

    if (!slugResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: slugResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Instructions.
     */
    const instructionsResult =
      normalizeText(
        payload.instructions,
        "Instructions",
        20_000,
        {
          required: true,
        },
      )

    if (
      !instructionsResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            instructionsResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Optional fields.
     */
    const descriptionResult =
      normalizeText(
        payload.description,
        "Description",
        2_000,
        {
          nullable: true,
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
        { status: 400 },
      )
    }

    const modelResult =
      normalizeText(
        payload.model,
        "Model",
        100,
        {
          nullable: true,
        },
      )

    if (!modelResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            modelResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Status.
     */
    const statusResult =
      normalizeStatus(
        payload.status,
      )

    if (!statusResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: statusResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Temperature.
     *
     * We keep this conservative because the
     * Responses API configuration should remain
     * controlled by the application.
     */
    const temperatureResult =
      normalizeNumber(
        payload.temperature,
        "Temperature",
        {
          min: 0,
          max: 2,
        },
      )

    if (
      !temperatureResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            temperatureResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Max output tokens.
     */
    const maxTokensResult =
      normalizeNumber(
        payload.maxTokens,
        "maxTokens",
        {
          integer: true,
          min: 1,
          max: 100_000,
        },
      )

    if (
      !maxTokensResult.valid
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            maxTokensResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Permission flags.
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
        { status: 400 },
      )
    }

    const canActResult =
      normalizeBoolean(
        payload.canAct,
        "canAct",
      )

    if (!canActResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            canActResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Safety:
     *
     * An agent cannot be configured to act
     * without approval unless the application
     * explicitly changes this policy later.
     *
     * For now, canAct=true always retains
     * requiresApproval=true by default.
     */
    const canAct =
      canActResult.value ?? false

    const requiresApproval =
      approvalResult.value ??
      true

    /*
     * Advanced JSON config.
     */
    const configResult =
      normalizeConfig(
        payload.config,
      )

    if (!configResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error:
            configResult.error,
        },
        { status: 400 },
      )
    }

    /*
     * Verify organization exists.
     */
    const organization =
      await prisma.organization.findUnique({
        where: {
          id: orgId,
        },
        select: {
          id: true,
        },
      })

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Organization not found.",
        },
        { status: 404 },
      )
    }

    /*
     * Ensure slug is unique within this organization.
     */
    const existingAgent =
      await prisma.aiAgent.findFirst({
        where: {
          orgId,
          slug: slugResult.value,
        },
        select: {
          id: true,
        },
      })

    if (existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "An AI agent with this slug already exists.",
        },
        { status: 409 },
      )
    }

    /*
     * Create the agent.
     */
    const agent =
      await prisma.aiAgent.create({
        data: {
          orgId,

          name:
            nameResult.value as string,

          slug:
            slugResult.value as string,

          description:
            descriptionResult.value ??
            null,

          instructions:
            instructionsResult.value as string,

          model:
            modelResult.value ??
            null,

          status:
            statusResult.value ??
            "draft",

          temperature:
            temperatureResult.value ??
            null,

          maxTokens:
            maxTokensResult.value ??
            null,

          requiresApproval,

          canAct,

          ...(configResult.value !==
          undefined
            ? {
                config:
                  configResult.value,
              }
            : {}),

          createdById:
            userId,
        },

        select: agentSelect,
      })

    return NextResponse.json(
      {
        success: true,
        agent,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error(
      "[AI_AGENTS_POST]",
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
            "An AI agent with this slug already exists.",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create AI agent.",
      },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/ai/agents
 *
 * Updates an existing organization AI agent.
 *
 * Body must contain:
 *
 * {
 *   "id": "...",
 *   ...
 * }
 */
export async function PATCH(
  request: Request,
) {
  try {
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

    const { userId, orgId } =
      getSessionContext(session)

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

    const parsed =
      parseBody(body)

    if (!parsed.valid) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error,
        },
        { status: 400 },
      )
    }

    const payload =
      parsed.payload

    if (
      typeof payload.id !== "string" ||
      !payload.id.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        { status: 400 },
      )
    }

    const agentId =
      payload.id.trim()

    /*
     * Verify ownership before updating.
     *
     * We also load the current security settings
     * because PATCH requests may update only one
     * of canAct / requiresApproval.
     */
    const existingAgent =
      await prisma.aiAgent.findFirst({
        where: {
          id: agentId,
          orgId,
        },
        select: {
          id: true,
          canAct: true,
          requiresApproval: true,
        },
      })

    if (!existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        { status: 404 },
      )
    }

    const data: Prisma.AiAgentUpdateInput =
      {}

    /*
     * Name.
     */
    if (
      payload.name !== undefined
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
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.name =
        result.value as string
    }

    /*
     * Slug.
     */
    if (
      payload.slug !== undefined
    ) {
      const result =
        normalizeSlug(
          payload.slug,
          true,
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      const duplicate =
        await prisma.aiAgent.findFirst({
          where: {
            orgId,
            slug: result.value,
            NOT: {
              id: agentId,
            },
          },
          select: {
            id: true,
          },
        })

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error:
              "An AI agent with this slug already exists.",
          },
          { status: 409 },
        )
      }

      data.slug =
        result.value as string
    }

    /*
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
            nullable: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.description =
        result.value ?? null
    }

    /*
     * Instructions.
     */
    if (
      payload.instructions !==
      undefined
    ) {
      const result =
        normalizeText(
          payload.instructions,
          "Instructions",
          20_000,
          {
            required: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.instructions =
        result.value as string
    }

    /*
     * Model.
     */
    if (
      payload.model !== undefined
    ) {
      const result =
        normalizeText(
          payload.model,
          "Model",
          100,
          {
            nullable: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.model =
        result.value ?? null
    }

    /*
     * Status.
     */
    if (
      payload.status !== undefined
    ) {
      const result =
        normalizeStatus(
          payload.status,
          true,
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.status =
        result.value as AgentStatus
    }

    /*
     * Temperature.
     */
    if (
      payload.temperature !==
      undefined
    ) {
      const result =
        normalizeNumber(
          payload.temperature,
          "Temperature",
          {
            min: 0,
            max: 2,
            nullable: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.temperature =
        result.value ?? null
    }

    /*
     * Max tokens.
     */
    if (
      payload.maxTokens !==
      undefined
    ) {
      const result =
        normalizeNumber(
          payload.maxTokens,
          "maxTokens",
          {
            integer: true,
            min: 1,
            max: 100_000,
            nullable: true,
          },
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.maxTokens =
        result.value ?? null
    }

    /*
     * Approval.
     */
    let requestedRequiresApproval:
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
            error: result.error,
          },
          { status: 400 },
        )
      }

      requestedRequiresApproval =
        result.value

      data.requiresApproval =
        result.value as boolean
    }

    /*
     * Can act.
     */
    let requestedCanAct:
      | boolean
      | undefined

    if (
      payload.canAct !== undefined
    ) {
      const result =
        normalizeBoolean(
          payload.canAct,
          "canAct",
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      requestedCanAct =
        result.value

      data.canAct =
        result.value as boolean
    }

    /*
     * FINAL SECURITY STATE
     *
     * PATCH may contain only one of the two
     * security fields, so validate the resulting
     * state using both the requested values and
     * the existing database values.
     *
     * Allowed:
     *
     * canAct=false  + requiresApproval=false
     * canAct=false  + requiresApproval=true
     * canAct=true   + requiresApproval=true
     *
     * Forbidden:
     *
     * canAct=true   + requiresApproval=false
     */
    const finalCanAct =
      requestedCanAct !== undefined
        ? requestedCanAct
        : existingAgent.canAct

    const finalRequiresApproval =
      requestedRequiresApproval !==
      undefined
        ? requestedRequiresApproval
        : existingAgent.requiresApproval

    if (
      finalCanAct &&
      !finalRequiresApproval
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agents that can act must require approval.",
        },
        { status: 400 },
      )
    }

    /*
     * Advanced config.
     */
    if (
      payload.config !== undefined
    ) {
      const result =
        normalizeConfig(
          payload.config,
        )

      if (!result.valid) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
          },
          { status: 400 },
        )
      }

      data.config =
        result.value
    }

    /*
     * Make sure at least one field is
     * actually being updated.
     */
    if (
      Object.keys(data).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No valid agent fields were provided.",
        },
        { status: 400 },
      )
    }

    /*
     * Update only after:
     *
     * 1. Authentication
     * 2. Organization validation
     * 3. Agent ownership validation
     * 4. Field validation
     * 5. Slug uniqueness validation
     * 6. Final security-state validation
     */
    const agent =
      await prisma.aiAgent.update({
        where: {
          id: agentId,
        },

        data,

        select: agentSelect,
      })

    return NextResponse.json({
      success: true,
      agent,
    })
  } catch (error) {
    console.error(
      "[AI_AGENTS_PATCH]",
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
            "An AI agent with this slug already exists.",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI agent.",
      },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/ai/agents?id=agentId
 *
 * Permanently deletes an organization AI agent.
 *
 * AiAgentTool records are deleted automatically
 * because the schema uses onDelete: Cascade.
 */
export async function DELETE(
  request: Request,
) {
  try {
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

    const { userId, orgId } =
      getSessionContext(session)

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

    const { searchParams } =
      new URL(request.url)

    let agentId =
      searchParams
        .get("id")
        ?.trim() || ""

    /*
     * Also support:
     *
     * DELETE body:
     * {
     *   "id": "..."
     * }
     */
    if (!agentId) {
      try {
        const body =
          await request.json()

        if (
          isPlainObject(body) &&
          typeof body.id === "string"
        ) {
          agentId =
            body.id.trim()
        }
      } catch {
        /*
         * No body is acceptable here.
         * We handle the missing ID below.
         */
      }
    }

    if (!agentId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Agent ID is required.",
        },
        { status: 400 },
      )
    }

    /*
     * Strict organization ownership check.
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
        },
      })

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI agent not found.",
        },
        { status: 404 },
      )
    }

    await prisma.aiAgent.delete({
      where: {
        id: agent.id,
      },
    })

    return NextResponse.json({
      success: true,
      deleted: true,
      agentId: agent.id,
    })
  } catch (error) {
    console.error(
      "[AI_AGENTS_DELETE]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to delete AI agent.",
      },
      { status: 500 },
    )
  }
}