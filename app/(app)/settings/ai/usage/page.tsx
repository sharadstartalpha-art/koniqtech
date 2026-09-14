"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type UsageItem = {
  id: string
  orgId: string
  userId: string | null
  feature: string | null
  model: string | null
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
  createdAt: string
}

type UserSummary = {
  userId: string
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
}

type FeatureSummary = {
  feature: string
  requests: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
}

type ModelSummary = {
  model: string
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
}

type UsageSummary = {
  requests: number
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
  creditsUsed: number
}

type UsageApiResponse = {
  success?: boolean
  error?: string
  message?: string
  usage?: UsageItem[]
  items?: UsageItem[]
  data?: UsageItem[]
  summary?: UsageSummary
  byUser?: UserSummary[]
  byFeature?: FeatureSummary[]
  byModel?: ModelSummary[]
  total?: number
}

type DateRange =
  | "7"
  | "30"
  | "90"
  | "all"

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  )
}

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    },
  ).format(
    Number.isFinite(value)
      ? value
      : 0,
  )
}

function formatDate(
  value: string,
) {
  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—"
  }

  return date.toLocaleString()
}

function getErrorMessage(
  data: UsageApiResponse | null,
) {
  return (
    data?.error ||
    data?.message ||
    "Unable to load AI usage."
  )
}

function normalizeUsageItem(
  item: Partial<UsageItem>,
): UsageItem {
  return {
    id:
      typeof item.id ===
      "string"
        ? item.id
        : crypto.randomUUID(),

    orgId:
      typeof item.orgId ===
      "string"
        ? item.orgId
        : "",

    userId:
      typeof item.userId ===
      "string"
        ? item.userId
        : null,

    feature:
      typeof item.feature ===
      "string"
        ? item.feature
        : null,

    model:
      typeof item.model ===
      "string"
        ? item.model
        : null,

    inputTokens:
      Number(
        item.inputTokens,
      ) || 0,

    outputTokens:
      Number(
        item.outputTokens,
      ) || 0,

    totalTokens:
      Number(
        item.totalTokens,
      ) || 0,

    estimatedCost:
      Number(
        item.estimatedCost,
      ) || 0,

    creditsUsed:
      Number(
        item.creditsUsed,
      ) || 0,

    createdAt:
      typeof item.createdAt ===
      "string"
        ? item.createdAt
        : "",
  }
}

