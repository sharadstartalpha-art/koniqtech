"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useParams, useRouter } from "next/navigation"

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

type ApprovalApiResponse = {
  success?: boolean
  error?: string
  message?: string
  approval?: Approval
  approvals?: Approval[]
  nextAction?: string
}

const STATUS_LABELS: Record<
  ApprovalStatus,
  string
> = {
  pending: "Pending Approval",
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

function isExpired(
  approval: Approval,
) {
  if (
    approval.status !==
    "pending"
  ) {
    return (
      approval.status ===
      "expired"
    )
  }

  if (
    !approval.expiresAt
  ) {
    return false
  }

  return (
    new Date(
      approval.expiresAt,
    ).getTime() <=
    Date.now()
  )
}

function formatJson(
  value: unknown,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "No payload"
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

function getErrorMessage(
  data: ApprovalApiResponse | null,
) {
  return (
    data?.error ||
    data?.message ||
    "Unable to load approval."
  )
}

export default function AiApprovalDetailPage() {
  const params =
    useParams()

  const router =
    useRouter()

  const approvalIdParam =
    params?.approvalId

  const approvalId =
    Array.isArray(
      approvalIdParam,
    )
      ? approvalIdParam[0]
      : approvalIdParam

  const [approval, setApproval] =
    useState<Approval | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [actionLoading, setActionLoading] =
    useState<
      "approve" | "reject" | null
    >(null)

  const [executionLoading, setExecutionLoading] =
    useState(false)

  const [executionResult, setExecutionResult] =
    useState<unknown>(null)

  const [rejectionReason, setRejectionReason] =
    useState("")

  const [showRejectForm, setShowRejectForm] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const loadApproval =
    useCallback(
      async () => {
        if (!approvalId) {
          setError(
            "Approval ID is missing.",
          )
          setLoading(false)
          return
        }

        setLoading(true)
        setError("")

        try {
          /*
           * The approvals endpoint returns organization/user
           * scoped approval data. We request a sufficiently
           * large page and locate the exact approval.
           */
          const response =
            await fetch(
              `/api/ai/approvals?limit=100`,
              {
                method: "GET",
                cache: "no-store",
              },
            )

          const data =
            (await response.json()) as ApprovalApiResponse

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

          const found =
            Array.isArray(
              data.approvals,
            )
              ? data.approvals.find(
                  (item) =>
                    item.id ===
                    approvalId,
                )
              : null

          if (!found) {
            throw new Error(
              "Approval request was not found or is no longer accessible.",
            )
          }

          setApproval(found)
        } catch (
          caughtError
        ) {
          setError(
            caughtError instanceof
              Error
              ? caughtError.message
              : "Unable to load approval.",
          )
        } finally {
          setLoading(false)
        }
      },
      [approvalId],
    )

  useEffect(() => {
    void loadApproval()
  }, [loadApproval])

  const effectiveStatus =
    useMemo<ApprovalStatus | null>(
      () => {
        if (!approval) {
          return null
        }

        if (
          isExpired(
            approval,
          )
        ) {
          return "expired"
        }

        return approval.status
      },
      [approval],
    )

  const canApprove =
    Boolean(
      approval &&
        effectiveStatus ===
          "pending" &&
        !actionLoading &&
        !executionLoading,
    )

  async function updateApproval(
    action:
      | "approve"
      | "reject",
  ) {
    if (!approval) {
      return
    }

    if (
      effectiveStatus !==
      "pending"
    ) {
      setError(
        "This approval request is no longer pending.",
      )
      return
    }

    if (
      action === "reject" &&
      !rejectionReason.trim()
    ) {
      setError(
        "Please provide a rejection reason.",
      )
      return
    }

    setActionLoading(
      action,
    )

    setError("")
    setSuccess("")
    setExecutionResult(null)

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
                      rejectionReason.trim(),
                  }
                : {}),
            }),
          },
        )

      const data =
        (await response.json()) as ApprovalApiResponse

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

      if (
        action === "approve"
      ) {
        setSuccess(
          "Approval granted. The requested action has NOT been executed yet.",
        )

        /*
         * Approval and execution are deliberately separate.
         * The backend returns nextAction:
         * "execute_approved_tool".
         */
        setApproval(
          (current) =>
            current
              ? {
                  ...current,
                  status:
                    "approved",
                  approvedAt:
                    new Date().toISOString(),
                }
              : current,
        )
      } else {
        setSuccess(
          "Approval request rejected.",
        )

        setApproval(
          (current) =>
            current
              ? {
                  ...current,
                  status:
                    "rejected",
                  rejectedAt:
                    new Date().toISOString(),
                }
              : current,
        )

        setShowRejectForm(
          false,
        )
      }
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : `Unable to ${action} approval.`,
      )
    } finally {
      setActionLoading(
        null,
      )
    }
  }

  async function executeApprovedAction() {
    if (!approval) {
      return
    }

    if (
      approval.status !==
      "approved"
    ) {
      setError(
        "Only an approved request can be executed.",
      )
      return
    }

    setExecutionLoading(
      true,
    )

    setError("")
    setSuccess("")
    setExecutionResult(null)

    try {
      /*
       * The execute endpoint receives the approval ID.
       * The backend retrieves the original approved payload
       * rather than trusting a modified browser payload.
       */
      const response =
        await fetch(
          "/api/ai/execute",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              approvalId:
                approval.id,
            }),
          },
        )

      const data =
        (await response.json()) as Record<
          string,
          unknown
        >

      if (
        !response.ok
      ) {
        const message =
          typeof data.error ===
          "string"
            ? data.error
            : typeof data.message ===
                "string"
              ? data.message
              : "Unable to execute approved action."

        throw new Error(
          message,
        )
      }

      setExecutionResult(
        data,
      )

      setSuccess(
        "Approved action executed successfully.",
      )

      await loadApproval()
    } catch (
      caughtError
    ) {
      setError(
        caughtError instanceof
          Error
          ? caughtError.message
          : "Unable to execute approved action.",
      )
    } finally {
      setExecutionLoading(
        false,
      )
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl space-y-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />

        <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
      </main>
    )
  }

  if (!approval) {
    return (
      <main className="mx-auto max-w-5xl">
        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
            !
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Approval Not Found
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {error ||
              "This approval request could not be found or you do not have access to it."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/settings/ai/approvals",
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Approvals
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
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

              <a
                href="/settings/ai/approvals"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Approvals
              </a>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Details
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Approval Request
            </h1>

            <p className="mt-2 break-all font-mono text-xs text-slate-400">
              {approval.id}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              effectiveStatus
                ? STATUS_CLASSES[
                    effectiveStatus
                  ]
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {effectiveStatus
              ? STATUS_LABELS[
                  effectiveStatus
                ]
              : "Unknown"}
          </span>
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

      {success && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}

      {/* Action summary */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Requested Action
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review exactly what the AI agent requested before
            approving execution.
          </p>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Action Type
            </p>

            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800">
              {approval.actionType}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Requested By
            </p>

            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800">
              {approval.userId}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {approval.description ||
                "No description provided."}
            </p>
          </div>

          {approval.conversationId && (
            <div className="rounded-2xl bg-slate-50 p-5 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Conversation ID
              </p>

              <p className="mt-2 break-all font-mono text-xs text-slate-700">
                {
                  approval.conversationId
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Payload */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Action Payload
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This is the data associated with the approval
            request. The execution API uses the server-side
            approved payload.
          </p>
        </div>

        <div className="p-6">
          <pre className="max-h-[500px] overflow-auto rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
            {formatJson(
              approval.payload,
            )}
          </pre>
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Approval Timeline
          </h2>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Created
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
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
              className={`mt-2 text-sm font-medium ${
                effectiveStatus ===
                "expired"
                  ? "text-red-600"
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
              Decision
            </p>

            <p className="mt-2 text-sm font-medium text-slate-700">
              {approval.status ===
              "approved"
                ? formatDate(
                    approval.approvedAt,
                  )
                : approval.status ===
                    "rejected"
                  ? formatDate(
                      approval.rejectedAt,
                    )
                  : "Awaiting decision"}
            </p>
          </div>
        </div>
      </section>

      {/* Security notice */}
      {effectiveStatus ===
        "pending" && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-700">
              !
            </div>

            <div>
              <h2 className="font-bold text-amber-900">
                Review Before Approval
              </h2>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Approving this request authorizes the
                associated action to be executed. Verify the
                action type, description, and payload before
                continuing.
              </p>

              {approval.expiresAt && (
                <p className="mt-2 text-xs font-semibold text-amber-700">
                  This request expires on{" "}
                  {formatDate(
                    approval.expiresAt,
                  )}
                  .
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reject form */}
      {showRejectForm &&
        effectiveStatus ===
          "pending" && (
          <section className="rounded-3xl border border-red-200 bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Reject Approval
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Provide a reason for rejecting this action.
              </p>
            </div>

            <div className="p-6">
              <textarea
                value={
                  rejectionReason
                }
                onChange={(event) =>
                  setRejectionReason(
                    event.target
                      .value,
                  )
                }
                rows={5}
                maxLength={1000}
                placeholder="Explain why this action should not be executed..."
                className="w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowRejectForm(
                      false,
                    )
                    setRejectionReason(
                      "",
                    )
                  }}
                  disabled={
                    actionLoading !==
                    null
                  }
                  className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void updateApproval(
                      "reject",
                    )
                  }
                  disabled={
                    actionLoading !==
                    null
                  }
                  className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {actionLoading ===
                  "reject"
                    ? "Rejecting..."
                    : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </section>
        )}

      {/* Actions */}
      <section className="rounded-3xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Approval Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Approval and execution are intentionally separate
              security steps.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {effectiveStatus ===
              "pending" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setShowRejectForm(
                      true,
                    )
                  }
                  disabled={
                    actionLoading !==
                    null
                  }
                  className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void updateApproval(
                      "approve",
                    )
                  }
                  disabled={
                    !canApprove
                  }
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {actionLoading ===
                  "approve"
                    ? "Approving..."
                    : "Approve Action"}
                </button>
              </>
            )}

            {effectiveStatus ===
              "approved" && (
              <button
                type="button"
                onClick={() =>
                  void executeApprovedAction()
                }
                disabled={
                  executionLoading
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {executionLoading
                  ? "Executing..."
                  : "Execute Approved Action"}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/settings/ai/approvals",
                )
              }
              className="rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Approvals
            </button>
          </div>
        </div>
      </section>

      {/* Execution result */}
      {executionResult !==
        null && (
        <section className="rounded-3xl border border-emerald-200 bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Execution Result
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Server response from the approved tool execution.
            </p>
          </div>

          <div className="p-6">
            <pre className="max-h-[500px] overflow-auto rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
              {formatJson(
                executionResult,
              )}
            </pre>
          </div>
        </section>
      )}

      {/* Footer */}
      <section className="pb-8 text-center">
        <p className="text-xs leading-5 text-slate-400">
          Approval ID:{" "}
          <span className="font-mono">
            {approval.id}
          </span>
        </p>
      </section>
    </main>
  )
}