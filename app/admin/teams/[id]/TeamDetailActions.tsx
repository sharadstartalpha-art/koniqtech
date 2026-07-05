"use client"

import {
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  AlertTriangle,
  Loader2,
  Power,
  Trash2,
  X
} from "lucide-react"

import {
  deleteTeamAction,
  toggleTeamStatusAction
} from "../actions"

/* =========================================================
   PROPS
========================================================= */

type Props = {
  teamId: string
  teamName: string
  active: boolean
  invitationCount: number
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TeamDetailActions({
  teamId,
  teamName,
  active,
  invitationCount
}: Props) {
  const router = useRouter()

  const [
    isPending,
    startTransition
  ] = useTransition()

  const [
    showDeleteDialog,
    setShowDeleteDialog
  ] = useState(false)

  const [
    error,
    setError
  ] = useState("")

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  function handleToggleStatus() {
    setError("")

    startTransition(async () => {
      const result =
        await toggleTeamStatusAction(
          teamId
        )

      if (!result.success) {
        setError(result.message)
        return
      }

      router.refresh()
    })
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete() {
    setError("")

    startTransition(async () => {
      const result =
        await deleteTeamAction(teamId)

      if (!result.success) {
        setError(result.message)
        setShowDeleteDialog(false)
        return
      }

      router.push("/admin/teams")
      router.refresh()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggleStatus}
        disabled={isPending}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
          active
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Power className="h-4 w-4" />
        )}

        {active
          ? "Deactivate"
          : "Activate"}
      </button>

      <button
        type="button"
        onClick={() => {
          setError("")
          setShowDeleteDialog(true)
        }}
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />

        Delete
      </button>

      {/* ERROR */}

      {error && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg">
          {error}
        </div>
      )}

      {/* DELETE DIALOG */}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">
                    Delete Team
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteDialog(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900">
                  {teamName}
                </span>
                ?
              </p>

              {invitationCount > 0 && (
                <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
                  This team currently has{" "}
                  <strong>
                    {invitationCount}
                  </strong>{" "}
                  linked invitation
                  {invitationCount === 1
                    ? ""
                    : "s"}
                  . Your server action will prevent
                  deletion until those records are
                  resolved.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/70 p-4">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteDialog(false)
                }
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  isPending ||
                  invitationCount > 0
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Team
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}