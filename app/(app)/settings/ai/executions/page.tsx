"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"

type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "rejected"

type ToolType =
  | "crm_read"
  | "crm_write"
  | "communication"
  | "search"
  | "knowledge"
  | "analytics"
  | "scheduling"
  | "finance"
  | "system"

type Agent = {
  id: string
  name: string
  slug: string
  status: string
}

type Conversation = {
  id: string
  title: string | null
  status: string
}

type ExecutionUser = {
  id: string
  name: string | null
  email: string | null
}

type Execution = {
  id: string
  orgId: string
  conversationId: string | null
  agentId: string | null
  userId: string
  toolName: string
  toolType: ToolType
  input: unknown
  output: unknown
  status: ExecutionStatus
  error: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  agent: Agent | null
  conversation: Conversation | null
  user: ExecutionUser | null
}

type Summary = {
  total: number
  pending: number
  running: number
  completed: number
  failed: number
  rejected: number
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  executions?: Execution[]
  items?: Execution[]
  summary?: Summary
  pagination?: {
    limit: number
    returned: number
    hasMore: boolean
  }
}

const STATUS_OPTIONS: Array<{
  value: "all" | ExecutionStatus
  label: string
}> = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "running",
    label: "Running",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "failed",
    label: "Failed",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
]

const TOOL_TYPE_OPTIONS: Array<{
  value: "all" | ToolType
  label: string
}> = [
  {
    value: "all",
    label: "All Tool Types",
  },
  {
    value: "crm_read",
    label: "CRM Read",
  },
  {
    value: "crm_write",
    label: "CRM Write",
  },
  {
    value: "communication",
    label: "Communication",
  },
  {
    value: "search",
    label: "Search",
  },
  {
    value: "knowledge",
    label: "Knowledge",
  },
  {
    value: "analytics",
    label: "Analytics",
  },
  {
    value: "scheduling",
    label: "Scheduling",
  },
  {
    value: "finance",
    label: "Finance",
  },
  {
    value: "system",
    label: "System",
  },
]

const STATUS_CLASSES: Record<
  ExecutionStatus,
  string
> = {
  pending:
    "bg-amber-100 text-amber-700 border-amber-200",
  running:
    "bg-blue-100 text-blue-700 border-blue-200",
  completed:
    "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed:
    "bg-red-100 text-red-700 border-red-200",
  rejected:
    "bg-slate-100 text-slate-600 border-slate-200",
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—"
  }

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

function formatDuration(
  startedAt: string | null,
  completedAt: string | null,
) {
  if (!startedAt) {
    return "—"
  }

  const start =
    new Date(
      startedAt,
    ).getTime()

  const end =
    completedAt
      ? new Date(
          completedAt,
        ).getTime()
      : Date.now()

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end < start
  ) {
    return "—"
  }

  const duration =
    end - start

  if (
    duration < 1000
  ) {
    return `${duration} ms`
  }

  if (
    duration < 60_000
  ) {
    return `${(
      duration / 1000
    ).toFixed(1)} s`
  }

  const minutes =
    Math.floor(
      duration /
        60_000,
    )

  const seconds =
    Math.floor(
      (duration %
        60_000) /
        1000,
    )

  return `${minutes}m ${seconds}s`
}

function formatJson(
  value: unknown,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "No data"
  }

  try {
    return JSON.stringify(
      value,
      null,
      2,
    )
  } catch {
    return String(value)
  }
}

function truncateId(
  value: string | null,
) {
  if (!value) {
    return "—"
  }

  if (
    value.length <= 16
  ) {
    return value
  }

  return `${value.slice(
    0,
    8,
  )}…${value.slice(-6)}`
}

function getDisplayName(
  user: ExecutionUser | null,
) {
  if (!user) {
    return "Unknown user"
  }

  return (
    user.name ||
    user.email ||
    "Unknown user"
  )
}

function getErrorMessage(
  data: ApiResponse | null,
) {
  return (
    data?.error ||
    data?.message ||
    "Unable to load AI executions."
  )
}

