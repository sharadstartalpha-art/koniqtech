import prisma from "@/shared/lib/prisma"

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type AiUsageSummary = {
  periodStart: Date
  periodEnd: Date

  requestCount: number

  inputTokens: number
  outputTokens: number
  totalTokens: number

  estimatedCost: number

  monthlyCreditLimit: number | null
  remainingCredits: number | null

  monthlySpendLimit: number | null
  remainingSpend: number | null

  creditsExceeded: boolean
  spendExceeded: boolean
  limitExceeded: boolean
}

export type AiUsageCheck = {
  allowed: boolean

  reason:
    | "ok"
    | "credit_limit"
    | "spend_limit"

  usage: AiUsageSummary
}

/*
|--------------------------------------------------------------------------
| Internal Helpers
|--------------------------------------------------------------------------
*/

function getCurrentMonthRange(
  now = new Date()
): {
  start: Date
  end: Date
} {
  const start =
    new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        1,
        0,
        0,
        0,
        0
      )
    )

  const end =
    new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        1,
        0,
        0,
        0,
        0
      )
    )

  return {
    start,
    end,
  }
}

function toNumber(
  value: unknown
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof (
      value as {
        toNumber?: unknown
      }
    ).toNumber === "function"
  ) {
    const result =
      (
        value as {
          toNumber: () => number
        }
      ).toNumber()

    return Number.isFinite(result)
      ? result
      : 0
  }

  const result =
    Number(value)

  return Number.isFinite(result)
    ? result
    : 0
}

function normalizeLimit(
  value: number | null | undefined
): number | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null
  }

  return value
}

function calculateRemaining(
  limit: number | null,
  used: number
): number | null {
  if (limit === null) {
    return null
  }

  return Math.max(
    0,
    limit - used
  )
}

/*
|--------------------------------------------------------------------------
| Get Monthly AI Usage
|--------------------------------------------------------------------------
|
| This is the central read-only usage calculation.
|
| Usage is organization-scoped.
|
| Credits currently equal:
|
|     input tokens + output tokens
|
| This gives us a stable usage unit while the AI pricing layer is being
| finalized.
|
|--------------------------------------------------------------------------
*/

