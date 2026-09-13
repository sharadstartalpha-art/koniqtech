import type { AiCoreResult } from "@/shared/lib/ai/core"

export type AiModelPricing = {
  model: string

  inputPerMillion: number

  cachedInputPerMillion: number

  outputPerMillion: number
}

export type AiCostBreakdown = {
  model: string

  inputTokens: number

  outputTokens: number

  totalTokens: number

  inputCost: number

  cachedInputCost: number

  outputCost: number

  totalCost: number

  currency: "USD"
}

/*
 * ------------------------------------------------------------
 * CURRENT OPENAI API PRICING
 * ------------------------------------------------------------
 *
 * Prices are USD per 1 million tokens.
 *
 * GPT-5.6 Luna:
 *   Input:        $0.20 / 1M
 *   Cached input: $0.02 / 1M
 *   Output:       $1.20 / 1M
 *
 * GPT-5.6 Terra:
 *   Input:        $2.00 / 1M
 *   Cached input: $0.20 / 1M
 *   Output:       $12.00 / 1M
 *
 * GPT-5.6 Sol:
 *   Input:        $4.00 / 1M
 *   Cached input: $0.40 / 1M
 *   Output:       $20.00 / 1M
 *
 * Source:
 * OpenAI official model pricing.
 */

const PRICING: Record<
  string,
  AiModelPricing
> = {
  "gpt-5.6-luna": {
    model: "gpt-5.6-luna",
    inputPerMillion: 0.2,
    cachedInputPerMillion: 0.02,
    outputPerMillion: 1.2,
  },

  "gpt-5.6-terra": {
    model: "gpt-5.6-terra",
    inputPerMillion: 2,
    cachedInputPerMillion: 0.2,
    outputPerMillion: 12,
  },

  "gpt-5.6-sol": {
    model: "gpt-5.6-sol",
    inputPerMillion: 4,
    cachedInputPerMillion: 0.4,
    outputPerMillion: 20,
  },
}

const DEFAULT_PRICING =
  PRICING["gpt-5.6-luna"]

function normalizeModel(
  model: string | null | undefined,
): string {
  const normalized =
    model?.trim().toLowerCase()

  if (!normalized) {
    return DEFAULT_PRICING.model
  }

  /*
   * Support the GPT-5.6 alias if it is ever
   * configured instead of the full model ID.
   */
  if (normalized === "gpt-5.6") {
    return "gpt-5.6-sol"
  }

  return normalized
}

/**
 * Return pricing information for a model.
 */
export function getAiModelPricing(
  model: string | null | undefined,
): AiModelPricing {
  const normalized =
    normalizeModel(model)

  return (
    PRICING[normalized] ||
    DEFAULT_PRICING
  )
}

/**
 * Check whether pricing is explicitly known
 * for the supplied model.
 *
 * This prevents silently treating an unknown model
 * as if it were definitely Luna.
 */
export function hasAiModelPricing(
  model: string | null | undefined,
): boolean {
  const normalized =
    normalizeModel(model)

  return Boolean(
    PRICING[normalized],
  )
}

/**
 * Calculate cost for a token count.
 *
 * Prices are per 1 million tokens.
 */
function calculateTokenCost(
  tokens: number,
  pricePerMillion: number,
): number {
  if (
    !Number.isFinite(tokens) ||
    tokens <= 0
  ) {
    return 0
  }

  return (
    tokens /
    1_000_000
  ) * pricePerMillion
}

/**
 * Calculate estimated cost from token usage.
 *
 * cachedInputTokens is optional because our current
 * AI core does not yet expose cached input tokens.
 */
export function calculateAiCost({
  model,
  inputTokens,
  outputTokens,
  cachedInputTokens = 0,
}: {
  model: string | null | undefined
  inputTokens: number | null | undefined
  outputTokens: number | null | undefined
  cachedInputTokens?: number | null | undefined
}): AiCostBreakdown {
  const pricing =
    getAiModelPricing(model)

  const safeInputTokens =
    Number.isFinite(inputTokens) &&
    Number(inputTokens) > 0
      ? Number(inputTokens)
      : 0

  const safeOutputTokens =
    Number.isFinite(outputTokens) &&
    Number(outputTokens) > 0
      ? Number(outputTokens)
      : 0

  const safeCachedInputTokens =
    Number.isFinite(
      cachedInputTokens,
    ) &&
    Number(cachedInputTokens) > 0
      ? Number(cachedInputTokens)
      : 0

  /*
   * Cached input tokens are a subset of input tokens.
   *
   * Never allow cached tokens to exceed total input
   * tokens when calculating cost.
   */
  const effectiveCachedInputTokens =
    Math.min(
      safeCachedInputTokens,
      safeInputTokens,
    )

  const uncachedInputTokens =
    Math.max(
      0,
      safeInputTokens -
        effectiveCachedInputTokens,
    )

  const inputCost =
    calculateTokenCost(
      uncachedInputTokens,
      pricing.inputPerMillion,
    )

  const cachedInputCost =
    calculateTokenCost(
      effectiveCachedInputTokens,
      pricing.cachedInputPerMillion,
    )

  const outputCost =
    calculateTokenCost(
      safeOutputTokens,
      pricing.outputPerMillion,
    )

  const totalCost =
    inputCost +
    cachedInputCost +
    outputCost

  return {
    model:
      pricing.model,

    inputTokens:
      safeInputTokens,

    outputTokens:
      safeOutputTokens,

    totalTokens:
      safeInputTokens +
      safeOutputTokens,

    inputCost,

    cachedInputCost,

    outputCost,

    totalCost,

    currency: "USD",
  }
}

/**
 * Calculate cost directly from an AI core result.
 */
export function calculateAiResultCost(
  result: AiCoreResult,
): AiCostBreakdown {
  return calculateAiCost({
    model: result.model,
    inputTokens:
      result.inputTokens,
    outputTokens:
      result.outputTokens,
  })
}

/**
 * Convenience helper returning only the total
 * estimated USD cost.
 */
export function estimateAiCost(
  model: string | null | undefined,
  inputTokens: number | null | undefined,
  outputTokens: number | null | undefined,
): number {
  return calculateAiCost({
    model,
    inputTokens,
    outputTokens,
  }).totalCost
}

/**
 * Round money to six decimal places.
 *
 * We intentionally keep more precision than the UI
 * because individual AI requests can cost fractions
 * of one cent.
 */
export function roundAiCost(
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Number(
    value.toFixed(6),
  )
}

/**
 * Format an AI cost for the UI.
 *
 * Small AI requests may be less than one cent, so
 * six decimal places are retained when necessary.
 */
export function formatAiCost(
  value: number,
): string {
  if (
    !Number.isFinite(value) ||
    value === 0
  ) {
    return "$0.00"
  }

  if (Math.abs(value) < 0.01) {
    return `$${value.toFixed(6)}`
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    },
  ).format(value)
}

/**
 * Return all pricing currently known by the
 * KoniqTech pricing layer.
 */
export function getAllAiModelPricing(): AiModelPricing[] {
  return Object.values(
    PRICING,
  ).map((pricing) => ({
    ...pricing,
  }))
}
