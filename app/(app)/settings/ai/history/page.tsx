"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type ConversationStatus =
  | "active"
  | "archived"

type ConversationMessage = {
  id: string
  role: string
  content: string
  model: string | null
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
  createdAt: string
}

type Conversation = {
  id: string
  orgId: string
  userId: string
  title: string | null
  status: ConversationStatus
  model: string | null
  context: unknown
  createdAt: string
  updatedAt: string
  messages?: ConversationMessage[]
  user?: {
    id: string
    name: string | null
    email: string | null
  } | null
}

type HistoryApiResponse = {
  success?: boolean
  error?: string
  message?: string
  conversations?: Conversation[]
  items?: Conversation[]
  data?: Conversation[]
  conversation?: Conversation
  total?: number
  hasMore?: boolean
  nextCursor?: string | null
}

type DateRange =
  | "today"
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

function getUserLabel(
  conversation: Conversation,
) {
  if (
    conversation.user?.name
  ) {
    return conversation.user.name
  }

  if (
    conversation.user?.email
  ) {
    return conversation.user.email
  }

  return conversation.userId
    ? conversation.userId
    : "Unknown user"
}

function getInitials(
  value: string,
) {
  const parts =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (parts.length === 0) {
    return "AI"
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase()
}

function getErrorMessage(
  data: HistoryApiResponse | null,
) {
  return (
    data?.error ||
    data?.message ||
    "Unable to load AI conversation history."
  )
}

function getConversationTokens(
  conversation: Conversation,
) {
  return (
    conversation.messages?.reduce(
      (
        total,
        message,
      ) =>
        total +
        (Number(
          message.totalTokens,
        ) || 0),
      0,
    ) || 0
  )
}

function getConversationCost(
  conversation: Conversation,
) {
  /*
   * The conversation model does not store cost directly.
   * Cost is therefore displayed only when the history API
   * provides it through message metadata in the future.
   *
   * Keeping this at zero avoids inventing financial data.
   */
  return 0
}

function getConversationPreview(
  conversation: Conversation,
) {
  const userMessage =
    conversation.messages
      ?.filter(
        (message) =>
          message.role ===
          "user",
      )
      .at(-1)

  if (
    userMessage?.content
  ) {
    return userMessage.content
  }

  return (
    conversation.title ||
    "AI conversation"
  )
}

function getDateFromRange(
  range: DateRange,
) {
  if (range === "all") {
    return null
  }

  const date =
    new Date()

  if (range === "today") {
    date.setHours(
      0,
      0,
      0,
      0,
    )

    return date
  }

  date.setDate(
    date.getDate() -
      Number(range),
  )

  return date
}

export default function AiHistoryPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [search, setSearch] =
    useState("")

  const [dateRange, setDateRange] =
    useState<DateRange>("30")

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | ConversationStatus
    >("all")

  const [modelFilter, setModelFilter] =
    useState("all")

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(
      null,
    )

  const [deletingId, setDeletingId] =
    useState<string | null>(null)

  const loadHistory =
    useCallback(
      async () => {
        setLoading(true)
        setError("")
        setSuccess("")

        try {
          const params =
            new URLSearchParams()

          params.set(
            "limit",
            "100",
          )

          if (
            statusFilter !==
            "all"
          ) {
            params.set(
              "status",
              statusFilter,
            )
          }

          const from =
            getDateFromRange(
              dateRange,
            )

          if (from) {
            params.set(
              "from",
              from.toISOString(),
            )
          }

          const response =
            await fetch(
              `/api/ai/history?${params.toString()}`,
              {
                method: "GET",
                cache: "no-store",
              },
            )

          const data =
            (await response.json()) as HistoryApiResponse

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

          const rawConversations =
            Array.isArray(
              data.conversations,
            )
              ? data.conversations
              : Array.isArray(
                    data.items,
                  )
                ? data.items
                : Array.isArray(
                      data.data,
                    )
                  ? data.data
                  : []

          setConversations(
            rawConversations,
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI conversation history.",
          )
        } finally {
          setLoading(false)
        }
      },
      [
        dateRange,
        statusFilter,
      ],
    )

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  const availableModels =
    useMemo(() => {
      return Array.from(
        new Set(
          conversations
            .map(
              (
                conversation,
              ) =>
                conversation.model,
            )
            .filter(
              (
                model,
              ): model is string =>
                Boolean(model),
            ),
        ),
      ).sort()
    }, [conversations])

  const filteredConversations =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return conversations.filter(
        (conversation) => {
          if (
            modelFilter !==
              "all" &&
            conversation.model !==
              modelFilter
          ) {
            return false
          }

          if (
            !query
          ) {
            return true
          }

          const user =
            getUserLabel(
              conversation,
            )

          const preview =
            getConversationPreview(
              conversation,
            )

          return [
            conversation.id,
            conversation.title,
            conversation.model,
            user,
            preview,
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
      conversations,
      modelFilter,
      search,
    ])

  const summary =
    useMemo(() => {
      const totalTokens =
        filteredConversations.reduce(
          (
            total,
            conversation,
          ) =>
            total +
            getConversationTokens(
              conversation,
            ),
          0,
        )

      const estimatedCost =
        filteredConversations.reduce(
          (
            total,
            conversation,
          ) =>
            total +
            getConversationCost(
              conversation,
            ),
          0,
        )

      return {
        conversations:
          filteredConversations.length,
        totalTokens,
        estimatedCost,
        averageTokens:
          filteredConversations.length >
          0
            ? Math.round(
                totalTokens /
                  filteredConversations.length,
              )
            : 0,
      }
    }, [
      filteredConversations,
    ])

  const activeCount =
    useMemo(
      () =>
        filteredConversations.filter(
          (conversation) =>
            conversation.status ===
            "active",
        ).length,
      [filteredConversations],
    )

  const archivedCount =
    useMemo(
      () =>
        filteredConversations.filter(
          (conversation) =>
            conversation.status ===
            "archived",
        ).length,
      [filteredConversations],
    )

  async function deleteConversation(
    conversation: Conversation,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${conversation.title || "this conversation"}"? This cannot be undone.`,
      )

    if (!confirmed) {
      return
    }

    setDeletingId(
      conversation.id,
    )

    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          `/api/ai/conversations/${encodeURIComponent(
            conversation.id,
          )}`,
          {
            method: "DELETE",
          },
        )

      const data =
        (await response.json()) as HistoryApiResponse

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

      setConversations(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              conversation.id,
          ),
      )

      setSelectedConversation(
        null,
      )

      setSuccess(
        "Conversation deleted successfully.",
      )
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to delete conversation.",
      )
    } finally {
      setDeletingId(null)
    }
  }

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
                History
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Conversation History
            </h1>

            <p className="mt-2 max-w-3xl text-slate-600">
              Review AI conversations created by users in
              your organization.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadHistory()
            }
            disabled={loading}
            className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh History"}
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label
              htmlFor="history-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search
            </label>

            <input
              id="history-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search conversations..."
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="history-period"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Period
            </label>

            <select
              id="history-period"
              value={dateRange}
              onChange={(event) =>
                setDateRange(
                  event.target
                    .value as DateRange,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="today">
                Today
              </option>

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
              htmlFor="history-status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="history-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "all"
                    | ConversationStatus,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="archived">
                Archived
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="history-model"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Model
            </label>

            <select
              id="history-model"
              value={modelFilter}
              onChange={(event) =>
                setModelFilter(
                  event.target.value,
                )
              }
              className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                All Models
              </option>

              {availableModels.map(
                (model) => (
                  <option
                    key={model}
                    value={model}
                  >
                    {model}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Conversations
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatNumber(
              summary.conversations,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {formatNumber(
              activeCount,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Archived
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-600">
            {formatNumber(
              archivedCount,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Tokens
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {formatNumber(
              summary.totalTokens,
            )}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Avg. Tokens
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {formatNumber(
              summary.averageTokens,
            )}
          </p>
        </div>
      </section>

      {/* Conversations */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Conversations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {formatNumber(
                filteredConversations.length,
              )}{" "}
              conversations match the current filters.
            </p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : filteredConversations.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ◌
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No conversations found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map(
                (
                  conversation,
                ) => {
                  const user =
                    getUserLabel(
                      conversation,
                    )

                  const tokens =
                    getConversationTokens(
                      conversation,
                    )

                  const preview =
                    getConversationPreview(
                      conversation,
                    )

                  return (
                    <article
                      key={
                        conversation.id
                      }
                      className="rounded-2xl border p-5 transition hover:border-blue-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                            {getInitials(
                              user,
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-bold text-slate-900">
                                {conversation.title ||
                                  "Untitled conversation"}
                              </h3>

                              <span
                                className={
                                  conversation.status ===
                                  "active"
                                    ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                    : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                                }
                              >
                                {conversation.status ===
                                "active"
                                  ? "Active"
                                  : "Archived"}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {user}
                            </p>

                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                              {preview}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-medium text-slate-600">
                                {conversation.model ||
                                  "Default model"}
                              </span>

                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-medium text-slate-600">
                                {formatNumber(
                                  tokens,
                                )}{" "}
                                tokens
                              </span>

                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-medium text-slate-500">
                                {formatDate(
                                  conversation.updatedAt,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 xl:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedConversation(
                                conversation,
                              )
                            }
                            className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </button>

                          <a
                            href={`/ai/chat?conversationId=${encodeURIComponent(
                              conversation.id,
                            )}`}
                            className="rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                          >
                            Open Chat
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              void deleteConversation(
                                conversation,
                              )
                            }
                            disabled={
                              deletingId ===
                              conversation.id
                            }
                            className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId ===
                            conversation.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                },
              )}
            </div>
          )}
        </div>
      </section>

      {/* Conversation details modal */}
      {selectedConversation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="conversation-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div className="min-w-0">
                <h2
                  id="conversation-details-title"
                  className="truncate text-2xl font-bold text-slate-900"
                >
                  {selectedConversation.title ||
                    "Untitled conversation"}
                </h2>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {selectedConversation.model ||
                      "Default model"}
                  </span>

                  <span
                    className={
                      selectedConversation.status ===
                      "active"
                        ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                        : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    }
                  >
                    {
                      selectedConversation.status
                    }
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedConversation(
                    null,
                  )
                }
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="max-h-[calc(90vh-190px)] overflow-y-auto p-6">
              {selectedConversation.messages &&
              selectedConversation.messages.length >
                0 ? (
                <div className="space-y-4">
                  {selectedConversation.messages.map(
                    (message) => {
                      const isUser =
                        message.role ===
                        "user"

                      return (
                        <div
                          key={
                            message.id
                          }
                          className={
                            isUser
                              ? "ml-auto max-w-3xl"
                              : "mr-auto max-w-3xl"
                          }
                        >
                          <div
                            className={
                              isUser
                                ? "rounded-2xl rounded-tr-md bg-blue-600 p-4 text-white"
                                : "rounded-2xl rounded-tl-md bg-slate-100 p-4 text-slate-800"
                            }
                          >
                            <div className="mb-2 flex items-center justify-between gap-4">
                              <span
                                className={
                                  isUser
                                    ? "text-xs font-bold uppercase tracking-wide text-blue-100"
                                    : "text-xs font-bold uppercase tracking-wide text-slate-500"
                                }
                              >
                                {message.role}
                              </span>

                              <span
                                className={
                                  isUser
                                    ? "text-[10px] text-blue-100"
                                    : "text-[10px] text-slate-400"
                                }
                              >
                                {formatDate(
                                  message.createdAt,
                                )}
                              </span>
                            </div>

                            <p className="whitespace-pre-wrap text-sm leading-7">
                              {
                                message.content
                              }
                            </p>
                          </div>

                          {(message.inputTokens !==
                            null ||
                            message.outputTokens !==
                              null ||
                            message.totalTokens !==
                              null) && (
                            <div className="mt-2 flex justify-end gap-2 text-[10px] text-slate-400">
                              {message.inputTokens !==
                                null && (
                                <span>
                                  In:{" "}
                                  {formatNumber(
                                    message.inputTokens,
                                  )}
                                </span>
                              )}

                              {message.outputTokens !==
                                null && (
                                <span>
                                  Out:{" "}
                                  {formatNumber(
                                    message.outputTokens,
                                  )}
                                </span>
                              )}

                              {message.totalTokens !==
                                null && (
                                <span>
                                  Total:{" "}
                                  {formatNumber(
                                    message.totalTokens,
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                  <p className="text-sm text-slate-500">
                    Message details are not included in this
                    history response.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                <span>
                  User:{" "}
                  <strong>
                    {getUserLabel(
                      selectedConversation,
                    )}
                  </strong>
                </span>

                <span className="mx-2">
                  •
                </span>

                <span>
                  Updated{" "}
                  {formatDate(
                    selectedConversation.updatedAt,
                  )}
                </span>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/ai/chat?conversationId=${encodeURIComponent(
                    selectedConversation.id,
                  )}`}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Open Chat
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedConversation(
                      null,
                    )
                  }
                  className="rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}