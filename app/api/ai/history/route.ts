import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
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

function parsePositiveInt(
  value: string | null,
  fallback: number,
  max: number,
) {
  const parsed =
    Number.parseInt(
      value ?? "",
      10,
    )

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return fallback
  }

  return Math.min(
    parsed,
    max,
  )
}

function parseDays(
  value: string | null,
) {
  if (!value) {
    return 30
  }

  const parsed =
    Number.parseInt(
      value,
      10,
    )

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return 30
  }

  return Math.min(
    parsed,
    365,
  )
}

function toNumber(
  value: unknown,
) {
  if (
    typeof value === "number"
  ) {
    return Number.isFinite(value)
      ? value
      : 0
  }

  if (
    typeof value === "string"
  ) {
    const parsed =
      Number(value)

    return Number.isFinite(parsed)
      ? parsed
      : 0
  }

  if (
    value &&
    typeof value === "object" &&
    "toString" in value
  ) {
    const parsed =
      Number(
        String(value),
      )

    return Number.isFinite(parsed)
      ? parsed
      : 0
  }

  return 0
}

/**
 * GET /api/ai/history
 *
 * Returns AI usage/activity history for the
 * authenticated organization.
 *
 * Query parameters:
 *
 *   ?page=1
 *   ?limit=25
 *   ?days=30
 *   ?feature=chat
 *   ?model=gpt-5.6-luna
 *   ?userId=...
 *
 * Security:
 * - orgId always comes from the session.
 * - Optional userId is verified against the
 *   authenticated organization.
 * - No client-supplied orgId is trusted.
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

    const page =
      parsePositiveInt(
        searchParams.get(
          "page",
        ),
        1,
        1000000,
      )

    const limit =
      parsePositiveInt(
        searchParams.get(
          "limit",
        ),
        25,
        100,
      )

    const days =
      parseDays(
        searchParams.get(
          "days",
        ),
      )

    const feature =
      searchParams
        .get("feature")
        ?.trim() || ""

    const model =
      searchParams
        .get("model")
        ?.trim() || ""

    const requestedUserId =
      searchParams
        .get("userId")
        ?.trim() || ""

    /**
     * If a userId filter was supplied, make sure
     * that user actually belongs to this org.
     */
    let scopedUserId:
      | string
      | undefined

    if (requestedUserId) {
      const organizationUser =
        await prisma.user.findFirst(
          {
            where: {
              id:
                requestedUserId,
              orgId,
            },

            select: {
              id: true,
            },
          },
        )

      if (!organizationUser) {
        return NextResponse.json(
          {
            success: false,
            error:
              "User not found in this organization.",
          },
          {
            status: 404,
          },
        )
      }

      scopedUserId =
        organizationUser.id
    }

    /**
     * Use UTC for a predictable API date range.
     *
     * createdAt >= startDate
     */
    const startDate =
      new Date()

    startDate.setUTCDate(
      startDate.getUTCDate() -
        days,
    )

    const where = {
      orgId,

      createdAt: {
        gte: startDate,
      },

      ...(feature
        ? {
            feature,
          }
        : {}),

      ...(model
        ? {
            model,
          }
        : {}),

      ...(scopedUserId
        ? {
            userId:
              scopedUserId,
          }
        : {}),
    }

    /**
     * Run count and page query together.
     */
    const [
      total,
      records,
    ] =
      await Promise.all([
        prisma.aiUsage.count({
          where,
        }),

        prisma.aiUsage.findMany({
          where,

          orderBy: {
            createdAt:
              "desc",
          },

          skip:
            (page - 1) *
            limit,

          take: limit,

          select: {
            id: true,
            orgId: true,
            userId: true,
            feature: true,
            model: true,
            inputTokens: true,
            outputTokens: true,
            totalTokens: true,
            estimatedCost: true,
            creditsUsed: true,
            createdAt: true,
          },
        }),
      ])

    /**
     * Convert Prisma Decimal values before
     * sending them through JSON.
     */
    const history =
      records.map(
        (record) => ({
          id: record.id,

          userId:
            record.userId,

          feature:
            record.feature,

          model:
            record.model,

          inputTokens:
            record.inputTokens ??
            0,

          outputTokens:
            record.outputTokens ??
            0,

          totalTokens:
            record.totalTokens ??
            0,

          estimatedCost:
            Number(
              toNumber(
                record.estimatedCost,
              ).toFixed(8),
            ),

          creditsUsed:
            Number(
              toNumber(
                record.creditsUsed,
              ).toFixed(4),
            ),

          createdAt:
            record.createdAt,
        }),
      )

    const totalPages =
      Math.ceil(
        total / limit,
      )

    return NextResponse.json(
      {
        success: true,

        history,

        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage:
            page <
            totalPages,
          hasPreviousPage:
            page > 1,
        },

        filters: {
          days,
          feature:
            feature || null,
          model:
            model || null,
          userId:
            scopedUserId ??
            null,
        },

        generatedAt:
          new Date().toISOString(),
      },
    )
  } catch (error) {
    console.error(
      "[AI_HISTORY_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI history.",
      },
      {
        status: 500,
      },
    )
  }
}