export default function AiExecutionsPage() {
  const [executions, setExecutions] =
    useState<Execution[]>(
      [],
    )

  const [summary, setSummary] =
    useState<Summary>({
      total: 0,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
      rejected: 0,
    })

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [status, setStatus] =
    useState<
      "all" | ExecutionStatus
    >("all")

  const [toolType, setToolType] =
    useState<
      "all" | ToolType
    >("all")

  const [selectedExecution, setSelectedExecution] =
    useState<Execution | null>(
      null,
    )

  const [showFilters, setShowFilters] =
    useState(false)

  const loadExecutions =
    useCallback(
      async (
        showRefreshState = false,
      ) => {
        if (showRefreshState) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError("")

        try {
          const params =
            new URLSearchParams()

          params.set(
            "limit",
            "100",
          )

          if (
            status !==
            "all"
          ) {
            params.set(
              "status",
              status,
            )
          }

          if (
            toolType !==
            "all"
          ) {
            params.set(
              "toolType",
              toolType,
            )
          }

          if (
            search.trim()
          ) {
            params.set(
              "search",
              search.trim(),
            )
          }

          const response =
            await fetch(
              `/api/ai/executions?${params.toString()}`,
              {
                method: "GET",
                cache: "no-store",
              },
            )

          const data =
            (await response.json()) as ApiResponse

          if (
            !response.ok ||
            data.success ===
              false
          ) {
            throw new Error(
              getErrorMessage(
                data,
              ),
            )
          }

          const rows =
            Array.isArray(
              data.executions,
            )
              ? data.executions
              : Array.isArray(
                    data.items,
                  )
                ? data.items
                : []

          setExecutions(
            rows,
          )

          if (
            data.summary
          ) {
            setSummary(
              data.summary,
            )
          } else {
            const calculated =
              rows.reduce(
                (
                  result,
                  item,
                ) => {
                  result.total += 1

                  switch (
                    item.status
                  ) {
                    case "pending":
                      result.pending += 1
                      break
                    case "running":
                      result.running += 1
                      break
                    case "completed":
                      result.completed += 1
                      break
                    case "failed":
                      result.failed += 1
                      break
                    case "rejected":
                      result.rejected += 1
                      break
                  }

                  return result
                },
                {
                  total: 0,
                  pending: 0,
                  running: 0,
                  completed: 0,
                  failed: 0,
                  rejected: 0,
                },
              )

            setSummary(
              calculated,
            )
          }
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI executions.",
          )
        } finally {
          setLoading(false)
          setRefreshing(false)
        }
      },
      [
        search,
        status,
        toolType,
      ],
    )

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          void loadExecutions()
        },
        250,
      )

    return () =>
      window.clearTimeout(
        timer,
      )
  }, [
    loadExecutions,
  ])

  const visibleExecutions =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return executions
      }

      return executions.filter(
        (execution) => {
          const searchable =
            [
              execution.id,
              execution.toolName,
              execution.toolType,
              execution.error ||
                "",
              execution.agent
                ?.name ||
                "",
              execution.agent
                ?.slug ||
                "",
              execution.user
                ?.name ||
                "",
              execution.user
                ?.email ||
                "",
              execution.conversation
                ?.title ||
                "",
            ]
              .join(" ")
              .toLowerCase()

          return searchable.includes(
            query,
          )
        },
      )
    }, [
      executions,
      search,
    ])

  function clearFilters() {
    setSearch("")
    setStatus("all")
    setToolType("all")
  }

  const hasFilters =
    Boolean(
      search.trim() ||
        status !== "all" ||
        toolType !== "all",
    )

  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-10">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/settings/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI Settings
              </Link>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Executions
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
                ⚡
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Tool Executions
                </h1>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Monitor AI tool calls, execution status,
                  results, and failures.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadExecutions(
                true,
              )
            }
            disabled={
              refreshing
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              void loadExecutions(
                true,
              )
            }
            className="w-fit rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </section>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard
          label="Total"
          value={
            summary.total
          }
          icon="Σ"
        />

        <SummaryCard
          label="Pending"
          value={
            summary.pending
          }
          icon="◷"
        />

        <SummaryCard
          label="Running"
          value={
            summary.running
          }
          icon="↻"
        />

        <SummaryCard
          label="Completed"
          value={
            summary.completed
          }
          icon="✓"
        />

        <SummaryCard
          label="Failed"
          value={
            summary.failed
          }
          icon="!"
        />

        <SummaryCard
          label="Rejected"
          value={
            summary.rejected
          }
          icon="×"
        />
      </section>

      {/* Filters */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search tool, agent, user, error..."
              className="w-full rounded-xl border px-11 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as
                    | "all"
                    | ExecutionStatus,
                )
              }
              className="rounded-xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              {STATUS_OPTIONS.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>

            <select
              value={toolType}
              onChange={(event) =>
                setToolType(
                  event.target
                    .value as
                    | "all"
                    | ToolType,
                )
              }
              className="rounded-xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              {TOOL_TYPE_OPTIONS.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (current) =>
                    !current,
                )
              }
              className="rounded-xl border px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {showFilters
                ? "Hide Filters"
                : "Filters"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Execution filters
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Filter the execution history by status or
                  tool category.
                </p>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="w-fit rounded-lg border bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Execution list */}
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Execution History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {visibleExecutions.length} execution
              {visibleExecutions.length ===
              1
                ? ""
                : "s"} displayed
            </p>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="w-fit text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <LoadingList />
        ) : visibleExecutions.length ===
          0 ? (
          <EmptyState
            filtered={
              hasFilters
            }
            onClear={
              clearFilters
            }
          />
        ) : (
          <div className="divide-y">
            {visibleExecutions.map(
              (
                execution,
              ) => (
                <ExecutionRow
                  key={
                    execution.id
                  }
                  execution={
                    execution
                  }
                  onSelect={() =>
                    setSelectedExecution(
                      execution,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      {/* Detail modal */}
      {selectedExecution && (
        <ExecutionDetailsModal
          execution={
            selectedExecution
          }
          onClose={() =>
            setSelectedExecution(
              null,
            )
          }
        />
      )}
    </main>
  )
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: string
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  )
}

function ExecutionRow({
  execution,
  onSelect,
}: {
  execution: Execution
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="block w-full text-left transition hover:bg-slate-50"
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          {/* Tool */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">
                {execution.toolName}
              </span>

              <StatusBadge
                status={
                  execution.status
                }
              />

              <span className="rounded-full border bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                {
                  execution.toolType
                }
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                Agent:{" "}
                <strong className="text-slate-700">
                  {execution.agent
                    ?.name ||
                    "Unknown"}
                </strong>
              </span>

              <span>
                User:{" "}
                <strong className="text-slate-700">
                  {getDisplayName(
                    execution.user,
                  )}
                </strong>
              </span>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-5 text-xs sm:min-w-[250px]">
            <div>
              <p className="text-slate-400">
                Created
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {formatDate(
                  execution.createdAt,
                )}
              </p>
            </div>

            <div>
              <p className="text-slate-400">
                Duration
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {formatDuration(
                  execution.startedAt,
                  execution.completedAt,
                )}
              </p>
            </div>
          </div>

          {/* IDs */}
          <div className="flex items-center gap-3 lg:min-w-[170px] lg:justify-end">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Execution ID
              </p>

              <p className="mt-1 font-mono text-xs text-slate-600">
                {truncateId(
                  execution.id,
                )}
              </p>
            </div>

            <span className="text-slate-300">
              →
            </span>
          </div>
        </div>

        {execution.error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="line-clamp-2 text-xs leading-5 text-red-700">
              {execution.error}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}

function StatusBadge({
  status,
}: {
  status: ExecutionStatus
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLASSES[status]}`}
    >
      {status
        .charAt(0)
        .toUpperCase() +
        status.slice(1)}
    </span>
  )
}

function ExecutionDetailsModal({
  execution,
  onClose,
}: {
  execution: Execution
  onClose: () => void
}) {
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        onClose()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 border-b p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {execution.toolName}
              </h2>

              <StatusBadge
                status={
                  execution.status
                }
              />
            </div>

            <p className="mt-2 break-all font-mono text-xs text-slate-400">
              {execution.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-lg text-slate-500 hover:bg-slate-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto">
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            {/* Metadata */}
            <div className="space-y-4">
              <DetailItem
                label="Tool Type"
                value={
                  execution.toolType
                }
                mono
              />

              <DetailItem
                label="Agent"
                value={
                  execution.agent
                    ?.name ||
                  "Unknown agent"
                }
              />

              <DetailItem
                label="Agent ID"
                value={
                  execution.agentId
                }
                mono
              />

              <DetailItem
                label="User"
                value={getDisplayName(
                  execution.user,
                )}
              />

              <DetailItem
                label="User ID"
                value={
                  execution.userId
                }
                mono
              />

              <DetailItem
                label="Conversation"
                value={
                  execution.conversation
                    ?.title ||
                  execution.conversationId ||
                  "No conversation"
                }
              />

              <DetailItem
                label="Created"
                value={formatDate(
                  execution.createdAt,
                )}
              />

              <DetailItem
                label="Started"
                value={formatDate(
                  execution.startedAt,
                )}
              />

              <DetailItem
                label="Completed"
                value={formatDate(
                  execution.completedAt,
                )}
              />

              <DetailItem
                label="Duration"
                value={formatDuration(
                  execution.startedAt,
                  execution.completedAt,
                )}
              />
            </div>

            {/* Status */}
            <div>
              <div className="rounded-2xl border bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Execution Status
                </p>

                <div className="mt-3">
                  <StatusBadge
                    status={
                      execution.status
                    }
                  />
                </div>

                {execution.error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                      Error
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-700">
                      {
                        execution.error
                      }
                    </p>
                  </div>
                )}

                {!execution.error &&
                  execution.status ===
                    "completed" && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-semibold text-emerald-700">
                        Tool execution completed successfully.
                      </p>
                    </div>
                  )}

                {execution.status ===
                  "pending" && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-700">
                      This tool call is waiting for approval
                      or further processing.
                    </p>
                  </div>
                )}

                {execution.status ===
                  "running" && (
                  <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-700">
                      This tool call is currently running.
                    </p>
                  </div>
                )}

                {execution.status ===
                  "rejected" && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-600">
                      This tool call was rejected.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="lg:col-span-2">
              <JsonPanel
                title="Input"
                value={
                  execution.input
                }
              />
            </div>

            {/* Output */}
            <div className="lg:col-span-2">
              <JsonPanel
                title="Output"
                value={
                  execution.output
                }
              />
            </div>

            {/* Conversation */}
            {execution.conversationId && (
              <div className="lg:col-span-2">
                <div className="rounded-2xl border bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Conversation
                  </p>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {execution
                          .conversation
                          ?.title ||
                          "AI Conversation"}
                      </p>

                      <p className="mt-1 break-all font-mono text-xs text-slate-500">
                        {
                          execution.conversationId
                        }
                      </p>
                    </div>

                    <Link
                      href={`/settings/ai/history?conversationId=${encodeURIComponent(
                        execution.conversationId,
                      )}`}
                      className="w-fit rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Open History
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-4">
          <p className="text-xs text-slate-400">
            Execution details are read-only.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null
  mono?: boolean
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm font-medium text-slate-700 ${
          mono
            ? "font-mono text-xs"
            : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  )
}

function JsonPanel({
  title,
  value,
}: {
  title: string
  value: unknown
}) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="border-b bg-slate-50 px-5 py-4">
        <h3 className="text-sm font-bold text-slate-800">
          {title}
        </h3>
      </div>

      <pre className="max-h-[420px] overflow-auto bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
        {formatJson(value)}
      </pre>
    </div>
  )
}

function LoadingList() {
  return (
    <div className="divide-y">
      {Array.from({
        length: 6,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="p-6"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="h-5 flex-1 rounded bg-slate-200" />
                <div className="h-5 w-24 rounded bg-slate-200" />
              </div>

              <div className="h-4 w-2/3 rounded bg-slate-100" />

              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
          </div>
        ),
      )}
    </div>
  )
}

function EmptyState({
  filtered,
  onClear,
}: {
  filtered: boolean
  onClear: () => void
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
        ⚡
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {filtered
          ? "No matching executions"
          : "No AI executions yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? "Try changing your search or filters to find other AI tool calls."
          : "When an AI agent uses a registered tool, its execution history will appear here."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}