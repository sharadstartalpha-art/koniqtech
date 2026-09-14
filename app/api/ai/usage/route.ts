import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/shared/lib/prisma"

export const runtime = "nodejs"

type SessionUser = {
  id?: string
  orgId?: string | null
}

type Period = "7d" | "30d" | "90d" | "all"

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

function parsePeriod(
  value: string | null,
): Period {
  if (
    value === "7d" ||
    value === "30d" ||
    value === "90d" ||
    value === "all"
  ) {
    return value
  }

  return "30d"
}

function getStartDate(
  period: Period,
): Date | undefined {
  if (period === "all") {
    return undefined
  }

  const days =
    period === "7d"
      ? 7
      : period === "90d"
        ? 90
        : 30

  const date =
    new Date()

  date.setDate(
    date.getDate() - days,
  )

  return date
}

function toNumber(
  value: unknown,
): number {
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
 * GET /api/ai/usage
 *
 * Organization-scoped AI usage information.
 *
 * Query parameters:
 *
 *   ?period=7d
 *   ?period=30d
 *   ?period=90d
 *   ?period=all
 *
 * Optional:
 *
 *   ?userId=...
 *   ?model=...
 *   ?feature=...
 *
 * Security:
 *
 * The organization always comes from the
 * authenticated session. A browser cannot
 * supply an arbitrary organization ID.
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

    const period =
      parsePeriod(
        searchParams.get(
          "period",
        ),
      )

    const startDate =
      getStartDate(period)

    const requestedUserId =
      searchParams
        .get("userId")
        ?.trim() || ""

    const model =
      searchParams
        .get("model")
        ?.trim() || ""

    const feature =
      searchParams
        .get("feature")
        ?.trim() || ""

    /**
     * Never allow a caller to query a user
     * outside the authenticated organization.
     */
    let scopedUserId:
      | string
      | undefined

    if (requestedUserId) {
      const organizationUser =
        await prisma.user.findFirst({
          where: {
            id:
              requestedUserId,
            orgId,
          },
          select: {
            id: true,
          },
        })

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
     * Build the organization-scoped filter.
     */
    const where = {
      orgId,

      ...(startDate
        ? {
            createdAt: {
              gte: startDate,
            },
          }
        : {}),

      ...(scopedUserId
        ? {
            userId:
              scopedUserId,
          }
        : {}),

      ...(model
        ? {
            model,
          }
        : {}),

      ...(feature
        ? {
            feature,
          }
        : {}),
    }

    /**
     * Load usage records.
     *
     * We keep the individual records available
     * for recent usage/activity displays.
     */
    const usage =
      await prisma.aiUsage.findMany({
        where,

        orderBy: {
          createdAt: "desc",
        },

        take: 500,

        select: {
          id: true,
          orgId: true,
          userId: true,
          model: true,
          feature: true,
          inputTokens: true,
          outputTokens: true,
          totalTokens: true,
          estimatedCost: true,
          creditsUsed: true,
          createdAt: true,
        },
      })

    /**
     * Aggregate usage.
     */
    let inputTokens = 0
    let outputTokens = 0
    let totalTokens = 0
    let estimatedCost = 0
    let creditsUsed = 0

    for (const item of usage) {
      inputTokens +=
        item.inputTokens ?? 0

      outputTokens +=
        item.outputTokens ?? 0

      totalTokens +=
        item.totalTokens ?? 0

      estimatedCost +=
        toNumber(
          item.estimatedCost,
        )

      creditsUsed +=
        toNumber(
          item.creditsUsed,
        )
    }

    /**
     * Usage by model.
     */
    const byModel =
      new Map<
        string,
        {
          model: string
          requests: number
          inputTokens: number
          outputTokens: number
          totalTokens: number
          estimatedCost: number
          creditsUsed: number
        }
      >()

    /**
     * Usage by feature.
     */
    const byFeature =
      new Map<
        string,
        {
          feature: string
          requests: number
          inputTokens: number
          outputTokens: number
          totalTokens: number
          estimatedCost: number
          creditsUsed: number
        }
      >()

    for (const item of usage) {
      const modelName =
        item.model ||
        "unknown"

      const featureName =
        item.feature ||
        "unknown"

      const modelEntry =
        byModel.get(
          modelName,
        ) ?? {
          model:
            modelName,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          estimatedCost: 0,
          creditsUsed: 0,
        }

      modelEntry.requests += 1
      modelEntry.inputTokens +=
        item.inputTokens ?? 0
      modelEntry.outputTokens +=
        item.outputTokens ?? 0
      modelEntry.totalTokens +=
        item.totalTokens ?? 0
      modelEntry.estimatedCost +=
        toNumber(
          item.estimatedCost,
        )
      modelEntry.creditsUsed +=
        toNumber(
          item.creditsUsed,
        )

      byModel.set(
        modelName,
        modelEntry,
      )

      const featureEntry =
        byFeature.get(
          featureName,
        ) ?? {
          feature:
            featureName,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          estimatedCost: 0,
          creditsUsed: 0,
        }

      featureEntry.requests += 1
      featureEntry.inputTokens +=
        item.inputTokens ?? 0
      featureEntry.outputTokens +=
        item.outputTokens ?? 0
      featureEntry.totalTokens +=
        item.totalTokens ?? 0
      featureEntry.estimatedCost +=
        toNumber(
          item.estimatedCost,
        )
      featureEntry.creditsUsed +=
        toNumber(
          item.creditsUsed,
        )

      byFeature.set(
        featureName,
        featureEntry,
      )
    }

    /**
     * Usage by user.
     */
    const byUser =
      new Map<
        string,
        {
          userId: string
          requests: number
          inputTokens: number
          outputTokens: number
          totalTokens: number
          estimatedCost: number
          creditsUsed: number
        }
      >()

   for (const item of usage) {
  /**
   * AiUsage.userId is nullable because some
   * usage records may be generated without
   * a specific authenticated user.
   *
   * Use a stable display key for those records
   * instead of passing null into Map<string, ...>.
   */
  const usageUserId =
    item.userId ?? "unknown"

  const entry =
    byUser.get(
      usageUserId,
    ) ?? {
      userId:
        usageUserId,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      estimatedCost: 0,
      creditsUsed: 0,
    }

  entry.requests += 1

  entry.inputTokens +=
    item.inputTokens ?? 0

  entry.outputTokens +=
    item.outputTokens ?? 0

  entry.totalTokens +=
    item.totalTokens ?? 0

  entry.estimatedCost +=
    toNumber(
      item.estimatedCost,
    )

  entry.creditsUsed +=
    toNumber(
      item.creditsUsed,
    )

  byUser.set(
    usageUserId,
    entry,
  )
}
    /**
     * Recent activity.
     */
    const recentUsage =
      usage
        .slice(0, 50)
        .map(
          (item) => ({
            id: item.id,
            userId:
              item.userId,
            model:
              item.model,
            feature:
              item.feature,
            inputTokens:
              item.inputTokens ?? 0,
            outputTokens:
              item.outputTokens ?? 0,
            totalTokens:
              item.totalTokens ?? 0,
            estimatedCost:
              toNumber(
                item.estimatedCost,
              ),
            creditsUsed:
              toNumber(
                item.creditsUsed,
              ),
            createdAt:
              item.createdAt,
          }),
        )

    /**
     * Round monetary values for API output.
     */
    const roundedCost =
      Number(
        estimatedCost.toFixed(
          8,
        ),
      )

    const roundedCredits =
      Number(
        creditsUsed.toFixed(
          4,
        ),
      )

    const response = {
      success: true,

      period,

      startDate:
        startDate
          ?.toISOString() ??
        null,

      generatedAt:
        new Date().toISOString(),

      summary: {
        requests:
          usage.length,

        inputTokens,

        outputTokens,

        totalTokens,

        estimatedCost:
          roundedCost,

        creditsUsed:
          roundedCredits,
      },

      byModel:
        Array.from(
          byModel.values(),
        )
          .map(
            (item) => ({
              ...item,
              estimatedCost:
                Number(
                  item.estimatedCost.toFixed(
                    8,
                  ),
                ),
              creditsUsed:
                Number(
                  item.creditsUsed.toFixed(
                    4,
                  ),
                ),
            }),
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.totalTokens -
              a.totalTokens,
          ),

      byFeature:
        Array.from(
          byFeature.values(),
        )
          .map(
            (item) => ({
              ...item,
              estimatedCost:
                Number(
                  item.estimatedCost.toFixed(
                    8,
                  ),
                ),
              creditsUsed:
                Number(
                  item.creditsUsed.toFixed(
                    4,
                  ),
                ),
            }),
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.totalTokens -
              a.totalTokens,
          ),

      byUser:
        Array.from(
          byUser.values(),
        )
          .map(
            (item) => ({
              ...item,
              estimatedCost:
                Number(
                  item.estimatedCost.toFixed(
                    8,
                  ),
                ),
              creditsUsed:
                Number(
                  item.creditsUsed.toFixed(
                    4,
                  ),
                ),
            }),
          )
          .sort(
            (
              a,
              b,
            ) =>
              b.totalTokens -
              a.totalTokens,
          ),

      recent:
        recentUsage,
    }

    return NextResponse.json(
      response,
    )
  } catch (error) {
    console.error(
      "[AI_USAGE_GET]",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to load AI usage.",
      },
      {
        status: 500,
      },
    )
  }
}