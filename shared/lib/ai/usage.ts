import { Prisma } from "@prisma/client"
import { prisma } from "@/shared/lib/prisma"

export type RecordAiUsageInput = {
  orgId: string
  userId?: string | null
  feature: string
  model?: string | null
  inputTokens?: number | null
  outputTokens?: number | null
  totalTokens?: number | null
  estimatedCost?: number | null
  creditsUsed?: number | null
}

export type AiUsageSummary = {
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
}

function normalizeInteger(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0
  }

  return Math.max(
    0,
    Math.floor(value),
  )
}

function normalizeCost(
  value: number | null | undefined,
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0
  }

  return Math.max(
    0,
    value,
  )
}

function roundCost(
  value: number,
) {
  return Math.round(
    value * 1_000_000,
  ) / 1_000_000
}

/**
 * Records one AI usage event.
 *
 * This function is intentionally server-side
 * only. Usage must never be accepted directly
 * from an untrusted browser request.
 */
export async function recordAiUsage(
  input: RecordAiUsageInput,
) {
  const orgId =
    typeof input.orgId === "string"
      ? input.orgId.trim()
      : ""

  if (!orgId) {
    throw new Error(
      "orgId is required to record AI usage.",
    )
  }

  const feature =
    typeof input.feature === "string"
      ? input.feature.trim()
      : ""

  if (!feature) {
    throw new Error(
      "feature is required to record AI usage.",
    )
  }

  const userId =
    typeof input.userId === "string"
      ? input.userId.trim()
      : null

  const model =
  typeof input.model === "string" &&
  input.model.trim()
    ? input.model.trim()
    : process.env.OPENAI_MODEL ||
      "gpt-5.6-luna"

  const inputTokens =
    normalizeInteger(
      input.inputTokens,
    )

  const outputTokens =
    normalizeInteger(
      input.outputTokens,
    )

  const suppliedTotalTokens =
    normalizeInteger(
      input.totalTokens,
    )

  const totalTokens =
    suppliedTotalTokens > 0
      ? suppliedTotalTokens
      : inputTokens +
        outputTokens

  const estimatedCost =
    roundCost(
      normalizeCost(
        input.estimatedCost,
      ),
    )

  const creditsUsed =
    normalizeInteger(
      input.creditsUsed,
    )

  const usage =
  await prisma.aiUsage.create(
    {
  data: {
  orgId,

  ...(userId
    ? {
        userId,
      }
    : {}),

  feature,

  model,

  inputTokens,
  outputTokens,
  totalTokens,

  estimatedCost:
    new Prisma.Decimal(
      estimatedCost,
    ),

  creditsUsed,
},


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
    },
  )

  return {
    ...usage,

    estimatedCost:
      Number(
        usage.estimatedCost,
      ),
  }
}

/**
 * Converts an AI usage row into a JSON-safe
 * representation.
 */
export function serializeAiUsage(
  usage: {
    id: string
    orgId: string
    userId: string | null
    feature: string
    model: string | null
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: Prisma.Decimal | number | null
    creditsUsed: number
    createdAt: Date
  },
) {
  return {
    id: usage.id,
    orgId: usage.orgId,
    userId: usage.userId,
    feature: usage.feature,
    model: usage.model,
    inputTokens:
      usage.inputTokens,
    outputTokens:
      usage.outputTokens,
    totalTokens:
      usage.totalTokens,
    estimatedCost:
      usage.estimatedCost ===
      null
        ? 0
        : Number(
            usage.estimatedCost,
          ),
    creditsUsed:
      usage.creditsUsed,
    createdAt:
      usage.createdAt,
  }
}

/**
 * Creates an empty usage summary.
 */
export function emptyAiUsageSummary(): AiUsageSummary {
  return {
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
    creditsUsed: 0,
  }
}

/**
 * Converts aggregate Prisma values into the
 * public numeric summary shape.
 */
export function serializeAiUsageAggregate(
  aggregate: {
    _count?: {
      _all?: number
    }
    _sum?: {
      inputTokens?: number | null
      outputTokens?: number | null
      totalTokens?: number | null
      estimatedCost?:
        | Prisma.Decimal
        | number
        | null
      creditsUsed?: number | null
    }
  },
): AiUsageSummary {
  return {
    requests:
      aggregate._count?._all ??
      0,

    inputTokens:
      aggregate._sum
        ?.inputTokens ??
      0,

    outputTokens:
      aggregate._sum
        ?.outputTokens ??
      0,

    totalTokens:
      aggregate._sum
        ?.totalTokens ??
      0,

    estimatedCost:
      aggregate._sum
        ?.estimatedCost ===
        null ||
      aggregate._sum
        ?.estimatedCost ===
        undefined
        ? 0
        : Number(
            aggregate._sum
              .estimatedCost,
          ),

    creditsUsed:
      aggregate._sum
        ?.creditsUsed ??
      0,
  }
}

/**
 * Calculates the number of credits for a
 * token-based AI operation.
 *
 * The current platform uses one credit per
 * 1,000 total tokens, rounded up.
 *
 * Minimum usage is one credit for any non-zero
 * token operation.
 */
export function calculateCreditsUsed(
  totalTokens: number,
) {
  const tokens =
    normalizeInteger(
      totalTokens,
    )

  if (tokens <= 0) {
    return 0
  }

  return Math.max(
    1,
    Math.ceil(
      tokens / 1000,
    ),
  )
}

/**
 * Returns a UTC date range for the requested
 * number of previous days.
 *
 * The start is inclusive and the end is
 * exclusive.
 */
export function getAiUsageDateRange(
  days = 30,
) {
  const normalizedDays =
    Math.min(
      90,
      Math.max(
        1,
        Math.floor(
          Number.isFinite(
            days,
          )
            ? days
            : 30,
        ),
      ),
    )

  const end =
    new Date()

  const start =
    new Date(
      end.getTime() -
        normalizedDays *
          24 *
          60 *
          60 *
          1000,
    )

  return {
    start,
    end,
    days:
      normalizedDays,
  }
}