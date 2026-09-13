"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

type UsageData = {
  success: boolean

  period: {
    start: string
    end: string
  }

  usage: {
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

  status: {
    creditsExceeded: boolean
    spendExceeded: boolean
    limitExceeded: boolean
  }

  formatted?: {
    requests?: number
    tokens?: number
    cost?: number
    creditsUsed?: number
    creditsRemaining?: number | null
    creditLimit?: number | null
    spend?: number
    spendRemaining?: number | null
    spendLimit?: number | null
    creditUsagePercentage?: number
    spendUsagePercentage?: number
    status?: "normal" | "warning" | "exceeded"
  }

  byFeature: Array<{
    feature: string
    requestCount: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
  }>

  byModel: Array<{
    model: string
    requestCount: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    estimatedCost: number
  }>
}

type ApiError = {
  error?: string
}

function formatNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
  ).format(value)
}

function formatCurrency(
  value: number,
): string {
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

function formatDate(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date)
}

function formatFeatureName(
  value: string,
): string {
  if (!value) {
    return "Unknown"
  }

  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    )
}

function formatModelName(
  value: string,
): string {
  if (!value) {
    return "Unknown"
  }

  return value
}

function getPercentage(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0
  }

  return Math.min(
    100,
    Math.max(0, value),
  )
}

function getStatusLabel(
  usage: UsageData["usage"],
): string {
  if (usage.limitExceeded) {
    return "Limit exceeded"
  }

  const creditPercentage =
    usage.monthlyCreditLimit &&
    usage.monthlyCreditLimit > 0
      ? (usage.totalTokens /
          usage.monthlyCreditLimit) *
        100
      : 0

  const spendPercentage =
    usage.monthlySpendLimit &&
    usage.monthlySpendLimit > 0
      ? (usage.estimatedCost /
          usage.monthlySpendLimit) *
        100
      : 0

  if (
    creditPercentage >= 80 ||
    spendPercentage >= 80
  ) {
    return "Approaching limit"
  }

  return "Healthy"
}