export async function getAiUsage(
  orgId: string,
  options?: {
    monthlyCreditLimit?: number | null
    monthlySpendLimit?: number | null
    now?: Date
  }
): Promise<AiUsageSummary> {
  const normalizedOrgId =
    orgId?.trim()

  if (!normalizedOrgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const now =
    options?.now ??
    new Date()

  const {
    start,
    end,
  } =
    getCurrentMonthRange(now)

  const [
    requestCount,
    usageAggregate,
  ] =
    await Promise.all([
      prisma.aiLog.count({
        where: {
          orgId:
            normalizedOrgId,

          createdAt: {
            gte: start,
            lt: end,
          },
        },
      }),

      prisma.aiLog.aggregate({
        where: {
          orgId:
            normalizedOrgId,

          createdAt: {
            gte: start,
            lt: end,
          },
        },

        _sum: {
          inputTokens: true,
          outputTokens: true,
          estimatedCost: true,
        },
      }),
    ])

  const inputTokens =
    usageAggregate._sum.inputTokens ??
    0

  const outputTokens =
    usageAggregate._sum.outputTokens ??
    0

  const totalTokens =
    inputTokens +
    outputTokens

  const estimatedCost =
    toNumber(
      usageAggregate._sum.estimatedCost
    )

  const monthlyCreditLimit =
    normalizeLimit(
      options?.monthlyCreditLimit
    )

  const monthlySpendLimit =
    normalizeLimit(
      options?.monthlySpendLimit
    )

  const remainingCredits =
    calculateRemaining(
      monthlyCreditLimit,
      totalTokens
    )

  const remainingSpend =
    calculateRemaining(
      monthlySpendLimit,
      estimatedCost
    )

  const creditsExceeded =
    monthlyCreditLimit !== null &&
    totalTokens >=
      monthlyCreditLimit

  const spendExceeded =
    monthlySpendLimit !== null &&
    estimatedCost >=
      monthlySpendLimit

  return {
    periodStart:
      start,

    periodEnd:
      end,

    requestCount,

    inputTokens,

    outputTokens,

    totalTokens,

    estimatedCost,

    monthlyCreditLimit,

    remainingCredits,

    monthlySpendLimit,

    remainingSpend,

    creditsExceeded,

    spendExceeded,

    limitExceeded:
      creditsExceeded ||
      spendExceeded,
  }
}

/*
|--------------------------------------------------------------------------
| Get Organization AI Usage
|--------------------------------------------------------------------------
|
| Reads the organization's configured AI limits automatically.
|
|--------------------------------------------------------------------------
*/

export async function getOrganizationAiUsage(
  orgId: string
): Promise<AiUsageSummary> {
  const normalizedOrgId =
    orgId?.trim()

  if (!normalizedOrgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const settings =
    await prisma.organizationSettings.findUnique({
      where: {
        orgId:
          normalizedOrgId,
      },

      select: {
        aiMonthlyCreditLimit: true,
        aiMonthlySpendLimit: true,
      },
    })

  return getAiUsage(
    normalizedOrgId,
    {
      monthlyCreditLimit:
        settings?.aiMonthlyCreditLimit ??
        null,

      monthlySpendLimit:
        settings?.aiMonthlySpendLimit ===
        null ||
        settings?.aiMonthlySpendLimit ===
        undefined
          ? null
          : toNumber(
              settings.aiMonthlySpendLimit
            ),
    }
  )
}

/*
|--------------------------------------------------------------------------
| Check Whether AI Usage Is Allowed
|--------------------------------------------------------------------------
|
| This is a preflight check.
|
| It should be called BEFORE making an expensive AI request.
|
|--------------------------------------------------------------------------
*/

export async function checkAiUsage(
  orgId: string,
  options?: {
    monthlyCreditLimit?: number | null
    monthlySpendLimit?: number | null
  }
): Promise<AiUsageCheck> {
  const usage =
    await getAiUsage(
      orgId,
      options
    )

  if (
    usage.creditsExceeded
  ) {
    return {
      allowed: false,

      reason:
        "credit_limit",

      usage,
    }
  }

  if (
    usage.spendExceeded
  ) {
    return {
      allowed: false,

      reason:
        "spend_limit",

      usage,
    }
  }

  return {
    allowed: true,

    reason:
      "ok",

    usage,
  }
}

/*
|--------------------------------------------------------------------------
| Check Organization AI Usage
|--------------------------------------------------------------------------
*/

export async function checkOrganizationAiUsage(
  orgId: string
): Promise<AiUsageCheck> {
  const normalizedOrgId =
    orgId?.trim()

  if (!normalizedOrgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const settings =
    await prisma.organizationSettings.findUnique({
      where: {
        orgId:
          normalizedOrgId,
      },

      select: {
        aiMonthlyCreditLimit: true,
        aiMonthlySpendLimit: true,
      },
    })

  return checkAiUsage(
    normalizedOrgId,
    {
      monthlyCreditLimit:
        settings?.aiMonthlyCreditLimit ??
        null,

      monthlySpendLimit:
        settings?.aiMonthlySpendLimit ===
        null ||
        settings?.aiMonthlySpendLimit ===
        undefined
          ? null
          : toNumber(
              settings.aiMonthlySpendLimit
            ),
    }
  )
}

/*
|--------------------------------------------------------------------------
| Get Remaining AI Credits
|--------------------------------------------------------------------------
*/

export async function getRemainingAiCredits(
  orgId: string
): Promise<number | null> {
  const usage =
    await getOrganizationAiUsage(
      orgId
    )

  return usage.remainingCredits
}

/*
|--------------------------------------------------------------------------
| Get Current AI Spend
|--------------------------------------------------------------------------
*/

export async function getCurrentAiSpend(
  orgId: string
): Promise<number> {
  const usage =
    await getOrganizationAiUsage(
      orgId
    )

  return usage.estimatedCost
}

/*
|--------------------------------------------------------------------------
| Get Current AI Token Usage
|--------------------------------------------------------------------------
*/

export async function getCurrentAiTokens(
  orgId: string
): Promise<number> {
  const usage =
    await getOrganizationAiUsage(
      orgId
    )

  return usage.totalTokens
}

/*
|--------------------------------------------------------------------------
| Get AI Usage By Feature
|--------------------------------------------------------------------------
|
| Useful later for:
|
| - CRM Assistant
| - Lead Scoring
| - Quote AI
| - Email AI
| - Call Intelligence
| - Agents
| - Voice
|
|--------------------------------------------------------------------------
*/

export async function getAiUsageByFeature(
  orgId: string,
  options?: {
    monthlyCreditLimit?: number | null
    monthlySpendLimit?: number | null
    now?: Date
  }
): Promise<
  Array<{
    feature: string
    requestCount: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
  }>
> {
  const normalizedOrgId =
    orgId?.trim()

  if (!normalizedOrgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const now =
    options?.now ??
    new Date()

  const {
    start,
    end,
  } =
    getCurrentMonthRange(now)

  const logs =
    await prisma.aiLog.findMany({
      where: {
        orgId:
          normalizedOrgId,

        createdAt: {
          gte: start,
          lt: end,
        },
      },

      select: {
        feature: true,
        inputTokens: true,
        outputTokens: true,
        estimatedCost: true,
      },
    })

  const grouped =
    new Map<
      string,
      {
        requestCount: number
        inputTokens: number
        outputTokens: number
        estimatedCost: number
      }
    >()

  for (const log of logs) {
    const feature =
      log.feature?.trim() ||
      "unknown"

    const existing =
      grouped.get(feature) ?? {
        requestCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCost: 0,
      }

    existing.requestCount += 1

    existing.inputTokens +=
      log.inputTokens ?? 0

    existing.outputTokens +=
      log.outputTokens ?? 0

    existing.estimatedCost +=
      toNumber(
        log.estimatedCost
      )

    grouped.set(
      feature,
      existing
    )
  }

  return Array.from(
    grouped.entries()
  )
    .map(
      ([
        feature,
        value,
      ]) => ({
        feature,

        requestCount:
          value.requestCount,

        inputTokens:
          value.inputTokens,

        outputTokens:
          value.outputTokens,

        totalTokens:
          value.inputTokens +
          value.outputTokens,

        estimatedCost:
          value.estimatedCost,
      })
    )
    .sort(
      (a, b) =>
        b.totalTokens -
        a.totalTokens
    )
}

/*
|--------------------------------------------------------------------------
| Get AI Usage By Model
|--------------------------------------------------------------------------
*/

export async function getAiUsageByModel(
  orgId: string,
  now = new Date()
): Promise<
  Array<{
    model: string
    requestCount: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
  }>
> {
  const normalizedOrgId =
    orgId?.trim()

  if (!normalizedOrgId) {
    throw new Error(
      "Organization ID is required."
    )
  }

  const {
    start,
    end,
  } =
    getCurrentMonthRange(now)

  const logs =
    await prisma.aiLog.findMany({
      where: {
        orgId:
          normalizedOrgId,

        createdAt: {
          gte: start,
          lt: end,
        },
      },

      select: {
        model: true,
        inputTokens: true,
        outputTokens: true,
        estimatedCost: true,
      },
    })

  const grouped =
    new Map<
      string,
      {
        requestCount: number
        inputTokens: number
        outputTokens: number
        estimatedCost: number
      }
    >()

  for (const log of logs) {
    const model =
      log.model?.trim() ||
      "unknown"

    const existing =
      grouped.get(model) ?? {
        requestCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCost: 0,
      }

    existing.requestCount += 1

    existing.inputTokens +=
      log.inputTokens ?? 0

    existing.outputTokens +=
      log.outputTokens ?? 0

    existing.estimatedCost +=
      toNumber(
        log.estimatedCost
      )

    grouped.set(
      model,
      existing
    )
  }

  return Array.from(
    grouped.entries()
  )
    .map(
      ([
        model,
        value,
      ]) => ({
        model,

        requestCount:
          value.requestCount,

        inputTokens:
          value.inputTokens,

        outputTokens:
          value.outputTokens,

        totalTokens:
          value.inputTokens +
          value.outputTokens,

        estimatedCost:
          value.estimatedCost,
      })
    )
    .sort(
      (a, b) =>
        b.totalTokens -
        a.totalTokens
    )
}

/*
|--------------------------------------------------------------------------
| Usage Percentage Helpers
|--------------------------------------------------------------------------
*/

export function getCreditUsagePercentage(
  usage: AiUsageSummary
): number {
  if (
    usage.monthlyCreditLimit ===
      null ||
    usage.monthlyCreditLimit <= 0
  ) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (
        usage.totalTokens /
        usage.monthlyCreditLimit
      ) *
        100
    )
  )
}

export function getSpendUsagePercentage(
  usage: AiUsageSummary
): number {
  if (
    usage.monthlySpendLimit ===
      null ||
    usage.monthlySpendLimit <= 0
  ) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (
        usage.estimatedCost /
        usage.monthlySpendLimit
      ) *
        100
    )
  )
}

