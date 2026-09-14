import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type AiSettingsUpdate = {
  aiEnabled?: boolean
  aiDefaultModel?: string | null
  aiKnowledgeEnabled?: boolean
  aiWebSearchEnabled?: boolean
  aiVoiceEnabled?: boolean
  aiCanAct?: boolean
  aiRequireApproval?: boolean
  aiMonthlyCreditLimit?: number | null
  aiMonthlySpendLimit?: number | null
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

function parseBoolean(
  value: unknown,
): boolean | undefined {
  if (typeof value === "boolean") {
    return value
  }

  return undefined
}

function parseOptionalString(
  value: unknown,
  maxLength: number,
): string | null | undefined {
  if (value === null) {
    return null
  }

  if (typeof value !== "string") {
    return undefined
  }

  const normalized =
    value.trim()

  if (!normalized) {
    return null
  }

  return normalized.slice(
    0,
    maxLength,
  )
}

function parseNonNegativeInt(
  value: unknown,
): number | null | undefined {
  if (value === null) {
    return null
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    return undefined
  }

  return value
}

function parseNonNegativeDecimal(
  value: unknown,
): number | null | undefined {
  if (value === null) {
    return null
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return undefined
  }

  return value
}

/**
 * GET /api/ai/settings
 *
 * Returns organization-level AI settings.
 *
 * The organization is always obtained from
 * the authenticated session.
 */
export async function GET() {
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

    const settings =
      await prisma.organizationSettings.findFirst(
        {
          where: {
            orgId,
          },

          select: {
            id: true,
            orgId: true,

            aiEnabled: true,
            aiDefaultModel: true,
            aiKnowledgeEnabled: true,
            aiWebSearchEnabled: true,
            aiVoiceEnabled: true,
            aiCanAct: true,
            aiRequireApproval: true,
            aiMonthlyCreditLimit: true,
            aiMonthlySpendLimit: true,
            aiSettings: true,
          },
        },
      )

    /**
     * If settings don't exist yet, return safe
     * production defaults without attempting to
     * create a record during a GET request.
     */
    if (!settings) {
      return NextResponse.json(
        {
          success: true,

          settings: {
            id: null,
            orgId,

            aiEnabled: true,
            aiDefaultModel:
              process.env.OPENAI_MODEL ??
              "gpt-5.6-luna",

            aiKnowledgeEnabled:
              true,

            aiWebSearchEnabled:
              false,

            aiVoiceEnabled:
              false,

            aiCanAct:
              false,

            aiRequireApproval:
              true,

            aiMonthlyCreditLimit:
              null,

            aiMonthlySpendLimit:
              null,

            aiSettings:
              null,
          },

          exists: false,
        },
      )
    }

    return NextResponse.json(
      {
        success: true,

        settings: {
          ...settings,

          aiMonthlySpendLimit:
            settings.aiMonthlySpendLimit !==
            null
              ? Number(
                  settings.aiMonthlySpendLimit,
                )
              : null,
        },

        exists: true,
      },
    )
  } catch (error) {
    console.error(
      "[AI_SETTINGS_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI settings.",
      },
      {
        status: 500,
      },
    )
  }
}

