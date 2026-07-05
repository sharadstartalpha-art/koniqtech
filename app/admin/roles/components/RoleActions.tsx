"use client"

import Link from "next/link"

import {
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  AlertCircle,
  AlertTriangle,
  Eye,
  Loader2,
  Pencil,
  Trash2,
  Users,
  X
} from "lucide-react"

import {
  deleteRoleAction
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type RoleActionsProps = {
  roleId: string

  roleName: string

  employeeCount: number

  canManage: boolean

  variant?: "buttons" | "compact"
}

/* =========================================================
   COMPONENT
========================================================= */

export default function RoleActions({
  roleId,
  roleName,
  employeeCount,
  canManage,
  variant = "buttons"
}: RoleActionsProps) {
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
     DERIVED VALUES
  ======================================================= */

  const hasAssignedEmployees =
    employeeCount > 0

  const isProtectedRole =
    roleName.trim().toLowerCase() ===
    "super admin"

  const deleteBlocked =
    hasAssignedEmployees ||
    isProtectedRole

  /* =======================================================
     OPEN DIALOG
  ======================================================= */

  function openDeleteDialog() {
    setError("")
    setShowDeleteDialog(true)
  }

  /* =======================================================
     CLOSE DIALOG
  ======================================================= */

  function closeDeleteDialog() {
    if (isPending) {
      return
    }

    setError("")
    setShowDeleteDialog(false)
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete() {
    if (deleteBlocked) {
      return
    }

    setError("")

    startTransition(async () => {
      try {
        const result =
          await deleteRoleAction(
            roleId
          )

        if (!result.success) {
          setError(
            result.errors?.general ||
              result.message ||
              "Unable to delete the role."
          )

          return
        }

        setShowDeleteDialog(false)

        router.push(
          "/admin/roles"
        )

        router.refresh()
      } catch (error) {
        console.error(
          "DELETE_ROLE_CLIENT_ERROR:",
          error
        )

        setError(
          "Something went wrong while deleting the employee role."
        )
      }
    })
  }

  /* =======================================================
     COMPACT VERSION
  ======================================================= */

  if (variant === "compact") {
    return (
      <>
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/roles/${roleId}`}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <Eye className="h-3.5 w-3.5" />

            View
          </Link>

          {canManage && (
            <>
              <Link
                href={`/admin/roles/${roleId}/edit`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-50 px-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
              >
                <Pencil className="h-3.5 w-3.5" />

                Edit
              </Link>

              <button
                type="button"
                onClick={openDeleteDialog}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />

                Delete
              </button>
            </>
          )}
        </div>

        <DeleteDialog
          open={showDeleteDialog}
          roleName={roleName}
          employeeCount={employeeCount}
          isProtectedRole={isProtectedRole}
          isPending={isPending}
          error={error}
          onClose={closeDeleteDialog}
          onDelete={handleDelete}
        />
      </>
    )
  }

  /* =======================================================
     STANDARD BUTTON VERSION
  ======================================================= */

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/roles/${roleId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Eye className="h-4 w-4" />

          View Role
        </Link>

        {canManage && (
          <>
            <Link
              href={`/admin/roles/${roleId}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Pencil className="h-4 w-4" />

              Edit Role
            </Link>

            <button
              type="button"
              onClick={openDeleteDialog}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />

              Delete Role
            </button>
          </>
        )}
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        roleName={roleName}
        employeeCount={employeeCount}
        isProtectedRole={isProtectedRole}
        isPending={isPending}
        error={error}
        onClose={closeDeleteDialog}
        onDelete={handleDelete}
      />
    </>
  )
}

/* =========================================================
   DELETE DIALOG
========================================================= */

function DeleteDialog({
  open,
  roleName,
  employeeCount,
  isProtectedRole,
  isPending,
  error,
  onClose,
  onDelete
}: {
  open: boolean

  roleName: string

  employeeCount: number

  isProtectedRole: boolean

  isPending: boolean

  error: string

  onClose: () => void

  onDelete: () => void
}) {
  if (!open) {
    return null
  }

  const hasAssignedEmployees =
    employeeCount > 0

  const deleteBlocked =
    hasAssignedEmployees ||
    isProtectedRole

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-role-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="delete-role-title"
                className="font-semibold text-slate-950"
              >
                Delete Employee Role
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the role dependencies before deletion.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close delete dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="space-y-4 p-5">
          <p className="text-sm leading-6 text-slate-600">
            You are about to delete{" "}
            <span className="font-semibold text-slate-950">
              {roleName}
            </span>
            .
          </p>

          {/* PROTECTED ROLE */}

          {isProtectedRole && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Protected system role
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  The Super Admin role is protected and cannot
                  be deleted.
                </p>
              </div>
            </div>
          )}

          {/* ASSIGNED EMPLOYEES */}

          {hasAssignedEmployees && (
            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

              <div>
                <p className="text-sm font-semibold text-orange-900">
                  Employees are assigned
                </p>

                <p className="mt-1 text-sm leading-6 text-orange-700">
                  This role currently has{" "}
                  <strong>
                    {employeeCount}
                  </strong>{" "}
                  assigned employee
                  {employeeCount === 1
                    ? ""
                    : "s"}
                  . Reassign them to another role before
                  deleting this role.
                </p>
              </div>
            </div>
          )}

          {/* SAFE TO DELETE */}

          {!deleteBlocked && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                This action cannot be undone
              </p>

              <p className="mt-1 text-sm leading-6 text-red-700">
                The role configuration and its permissions will
                be permanently removed.
              </p>
            </div>
          )}

          {/* SERVER ERROR */}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={
              isPending ||
              deleteBlocked
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

                Delete Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}