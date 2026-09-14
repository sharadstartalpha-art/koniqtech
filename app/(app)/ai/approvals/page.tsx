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

type Approval = {
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
  approvals?: Approval[]
  approval?: Approval
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

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleString()
}

function isExpired(
  approval: Approval,
) {
  if (
    approval.status !== "pending" ||
    !approval.expiresAt
  ) {
    return false
  }

  return (
    new Date(
      approval.expiresAt,
    ).getTime() <= Date.now()
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
    return String(payload)
  }
}

export default function AiApprovalsPage() {
  const [approvals, setApprovals] =
    useState<Approval[]>([])

  const [loading, setLoading] =
    useState(true)

  const [processingId, setProcessingId] =
    useState<string | null>(null)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<"all" | ApprovalStatus>(
      "pending",
    )

  const [selectedApproval, setSelectedApproval] =
    useState<Approval | null>(null)

  const loadApprovals =
    useCallback(async () => {
      setLoading(true)
      setError("")

      try {
        const query =
          statusFilter === "all"
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
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load AI approvals.",
        )
      } finally {
        setLoading(false)
      }
    }, [statusFilter])

  useEffect(() => {
    void loadApprovals()
  }, [loadApprovals])

  const pendingCount =
    useMemo(
      () =>
        approvals.filter(
          (approval) =>
            approval.status ===
              "pending" &&
            !isExpired(approval),
        ).length,
      [approvals],
    )

  const expiredCount =
    useMemo(
      () =>
        approvals.filter(
          (approval) =>
            approval.status ===
              "expired" ||
            isExpired(approval),
        ).length,
      [approvals],
    )

  async function handleDecision(
    approval: Approval,
    action: "approve" | "reject",
  ) {
    if (
      processingId ||
      approval.status !== "pending" ||
      isExpired(approval)
    ) {
      return
    }

    let reason: string | undefined

    if (action === "reject") {
      const enteredReason =
        window.prompt(
          "Optional rejection reason:",
        )

      if (
        enteredReason !== null
      ) {
        reason =
          enteredReason.trim() ||
          undefined
      }
    }

    if (action === "approve") {
      const confirmed =
        window.confirm(
          `Approve "${approval.actionType}"?`,
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
              ...(reason
                ? { reason }
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
              ? "Unable to approve this action."
              : "Unable to reject this action.",
          ),
        )
      }

      if (
        action === "approve"
      ) {
        setSuccess(
          "Action approved. It can now proceed through the execution safety flow.",
        )
      } else {
        setSuccess(
          "Action rejected successfully.",
        )
      }

      setSelectedApproval(
        null,
      )

      await loadApprovals()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to process approval.",
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm">
              <a
                href="/ai"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                AI
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
              Review AI actions that require explicit
              approval before they can be executed.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadApprovals()
            }
            disabled={loading}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading
              ? "Refreshing..."
              : "Refresh"}
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

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending Approval
          </p>

          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Actions waiting for your decision
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Expired
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-500">
            {expiredCount}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Actions that can no longer be approved
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Showing
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {approvals.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Approval records
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
              Only actions belonging to your organization
              are returned by the secure API.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
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
                    className="h-32 animate-pulse rounded-2xl bg-slate-100"
                  />
                ),
              )}
            </div>
          ) : approvals.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No approvals found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {statusFilter ===
                "pending"
                  ? "There are currently no AI actions waiting for approval."
                  : "No approval records match the selected filter."}
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

                  const actionable =
                    approval.status ===
                      "pending" &&
                    !expired

                  return (
                    <article
                      key={approval.id}
                      className={`rounded-2xl border p-5 ${
                        actionable
                          ? "border-amber-200 bg-amber-50/30"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {
                                approval.actionType
                              }
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                expired
                                  ? "bg-slate-100 text-slate-500"
                                  : approval.status ===
                                      "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : approval.status ===
                                        "approved"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : approval.status ===
                                          "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {expired
                                ? "Expired"
                                : STATUS_LABELS[
                                    approval.status
                                  ]}
                            </span>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {
                              approval.description
                            }
                          </p>

                          <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Created
                              </dt>

                              <dd className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.createdAt,
                                )}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Expires
                              </dt>

                              <dd className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.expiresAt,
                                )}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Approved
                              </dt>

                              <dd className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.approvedAt,
                                )}
                              </dd>
                            </div>

                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Rejected
                              </dt>

                              <dd className="mt-1 text-sm text-slate-700">
                                {formatDate(
                                  approval.rejectedAt,
                                )}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApproval(
                                approval,
                              )
                            }
                            className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View Details
                          </button>

                          {actionable && (
                            <>
                              <button
                                type="button"
                                disabled={
                                  processingId !==
                                    null
                                }
                                onClick={() =>
                                  void handleDecision(
                                    approval,
                                    "reject",
                                  )
                                }
                                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {processingId ===
                                approval.id
                                  ? "Processing..."
                                  : "Reject"}
                              </button>

                              <button
                                type="button"
                                disabled={
                                  processingId !==
                                    null
                                }
                                onClick={() =>
                                  void handleDecision(
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
              <div>
                <h2
                  id="approval-details-title"
                  className="text-2xl font-bold text-slate-900"
                >
                  Approval Details
                </h2>

                <p className="mt-1 font-mono text-xs text-slate-400">
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
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Requested Action
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {
                    selectedApproval.actionType
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <div className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {
                    selectedApproval.description
                  }
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Action Payload
                  </p>

                  <span className="text-xs text-slate-400">
                    Read-only
                  </span>
                </div>

                <pre className="mt-2 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
                  {formatPayload(
                    selectedApproval.payload,
                  )}
                </pre>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {isExpired(
                      selectedApproval,
                    )
                      ? "Expired"
                      : STATUS_LABELS[
                          selectedApproval.status
                        ]}
                  </p>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Expires
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(
                      selectedApproval.expiresAt,
                    )}
                  </p>
                </div>
              </div>

              {selectedApproval.conversationId && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Conversation
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-600">
                    {
                      selectedApproval.conversationId
                    }
                  </p>
                </div>
              )}

              {selectedApproval.status ===
                "pending" &&
                !isExpired(
                  selectedApproval,
                ) && (
                  <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={
                        processingId !==
                        null
                      }
                      onClick={() =>
                        void handleDecision(
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
                        void handleDecision(
                          selectedApproval,
                          "approve",
                        )
                      }
                      className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300"
                    >
                      Approve Action
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}