export default function AiDashboardPage() {
  const [data, setData] =
    useState<UsageData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadUsage =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const response =
          await fetch(
            "/api/ai/usage",
            {
              method: "GET",
              cache: "no-store",
              credentials: "include",
            },
          )

        const payload =
          (await response.json()) as
            | UsageData
            | ApiError

        if (!response.ok) {
          throw new Error(
            "error" in payload &&
              payload.error
              ? payload.error
              : "Unable to load AI usage.",
          )
        }

        setData(
          payload as UsageData,
        )
      } catch (requestError) {
        console.error(
          "[AI Dashboard] Failed to load usage:",
          requestError,
        )

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load AI usage.",
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadUsage()
  }, [loadUsage])

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-full bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-5 w-96 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white" />
            <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-white" />
          </div>
        </div>
      </main>
    )
  }

  /*
   * ------------------------------------------------------------
   * ERROR
   * ------------------------------------------------------------
   */

  if (error || !data) {
    return (
      <main className="min-h-full bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col items-start rounded-2xl border border-red-200 bg-white p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
              !
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Unable to load AI usage
            </h1>

            <p className="mt-2 max-w-xl text-sm text-gray-600">
              {error ||
                "AI usage information could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() => void loadUsage()}
              className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    )
  }

  const usage =
    data.usage

  const formatted =
    data.formatted

  const creditPercentage =
    getPercentage(
      formatted?.creditUsagePercentage,
    )

  const spendPercentage =
    getPercentage(
      formatted?.spendUsagePercentage,
    )

  const statusLabel =
    getStatusLabel(usage)

  const statusIsExceeded =
    usage.limitExceeded

  const statusIsWarning =
    !statusIsExceeded &&
    (creditPercentage >= 80 ||
      spendPercentage >= 80)

  return (
    <main className="min-h-full bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* -------------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------------- */}

        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                ✦
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600">
                  KoniqTech Intelligence
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-950">
                  AI Dashboard
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Monitor your organization's AI usage,
              token consumption, estimated spend,
              and model activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadUsage()}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
            >
              Refresh
            </button>

            <Link
              href="/ai/chat"
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
            >
              Open AI Assistant
            </Link>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* PERIOD */}
        {/* -------------------------------------------------- */}

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <span>
            Current billing period:
          </span>

          <span className="font-medium text-gray-700">
            {formatDate(
              data.period.start,
            )}
          </span>

          <span>→</span>

          <span className="font-medium text-gray-700">
            {formatDate(
              data.period.end,
            )}
          </span>

          <span className="mx-1 hidden text-gray-300 sm:inline">
            •
          </span>

          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-medium",
              statusIsExceeded
                ? "bg-red-100 text-red-700"
                : statusIsWarning
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700",
            ].join(" ")}
          >
            {statusLabel}
          </span>
        </div>

        {/* -------------------------------------------------- */}
        {/* STAT CARDS */}
        {/* -------------------------------------------------- */}

        <section className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Requests */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  AI Requests
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {formatNumber(
                    usage.requestCount,
                  )}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  This month
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ↗
              </div>
            </div>
          </div>

          {/* Tokens */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Tokens
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {formatNumber(
                    usage.totalTokens,
                  )}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Input + output
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                ◈
              </div>
            </div>
          </div>

          {/* Cost */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Estimated Spend
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {formatCurrency(
                    usage.estimatedCost,
                  )}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Current month
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                $
              </div>
            </div>
          </div>

          {/* Status */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  AI Status
                </p>

                <p
                  className={[
                    "mt-3 text-2xl font-bold tracking-tight",
                    statusIsExceeded
                      ? "text-red-600"
                      : statusIsWarning
                        ? "text-amber-600"
                        : "text-green-600",
                  ].join(" ")}
                >
                  {statusLabel}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Organization AI access
                </p>
              </div>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  statusIsExceeded
                    ? "bg-red-50 text-red-600"
                    : statusIsWarning
                      ? "bg-amber-50 text-amber-600"
                      : "bg-green-50 text-green-600",
                ].join(" ")}
              >
                ✓
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* USAGE LIMITS */}
        {/* -------------------------------------------------- */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Credits */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  AI Credit Usage
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Token usage against your monthly AI credit limit.
                </p>
              </div>

              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                Monthly
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-950">
                  {formatNumber(
                    usage.totalTokens,
                  )}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Credits used
                </p>
              </div>

              <div className="text-right">
                {usage.monthlyCreditLimit ===
                null ? (
                  <>
                    <p className="text-sm font-semibold text-gray-700">
                      No limit
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Unlimited
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatNumber(
                        usage.monthlyCreditLimit,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Monthly limit
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  usage.creditsExceeded
                    ? "bg-red-500"
                    : creditPercentage >= 80
                      ? "bg-amber-500"
                      : "bg-blue-600",
                ].join(" ")}
                style={{
                  width:
                    usage.monthlyCreditLimit ===
                    null
                      ? "0%"
                      : `${creditPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>
                {usage.monthlyCreditLimit ===
                null
                  ? "Limit not configured"
                  : `${creditPercentage.toFixed(0)}% used`}
              </span>

              <span>
                {usage.remainingCredits ===
                null
                  ? "Unlimited remaining"
                  : `${formatNumber(
                      usage.remainingCredits,
                    )} remaining`}
              </span>
            </div>
          </div>

          {/* Spend */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  AI Spend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Estimated API spend against your monthly budget.
                </p>
              </div>

              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                Monthly
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-950">
                  {formatCurrency(
                    usage.estimatedCost,
                  )}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Estimated spend
                </p>
              </div>

              <div className="text-right">
                {usage.monthlySpendLimit ===
                null ? (
                  <>
                    <p className="text-sm font-semibold text-gray-700">
                      No limit
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Unlimited
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatCurrency(
                        usage.monthlySpendLimit,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Monthly budget
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  usage.spendExceeded
                    ? "bg-red-500"
                    : spendPercentage >= 80
                      ? "bg-amber-500"
                      : "bg-green-600",
                ].join(" ")}
                style={{
                  width:
                    usage.monthlySpendLimit ===
                    null
                      ? "0%"
                      : `${spendPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>
                {usage.monthlySpendLimit ===
                null
                  ? "Limit not configured"
                  : `${spendPercentage.toFixed(0)}% used`}
              </span>

              <span>
                {usage.remainingSpend ===
                null
                  ? "Unlimited remaining"
                  : `${formatCurrency(
                      usage.remainingSpend,
                    )} remaining`}
              </span>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* TOKEN BREAKDOWN */}
        {/* -------------------------------------------------- */}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Token Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              See how your current month's AI tokens are being consumed.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Input Tokens
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-950">
                {formatNumber(
                  usage.inputTokens,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Output Tokens
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-950">
                {formatNumber(
                  usage.outputTokens,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Total Tokens
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-950">
                {formatNumber(
                  usage.totalTokens,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* FEATURE + MODEL */}
        {/* -------------------------------------------------- */}

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* By Feature */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Usage by Feature
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                AI activity across KoniqTech features.
              </p>
            </div>

            {data.byFeature.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="text-sm text-gray-500">
                  No feature usage recorded yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Feature</span>
                  <span>Requests</span>
                  <span>Tokens</span>
                </div>

                {data.byFeature.map(
                  (item) => (
                    <div
                      key={item.feature}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-gray-100 px-4 py-4 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {formatFeatureName(
                          item.feature,
                        )}
                      </span>

                      <span className="text-sm text-gray-600">
                        {formatNumber(
                          item.requestCount,
                        )}
                      </span>

                      <span className="text-sm font-medium text-gray-800">
                        {formatNumber(
                          item.totalTokens,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* By Model */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Usage by Model
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                AI models used by your organization.
              </p>
            </div>

            {data.byModel.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                <p className="text-sm text-gray-500">
                  No model usage recorded yet.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Model</span>
                  <span>Requests</span>
                  <span>Tokens</span>
                </div>

                {data.byModel.map(
                  (item) => (
                    <div
                      key={item.model}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-gray-100 px-4 py-4 last:border-0"
                    >
                      <span className="break-all text-sm font-medium text-gray-800">
                        {formatModelName(
                          item.model,
                        )}
                      </span>

                      <span className="text-sm text-gray-600">
                        {formatNumber(
                          item.requestCount,
                        )}
                      </span>

                      <span className="text-sm font-medium text-gray-800">
                        {formatNumber(
                          item.totalTokens,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* CURRENT ACCOUNTING NOTE */}
        {/* -------------------------------------------------- */}

        {usage.estimatedCost === 0 && (
          <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                i
              </div>

              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  AI cost tracking is not configured yet
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Token usage is being recorded correctly.
                  Estimated API cost will become available
                  after the centralized AI pricing layer is enabled.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------- */}
        {/* FOOTER */}
        {/* -------------------------------------------------- */}

        <div className="mt-8 flex flex-col gap-2 border-t border-gray-200 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            AI usage is calculated from KoniqTech AI activity
            recorded during the current calendar month.
          </p>

          <Link
            href="/ai/chat"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Back to AI Assistant →
          </Link>
        </div>
      </div>
    </main>
  )
}