/*
|--------------------------------------------------------------------------
| Human-Friendly Usage Status
|--------------------------------------------------------------------------
*/

export function getAiUsageStatus(
  usage: AiUsageSummary
): "normal" | "warning" | "exceeded" {
  if (
    usage.limitExceeded
  ) {
    return "exceeded"
  }

  const creditPercentage =
    getCreditUsagePercentage(
      usage
    )

  const spendPercentage =
    getSpendUsagePercentage(
      usage
    )

  const highestPercentage =
    Math.max(
      creditPercentage,
      spendPercentage
    )

  if (
    highestPercentage >= 80
  ) {
    return "warning"
  }

  return "normal"
}

/*
|--------------------------------------------------------------------------
| Format Usage For AI Settings / Dashboard
|--------------------------------------------------------------------------
*/

export function formatAiUsage(
  usage: AiUsageSummary
): {
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
  creditsRemaining: number | null
  creditLimit: number | null
  spendRemaining: number | null
  spendLimit: number | null
  creditUsagePercentage: number
  spendUsagePercentage: number
  status:
    | "normal"
    | "warning"
    | "exceeded"
} {
  return {
    requests:
      usage.requestCount,

    inputTokens:
      usage.inputTokens,

    outputTokens:
      usage.outputTokens,

    totalTokens:
      usage.totalTokens,

    estimatedCost:
      usage.estimatedCost,

    creditsUsed:
      usage.totalTokens,

    creditsRemaining:
      usage.remainingCredits,

    creditLimit:
      usage.monthlyCreditLimit,

    spendRemaining:
      usage.remainingSpend,

    spendLimit:
      usage.monthlySpendLimit,

    creditUsagePercentage:
      getCreditUsagePercentage(
        usage
      ),

    spendUsagePercentage:
      getSpendUsagePercentage(
        usage
      ),

    status:
      getAiUsageStatus(
        usage
      ),
  }
}