export default function AiUsagePage() {
  const [usage, setUsage] =
    useState<UsageItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [dateRange, setDateRange] =
    useState<DateRange>("30")

  const [featureFilter, setFeatureFilter] =
    useState("all")

  const [modelFilter, setModelFilter] =
    useState("all")

  const [search, setSearch] =
    useState("")

  const loadUsage =
    useCallback(
      async () => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
          const params =
            new URLSearchParams()

          if (
            dateRange !==
            "all"
          ) {
            const days =
              Number(
                dateRange,
              )

            const from =
              new Date()

            from.setDate(
              from.getDate() -
                days,
            )

            params.set(
              "from",
              from.toISOString(),
            )
          }

          params.set(
            "limit",
            "500",
          )

          const query =
            params.toString()

          const response =
            await fetch(
              `/api/ai/usage?${query}`,
              {
                method: "GET",
                cache: "no-store",
              },
            )

          const data =
            (await response.json()) as UsageApiResponse

          if (
            !response.ok ||
            data.success === false
          ) {
            throw new Error(
              getErrorMessage(
                data,
              ),
            )
          }

          const rawItems =
            Array.isArray(
              data.usage,
            )
              ? data.usage
              : Array.isArray(
                    data.items,
                  )
                ? data.items
                : Array.isArray(
                      data.data,
                    )
                  ? data.data
                  : []

          setUsage(
            rawItems.map(
              (item) =>
                normalizeUsageItem(
                  item,
                ),
            ),
          )

          setSuccess(
            "AI usage refreshed.",
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI usage.",
          )
        } finally {
          setLoading(false)
        }
      },
      [dateRange],
    )

  useEffect(() => {
    void loadUsage()
  }, [loadUsage])

  const availableFeatures =
    useMemo(() => {
      const values =
        usage
          .map(
            (item) =>
              item.feature,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          )

      return Array.from(
        new Set(values),
      ).sort()
    }, [usage])

  const availableModels =
    useMemo(() => {
      const values =
        usage
          .map(
            (item) =>
              item.model,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          )

      return Array.from(
        new Set(values),
      ).sort()
    }, [usage])

  const filteredUsage =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return usage.filter(
        (item) => {
          if (
            featureFilter !==
              "all" &&
            item.feature !==
              featureFilter
          ) {
            return false
          }

          if (
            modelFilter !==
              "all" &&
            item.model !==
              modelFilter
          ) {
            return false
          }

          if (!query) {
            return true
          }

          return [
            item.id,
            item.userId,
            item.feature,
            item.model,
          ]
            .filter(Boolean)
            .some(
              (value) =>
                String(
                  value,
                )
                  .toLowerCase()
                  .includes(
                    query,
                  ),
            )
        },
      )
    }, [
      usage,
      featureFilter,
      modelFilter,
      search,
    ])

  const summary =
    useMemo<UsageSummary>(
      () => {
        return filteredUsage.reduce(
          (
            result,
            item,
          ) => ({
            requests:
              result.requests +
              1,

            inputTokens:
              result.inputTokens +
              item.inputTokens,

            outputTokens:
              result.outputTokens +
              item.outputTokens,

            totalTokens:
              result.totalTokens +
              item.totalTokens,

            estimatedCost:
              result.estimatedCost +
              item.estimatedCost,

            creditsUsed:
              result.creditsUsed +
              item.creditsUsed,
          }),
          {
            requests: 0,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            estimatedCost: 0,
            creditsUsed: 0,
          },
        )
      },
      [filteredUsage],
    )

  const featureSummary =
    useMemo<FeatureSummary[]>(
      () => {
        const map =
          new Map<
            string,
            FeatureSummary
          >()

        for (const item of filteredUsage) {
          const key =
            item.feature ||
            "unknown"

          const existing =
            map.get(key)

          if (existing) {
            existing.requests += 1
            existing.totalTokens +=
              item.totalTokens
            existing.estimatedCost +=
              item.estimatedCost
            existing.creditsUsed +=
              item.creditsUsed
          } else {
            map.set(key, {
              feature: key,
              requests: 1,
              totalTokens:
                item.totalTokens,
              estimatedCost:
                item.estimatedCost,
              creditsUsed:
                item.creditsUsed,
            })
          }
        }

        return Array.from(
          map.values(),
        ).sort(
          (a, b) =>
            b.totalTokens -
            a.totalTokens,
        )
      },
      [filteredUsage],
    )

  const modelSummary =
    useMemo<ModelSummary[]>(
      () => {
        const map =
          new Map<
            string,
            ModelSummary
          >()

        for (const item of filteredUsage) {
          const key =
            item.model ||
            "unknown"

          const existing =
            map.get(key)

          if (existing) {
            existing.requests += 1
            existing.inputTokens +=
              item.inputTokens
            existing.outputTokens +=
              item.outputTokens
            existing.totalTokens +=
              item.totalTokens
            existing.estimatedCost +=
              item.estimatedCost
            existing.creditsUsed +=
              item.creditsUsed
          } else {
            map.set(key, {
              model: key,
              requests: 1,
              inputTokens:
                item.inputTokens,
              outputTokens:
                item.outputTokens,
              totalTokens:
                item.totalTokens,
              estimatedCost:
                item.estimatedCost,
              creditsUsed:
                item.creditsUsed,
            })
          }
        }

        return Array.from(
          map.values(),
        ).sort(
          (a, b) =>
            b.totalTokens -
            a.totalTokens,
        )
      },
      [filteredUsage],
    )

  const userSummary =
    useMemo<UserSummary[]>(
      () => {
        const map =
          new Map<
            string,
            UserSummary
          >()

        for (const item of filteredUsage) {
          const key =
            item.userId ||
            "unknown"

          const existing =
            map.get(key)

          if (existing) {
            existing.requests += 1
            existing.inputTokens +=
              item.inputTokens
            existing.outputTokens +=
              item.outputTokens
            existing.totalTokens +=
              item.totalTokens
            existing.estimatedCost +=
              item.estimatedCost
            existing.creditsUsed +=
              item.creditsUsed
          } else {
            map.set(key, {
              userId: key,
              requests: 1,
              inputTokens:
                item.inputTokens,
              outputTokens:
                item.outputTokens,
              totalTokens:
                item.totalTokens,
              estimatedCost:
                item.estimatedCost,
              creditsUsed:
                item.creditsUsed,
            })
          }
        }

        return Array.from(
          map.values(),
        ).sort(
          (a, b) =>
            b.totalTokens -
            a.totalTokens,
        )
      },
      [filteredUsage],
    )

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <a
                href="/settings/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI Settings
              </a>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Usage
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Usage
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Monitor AI requests, token consumption,
              credits, and estimated API costs across your
              organization.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadUsage()
            }
            disabled={loading}
            className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh Usage"}
          </button>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && !error && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      {/* Filters */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <label
              htmlFor="usage-period"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Period
            </label>

            <select
              id="usage-period"
              value={dateRange}
              onChange={(event) =>
                setDateRange(
                  event.target
                    .value as DateRange,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="7">
                Last 7 days
              </option>

              <option value="30">
                Last 30 days
              </option>

              <option value="90">
                Last 90 days
              </option>

              <option value="all">
                All available
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="usage-feature"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Feature
            </label>

            <select
              id="usage-feature"
              value={
                featureFilter
              }
              onChange={(event) =>
                setFeatureFilter(
                  event.target
                    .value,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Features
              </option>

              {availableFeatures.map(
                (feature) => (
                  <option
                    key={
                      feature
                    }
                    value={
                      feature
                    }
                  >
                    {feature}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="usage-model"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Model
            </label>

            <select
              id="usage-model"
              value={
                modelFilter
              }
              onChange={(event) =>
                setModelFilter(
                  event.target
                    .value,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Models
              </option>

              {availableModels.map(
                (modelName) => (
                  <option
                    key={
                      modelName
                    }
                    value={
                      modelName
                    }
                  >
                    {modelName}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="usage-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search
            </label>

            <input
              id="usage-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="User, feature, model..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Requests
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatNumber(
              summary.requests,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Input Tokens
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatNumber(
              summary.inputTokens,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Output Tokens
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {formatNumber(
              summary.outputTokens,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Tokens
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatNumber(
              summary.totalTokens,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Estimated Cost
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(
              summary.estimatedCost,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Credits Used
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {formatNumber(
              summary.creditsUsed,
            )}
          </p>
        </div>
      </section>

      {/* Breakdown */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Features */}
        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Usage by Feature
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Which AI capabilities are consuming usage.
            </p>
          </div>

          <div className="p-6">
            {featureSummary.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                No feature usage available.
              </p>
            ) : (
              <div className="space-y-4">
                {featureSummary.map(
                  (item) => (
                    <div
                      key={
                        item.feature
                      }
                      className="rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-semibold text-slate-800">
                          {
                            item.feature
                          }
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {formatNumber(
                            item.requests,
                          )}{" "}
                          requests
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {formatNumber(
                            item.totalTokens,
                          )}{" "}
                          tokens
                        </span>

                        <span>
                          {formatCurrency(
                            item.estimatedCost,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Models */}
        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Usage by Model
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Token consumption and estimated cost per model.
            </p>
          </div>

          <div className="p-6">
            {modelSummary.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                No model usage available.
              </p>
            ) : (
              <div className="space-y-4">
                {modelSummary.map(
                  (item) => (
                    <div
                      key={
                        item.model
                      }
                      className="rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-semibold text-slate-800">
                          {
                            item.model
                          }
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {formatNumber(
                            item.requests,
                          )}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <span>
                          Input:{" "}
                          {formatNumber(
                            item.inputTokens,
                          )}
                        </span>

                        <span>
                          Output:{" "}
                          {formatNumber(
                            item.outputTokens,
                          )}
                        </span>

                        <span>
                          Total:{" "}
                          {formatNumber(
                            item.totalTokens,
                          )}
                        </span>

                        <span>
                          Cost:{" "}
                          {formatCurrency(
                            item.estimatedCost,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Users */}
        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Usage by User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organization usage grouped by user.
            </p>
          </div>

          <div className="p-6">
            {userSummary.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                No user usage available.
              </p>
            ) : (
              <div className="space-y-4">
                {userSummary.map(
                  (item) => (
                    <div
                      key={
                        item.userId
                      }
                      className="rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="max-w-[180px] truncate font-mono text-xs font-semibold text-slate-700">
                          {
                            item.userId ===
                            "unknown"
                              ? "Unknown user"
                              : item.userId
                          }
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {formatNumber(
                            item.requests,
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {formatNumber(
                            item.totalTokens,
                          )}{" "}
                          tokens
                        </span>

                        <span>
                          {formatCurrency(
                            item.estimatedCost,
                          )}
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detailed usage */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Usage Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Individual AI usage records for the selected
              period and filters.
            </p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {formatNumber(
              filteredUsage.length,
            )}{" "}
            records
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading AI usage...
            </div>
          ) : filteredUsage.length ===
            0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ∅
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No usage records
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are no AI usage records matching the
                current filters.
              </p>
            </div>
          ) : (
            <table className="min-w-[1100px] w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    User
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Feature
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Model
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Input
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Output
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Total
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Credits
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Cost
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredUsage.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                      className="hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {formatDate(
                          item.createdAt,
                        )}
                      </td>

                      <td className="max-w-[180px] truncate px-6 py-4 font-mono text-xs text-slate-500">
                        {item.userId ||
                          "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {item.feature ||
                            "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {item.model ||
                          "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-right text-slate-600">
                        {formatNumber(
                          item.inputTokens,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right text-slate-600">
                        {formatNumber(
                          item.outputTokens,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        {formatNumber(
                          item.totalTokens,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right text-amber-600">
                        {formatNumber(
                          item.creditsUsed,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                        {formatCurrency(
                          item.estimatedCost,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>

              <tfoot>
                <tr className="border-t bg-slate-50 font-semibold">
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-slate-700"
                  >
                    Filtered Total
                  </td>

                  <td className="px-6 py-4 text-right">
                    {formatNumber(
                      summary.inputTokens,
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {formatNumber(
                      summary.outputTokens,
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {formatNumber(
                      summary.totalTokens,
                    )}
                  </td>

                  <td className="px-6 py-4 text-right text-amber-600">
                    {formatNumber(
                      summary.creditsUsed,
                    )}
                  </td>

                  <td className="px-6 py-4 text-right text-emerald-600">
                    {formatCurrency(
                      summary.estimatedCost,
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </section>

      {/* Cost information */}
      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">
          About AI Cost Estimates
        </h2>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-800">
          Estimated cost is calculated from the token usage
          recorded by KoniqTech CRM and the configured model
          pricing. It is an operational estimate and may not
          exactly match the final provider invoice.
        </p>
      </section>
    </main>
  )
}