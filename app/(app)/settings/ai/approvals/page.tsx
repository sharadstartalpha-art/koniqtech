"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"

type AiApproval = {
  id: string
  orgId: string
  conversationId: string | null
  userId: string
  actionType: string
  description: string
  payload: unknown
  status: ApprovalStatus
  approvedAt: string | null
  rejectedAt: string | null
  expiresAt: string | null
  createdAt: string
}

type ApiResponse = {
  success?: boolean
  error?: string
  message?: string
  approvals?: AiApproval[]
  approval?: AiApproval
  nextAction?: string
}

const STATUS_LABELS: Record<
  ApprovalStatus,
  string
> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired",
}

const STATUS_CLASSES: Record<
  ApprovalStatus,
  string
> = {
  pending:
    "bg-amber-100 text-amber-700",
  approved:
    "bg-emerald-100 text-emerald-700",
  rejected:
    "bg-red-100 text-red-700",
  expired:
    "bg-slate-100 text-slate-600",
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

function getErrorMessage(
  data: ApiResponse | null,
  fallback: string,
) {
  return (
    data?.error ||
    data?.message ||
    fallback
  )
}

function isExpired(
  approval: AiApproval,
) {
  if (
    approval.status !==
    "pending"
  ) {
    return false
  }

  if (!approval.expiresAt) {
    return false
  }

  return (
    new Date(
      approval.expiresAt,
    ).getTime() <
    Date.now()
  )
}

function formatPayload(
  payload: unknown,
) {
  if (
    payload === null ||
    payload === undefined
  ) {
    return "No action payload."
  }

  try {
    return JSON.stringify(
      payload,
      null,
      2,
    )
  } catch {
    return "Unable to display action payload."
  }
}

export default function AiApprovalsPage() {
  const [approvals, setApprovals] =
    useState<AiApproval[]>([])

  const [loading, setLoading] =
    useState(true)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | ApprovalStatus
    >("pending")

  const [selectedApproval, setSelectedApproval] =
    useState<AiApproval | null>(
      null,
    )

  const loadApprovals =
    useCallback(
      async () => {
        setLoading(true)
        setError("")

        try {
          const query =
            statusFilter ===
            "all"
              ? ""
              : `?status=${encodeURIComponent(
                  statusFilter,
                )}`

          const response =
            await fetch(
              `/api/ai/approvals${query}`,
              {
                method: "GET",
                cache: "no-store",
              },
            )

          const data =
            (await response.json()) as ApiResponse

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              getErrorMessage(
                data,
                "Unable to load AI approvals.",
              ),
            )
          }

          setApprovals(
            Array.isArray(
              data.approvals,
            )
              ? data.approvals
              : [],
          )
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load AI approvals.",
          )
        } finally {
          setLoading(false)
        }
      },
      [statusFilter],
    )

  useEffect(() => {
    void loadApprovals()
  }, [loadApprovals])

  const counts =
    useMemo(() => {
      return {
        total:
          approvals.length,

        pending:
          approvals.filter(
            (approval) =>
              approval.status ===
              "pending",
          ).length,

        approved:
          approvals.filter(
            (approval) =>
              approval.status ===
              "approved",
          ).length,

        rejected:
          approvals.filter(
            (approval) =>
              approval.status ===
              "rejected",
          ).length,

        expired:
          approvals.filter(
            (approval) =>
              approval.status ===
              "expired",
          ).length,
      }
    }, [approvals])

  async function handleAction(
    approval: AiApproval,
    action: "approve" | "reject",
  ) {
    if (
      approval.status !==
      "pending"
    ) {
      return
    }

    if (
      action === "approve" &&
      isExpired(approval)
    ) {
      setError(
        "This approval has expired and cannot be approved.",
      )
      return
    }

    if (
      action === "reject"
    ) {
      const confirmed =
        window.confirm(
          `Reject this AI action?\n\n${approval.description}`,
        )

      if (!confirmed) {
        return
      }
    }

    setProcessingId(
      approval.id,
    )
    setError("")
    setSuccess("")

    try {
      const response =
        await fetch(
          "/api/ai/approvals",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              approvalId:
                approval.id,
              action,
              ...(action ===
              "reject"
                ? {
                    reason:
                      "Rejected from AI approval dashboard.",
                  }
                : {}),
            }),
          },
        )

      const data =
        (await response.json()) as ApiResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          getErrorMessage(
            data,
            action ===
              "approve"
              ? "Unable to approve AI action."
              : "Unable to reject AI action.",
          ),
        )
      }

      if (
        action ===
        "approve"
      ) {
        setSuccess(
          "AI action approved. It is now eligible for the execution step.",
        )
      } else {
        setSuccess(
          "AI action rejected successfully.",
        )
      }

      setSelectedApproval(
        null,
      )

      await loadApprovals()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : action ===
              "approve"
            ? "Unable to approve AI action."
            : "Unable to reject AI action.",
      )
    } finally {
      setProcessingId(
        null,
      )
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
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
                Approvals
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              AI Approvals
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Review AI actions before they are allowed to
              execute. Approved actions still require the
              server-side execution validation.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadApprovals()
            }
            disabled={loading}
            className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {counts.total}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-700">
            {counts.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-700">
            Approved
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {counts.approved}
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-red-700">
            Rejected
          </p>

          <p className="mt-2 text-3xl font-bold text-red-700">
            {counts.rejected}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Expired
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-500">
            {counts.expired}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Approval Queue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review each proposed action before execution.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as
                  | "all"
                  | ApprovalStatus,
              )
            }
            className="rounded-xl border px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
            </option>

            <option value="expired">
              Expired
            </option>

            <option value="all">
              All
            </option>
          </select>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : approvals.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No approvals found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are no AI actions matching the
                selected status.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvals.map(
                (approval) => {
                  const expired =
                    isExpired(
                      approval,
                    )

                  const pending =
                    approval.status ===
                      "pending" &&
                    !expired

                  return (
                    <article
                      key={
                        approval.id
                      }
                      className="rounded-2xl border p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">
                              {
                                approval.actionType
                              }
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                expired
                                  ? STATUS_CLASSES.expired
                                  : STATUS_CLASSES[
                                      approval.status
                                    ]
                              }`}
                            >
                              {expired
                                ? "Expired"
                                : STATUS_LABELS[
                                    approval.status
                                  ]}
                            </span>
                          </div>

                          <p className="mt-3 leading-6 text-slate-700">
                            {
                              approval.description
                            }
                          </p>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Created
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.createdAt,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Expires
                              </p>

                              <p
                                className={`mt-1 text-sm ${
                                  expired
                                    ? "font-semibold text-red-600"
                                    : "text-slate-700"
                                }`}
                              >
                                {formatDate(
                                  approval.expiresAt,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Approved
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.approvedAt,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Rejected
                              </p>

                              <p className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.rejectedAt,
                                )}
                              </p>
                            </div>
                          </div>

                          {approval.conversationId && (
                            <p className="mt-4 break-all font-mono text-xs text-slate-400">
                              Conversation:{" "}
                              {
                                approval.conversationId
                              }
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApproval(
                                approval,
                              )
                            }
                            className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Details
                          </button>

                          {pending && (
                            <>
                              <button
                                type="button"
                                disabled={
                                  processingId !==
                                  null
                                }
                                onClick={() =>
                                  void handleAction(
                                    approval,
                                    "reject",
                                  )
                                }
                                className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                Reject
                              </button>

                              <button
                                type="button"
                                disabled={
                                  processingId !==
                                  null
                                }
                                onClick={() =>
                                  void handleAction(
                                    approval,
                                    "approve",
                                  )
                                }
                                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                              >
                                {processingId ===
                                approval.id
                                  ? "Processing..."
                                  : "Approve"}
                              </button>
                            </>
                          )}
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

      {selectedApproval && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approval-details-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b p-6">
              <div className="min-w-0">
                <h2
                  id="approval-details-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  AI Action Approval
                </h2>

                <p className="mt-1 break-all font-mono text-xs text-slate-400">
                  {selectedApproval.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApproval(
                    null,
                  )
                }
                className="rounded-xl p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {
                    selectedApproval.actionType
                  }
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isExpired(
                      selectedApproval,
                    )
                      ? STATUS_CLASSES.expired
                      : STATUS_CLASSES[
                          selectedApproval.status
                        ]
                  }`}
                >
                  {isExpired(
                    selectedApproval,
                  )
                    ? "Expired"
                    : STATUS_LABELS[
                        selectedApproval.status
                      ]}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Proposed Action
                </p>

                <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-800">
                  {
                    selectedApproval.description
                  }
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action Payload
                  </p>

                  <span className="text-xs text-slate-400">
                    Server-validated before execution
                  </span>
                </div>

                <pre className="mt-2 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-100">
                  {formatPayload(
                    selectedApproval.payload,
                  )}
                </pre>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedApproval.createdAt,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Expires
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedApproval.expiresAt,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Approved At
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedApproval.approvedAt,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Rejected At
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(
                      selectedApproval.rejectedAt,
                    )}
                  </p>
                </div>
              </div>

              {selectedApproval.status ===
                "pending" &&
                !isExpired(
                  selectedApproval,
                ) && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="font-semibold text-amber-800">
                      Review carefully before approving
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-700">
                      Approval authorizes the action to
                      proceed to the separate execution
                      endpoint. The server performs another
                      authorization and ownership check before
                      execution.
                    </p>
                  </div>
                )}

              <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedApproval(
                      null,
                    )
                  }
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                {selectedApproval.status ===
                  "pending" &&
                  !isExpired(
                    selectedApproval,
                  ) && (
                    <>
                      <button
                        type="button"
                        disabled={
                          processingId !==
                          null
                        }
                        onClick={() =>
                          void handleAction(
                            selectedApproval,
                            "reject",
                          )
                        }
                        className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject Action
                      </button>

                      <button
                        type="button"
                        disabled={
                          processingId !==
                          null
                        }
                        onClick={() =>
                          void handleAction(
                            selectedApproval,
                            "approve",
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {processingId ===
                        selectedApproval.id
                          ? "Approving..."
                          : "Approve Action"}
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}