/**
 * PATCH /api/ai/settings
 *
 * Updates organization-level AI settings.
 *
 * Supported body:
 *
 * {
 *   "aiEnabled": true,
 *   "aiDefaultModel": "gpt-5.6-luna",
 *   "aiKnowledgeEnabled": true,
 *   "aiWebSearchEnabled": false,
 *   "aiVoiceEnabled": false,
 *   "aiCanAct": false,
 *   "aiRequireApproval": true,
 *   "aiMonthlyCreditLimit": 10000,
 *   "aiMonthlySpendLimit": 25
 * }
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

    const data: AiSettingsUpdate =
      {}

    const errors: string[] =
      []

    /**
     * Boolean settings.
     */
    const booleanFields = [
      "aiEnabled",
      "aiKnowledgeEnabled",
      "aiWebSearchEnabled",
      "aiVoiceEnabled",
      "aiCanAct",
      "aiRequireApproval",
    ] as const

    for (const field of booleanFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field,
        )
      ) {
        const value =
          parseBoolean(
            body[field],
          )

        if (
          value === undefined
        ) {
          errors.push(
            `${field} must be a boolean.`,
          )
        } else {
          data[field] =
            value
        }
      }
    }

    /**
     * Model.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "aiDefaultModel",
      )
    ) {
      const value =
        parseOptionalString(
          body.aiDefaultModel,
          100,
        )

      if (
        value === undefined
      ) {
        errors.push(
          "aiDefaultModel must be a string or null.",
        )
      } else {
        data.aiDefaultModel =
          value
      }
    }

    /**
     * Monthly credit limit.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "aiMonthlyCreditLimit",
      )
    ) {
      const value =
        parseNonNegativeInt(
          body.aiMonthlyCreditLimit,
        )

      if (
        value === undefined
      ) {
        errors.push(
          "aiMonthlyCreditLimit must be a non-negative integer or null.",
        )
      } else {
        data.aiMonthlyCreditLimit =
          value
      }
    }

    /**
     * Monthly spend limit.
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "aiMonthlySpendLimit",
      )
    ) {
      const value =
        parseNonNegativeDecimal(
          body.aiMonthlySpendLimit,
        )

      if (
        value === undefined
      ) {
        errors.push(
          "aiMonthlySpendLimit must be a non-negative number or null.",
        )
      } else {
        data.aiMonthlySpendLimit =
          value
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid AI settings.",
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
            "No supported settings were provided.",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Critical safety rule:
     *
     * AI actions must remain approval-protected
     * unless the organization explicitly disables
     * AI actions entirely.
     *
     * We do NOT silently turn approval off.
     */
    if (
      data.aiCanAct === true &&
      data.aiRequireApproval === false
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI actions must require approval.",
          code:
            "AI_APPROVAL_REQUIRED",
        },
        {
          status: 400,
        },
      )
    }

    /**
     * Update existing settings or create the
     * organization's AI settings record.
     *
     * We intentionally use findFirst rather than
     * assuming orgId has a unique Prisma constraint.
     */
    const existing =
      await prisma.organizationSettings.findFirst(
        {
          where: {
            orgId,
          },

          select: {
            id: true,
          },
        },
      )

    const settings =
      existing
        ? await prisma.organizationSettings.update(
            {
              where: {
                id:
                  existing.id,
              },

              data:
                data as any,

              select: {
                id: true,
                orgId: true,

                aiEnabled: true,
                aiDefaultModel: true,
                aiKnowledgeEnabled: true,
                aiWebSearchEnabled: true,
                aiVoiceEnabled: true,
                aiCanAct: true,
                aiRequireApproval: true,
                aiMonthlyCreditLimit: true,
                aiMonthlySpendLimit: true,
                aiSettings: true,
              },
            },
          )
        : await prisma.organizationSettings.create(
            {
              data: {
                orgId,

                aiEnabled:
                  data.aiEnabled ??
                  true,

                aiDefaultModel:
                  data.aiDefaultModel ??
                  process.env.OPENAI_MODEL ??
                  "gpt-5.6-luna",

                aiKnowledgeEnabled:
                  data.aiKnowledgeEnabled ??
                  true,

                aiWebSearchEnabled:
                  data.aiWebSearchEnabled ??
                  false,

                aiVoiceEnabled:
                  data.aiVoiceEnabled ??
                  false,

                aiCanAct:
                  data.aiCanAct ??
                  false,

                aiRequireApproval:
                  data.aiRequireApproval ??
                  true,

                aiMonthlyCreditLimit:
                  data.aiMonthlyCreditLimit ??
                  null,

                aiMonthlySpendLimit:
                  data.aiMonthlySpendLimit ??
                  null,
              },

              select: {
                id: true,
                orgId: true,

                aiEnabled: true,
                aiDefaultModel: true,
                aiKnowledgeEnabled: true,
                aiWebSearchEnabled: true,
                aiVoiceEnabled: true,
                aiCanAct: true,
                aiRequireApproval: true,
                aiMonthlyCreditLimit: true,
                aiMonthlySpendLimit: true,
                aiSettings: true,
              },
            },
          )

    return NextResponse.json(
      {
        success: true,

        settings: {
          ...settings,

          aiMonthlySpendLimit:
            settings.aiMonthlySpendLimit !==
            null
              ? Number(
                  settings.aiMonthlySpendLimit,
                )
              : null,
        },
      },
    )
  } catch (error) {
    console.error(
      "[AI_SETTINGS_PATCH]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to update AI settings.",
      },
      {
        status: 500,
      },
    )
  }
}