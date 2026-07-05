import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  Users
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  updateRoleAction
} from "../../actions"

import RoleForm, {
  type RoleFormValues
} from "../../components/RoleForm"

export const dynamic = "force-dynamic"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   ACCESS CONTROL
========================================================= */

const ROLE_MANAGEMENT_ROLES = new Set([
  "super_admin"
])

/* =========================================================
   PAGE
========================================================= */

export default async function EditRolePage({
  params
}: PageProps) {
  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  /* =======================================================
     AUTHORIZATION
  ======================================================= */

  const currentRole = String(
    session.user.role ?? ""
  )

  if (
    !ROLE_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/roles")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const { id } = await params

  /* =======================================================
     LOAD ROLE

     EmployeeRole is internal and platform-wide.

     It intentionally has no orgId filter because this module
     manages KoniqTech's own internal staff role definitions.
  ======================================================= */

  const roleRecord =
    await prisma.employeeRole.findUnique({
      where: {
        id
      },

      select: {
        id: true,
        name: true,
        description: true,

        canCreate: true,
        canEdit: true,
        canDelete: true,
        canApprove: true,
        canAssign: true,
        canExport: true,

        createdAt: true,

        _count: {
          select: {
            employees: true
          }
        }
      }
    })

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!roleRecord) {
    notFound()
  }

  /* =======================================================
     FORM DATA
  ======================================================= */

  const role: RoleFormValues = {
    id:
      roleRecord.id,

    name:
      roleRecord.name,

    description:
      roleRecord.description,

    canCreate:
      roleRecord.canCreate,

    canEdit:
      roleRecord.canEdit,

    canDelete:
      roleRecord.canDelete,

    canApprove:
      roleRecord.canApprove,

    canAssign:
      roleRecord.canAssign,

    canExport:
      roleRecord.canExport
  }

  /* =======================================================
     PERMISSION SUMMARY
  ======================================================= */

  const enabledPermissionCount = [
    roleRecord.canCreate,
    roleRecord.canEdit,
    roleRecord.canDelete,
    roleRecord.canApprove,
    roleRecord.canAssign,
    roleRecord.canExport
  ].filter(Boolean).length

  const accessLevel =
    getAccessLevel(
      enabledPermissionCount
    )

  /* =======================================================
     BOUND UPDATE ACTION

     Original action:

     updateRoleAction(
       roleId: string,
       formData: FormData
     )

     RoleForm requires:

     action(
       formData: FormData
     )

     Binding roleRecord.id creates the correct function
     signature for RoleForm.
  ======================================================= */

  const updateAction =
    updateRoleAction.bind(
      null,
      roleRecord.id
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        href={`/admin/roles/${roleRecord.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Role
      </Link>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Pencil className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Edit Employee Role
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Update the internal role identity and operational
              permissions for KoniqTech staff.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${accessLevel.className}`}
        >
          <ShieldCheck className="h-4 w-4" />

          {accessLevel.label}
        </span>
      </div>

      {/* ===================================================
          CURRENT ROLE SUMMARY
      =================================================== */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <p className="font-semibold text-blue-950">
                {roleRecord.name}
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-700">
                {roleRecord.description ||
                  "No description has been provided for this role."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <SummaryBox
              label="Assigned Staff"
              value={
                roleRecord._count.employees
              }
              variant="blue"
              icon={
                <Users className="h-4 w-4" />
              }
            />

            <SummaryBox
              label="Permissions"
              value={`${enabledPermissionCount}/6`}
              variant="green"
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          WARNING FOR ASSIGNED ROLE
      =================================================== */}

      {roleRecord._count.employees > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <Users className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

          <div>
            <p className="text-sm font-semibold text-orange-900">
              Role currently assigned to staff
            </p>

            <p className="mt-1 text-sm leading-6 text-orange-700">
              Changes to this role&apos;s permissions will affect{" "}
              <strong>
                {roleRecord._count.employees}
              </strong>{" "}
              assigned employee
              {roleRecord._count.employees === 1
                ? ""
                : "s"}
              . Review permission changes carefully before saving.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          FORM
      =================================================== */}

      <RoleForm
        mode="edit"
        role={role}
        action={updateAction}
      />
    </div>
  )
}

/* =========================================================
   SUMMARY BOX
========================================================= */

function SummaryBox({
  label,
  value,
  variant,
  icon
}: {
  label: string

  value: string | number

  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"

  icon: React.ReactNode
}) {
  const styles = {
    blue:
      "border-blue-200 text-blue-700",

    green:
      "border-green-200 text-green-700",

    orange:
      "border-orange-200 text-orange-700",

    red:
      "border-red-200 text-red-700"
  }

  return (
    <div
      className={`min-w-32 rounded-lg border bg-white px-4 py-3 ${styles[variant]}`}
    >
      <div className="flex items-center gap-2">
        {icon}

        <span className="text-lg font-bold">
          {value}
        </span>
      </div>

      <p className="mt-1 text-[11px] font-medium text-slate-500">
        {label}
      </p>
    </div>
  )
}

/* =========================================================
   ACCESS LEVEL
========================================================= */

function getAccessLevel(
  permissionCount: number
) {
  if (permissionCount === 6) {
    return {
      label: "Full Control",
      className:
        "border-red-200 bg-red-50 text-red-700"
    }
  }

  if (permissionCount >= 4) {
    return {
      label: "Advanced",
      className:
        "border-orange-200 bg-orange-50 text-orange-700"
    }
  }

  if (permissionCount >= 1) {
    return {
      label: "Standard",
      className:
        "border-blue-200 bg-blue-50 text-blue-700"
    }
  }

  return {
    label: "Read Only",
    className:
      "border-green-200 bg-green-50 text-green-700"
  }
}