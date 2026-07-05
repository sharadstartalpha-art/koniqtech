import Link from "next/link"
import { redirect } from "next/navigation"

import {
  CheckCircle2,
  KeyRound,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  XCircle
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  searchParams: Promise<{
    search?: string
  }>
}

/* =========================================================
   ROLE ACCESS

   Broad access is controlled by User.role.

   Detailed EmployeeRole permissions will be enforced
   inside actions.ts.
========================================================= */

const ROLE_VIEW_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

const ROLE_MANAGEMENT_ROLES = new Set([
  "super_admin"
])

/* =========================================================
   PAGE
========================================================= */

export default async function RolesPage({
  searchParams
}: PageProps) {
  /* =======================================================
     AUTHORIZATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  )

  if (!ROLE_VIEW_ROLES.has(currentRole)) {
    redirect("/admin/dashboard")
  }

  const canManageRoles =
    ROLE_MANAGEMENT_ROLES.has(currentRole)

  /* =======================================================
     SEARCH PARAMS
  ======================================================= */

  const params = await searchParams

  const search =
    params.search?.trim() ?? ""

  /* =======================================================
     LOAD EMPLOYEE ROLES

     EmployeeRole currently has no orgId in your schema.

     Therefore this is an internal platform-wide role
     configuration table.

     Do NOT add orgId filtering here unless EmployeeRole
     is later redesigned as organization-scoped.
  ======================================================= */

  const roles =
    await prisma.employeeRole.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive"
                }
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            ]
          }
        : undefined,

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
      },

      orderBy: {
        name: "asc"
      }
    })

  /* =======================================================
     SUMMARY DATA
  ======================================================= */

  const totalEmployees =
    roles.reduce(
      (total, role) =>
        total + role._count.employees,
      0
    )

  const approvalRoles =
    roles.filter(
      (role) => role.canApprove
    ).length

  const fullControlRoles =
    roles.filter(
      (role) =>
        role.canCreate &&
        role.canEdit &&
        role.canDelete &&
        role.canApprove &&
        role.canAssign &&
        role.canExport
    ).length

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Employee Roles
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage internal KoniqTech staff roles and
            operational permissions.
          </p>
        </div>

        {canManageRoles && (
          <Link
            href="/admin/roles/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />

            Add Role
          </Link>
        )}
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Roles"
          value={roles.length}
          description="Internal staff role definitions"
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          variant="blue"
        />

        <SummaryCard
          title="Assigned Staff"
          value={totalEmployees}
          description="Employees assigned across roles"
          icon={
            <Users className="h-5 w-5" />
          }
          variant="green"
        />

        <SummaryCard
          title="Approval Roles"
          value={approvalRoles}
          description="Roles allowed to approve records"
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          variant="orange"
        />

        <SummaryCard
          title="Full Control"
          value={fullControlRoles}
          description="Roles with all permissions enabled"
          icon={
            <KeyRound className="h-5 w-5" />
          }
          variant="red"
        />
      </div>

      {/* ===================================================
          ROLE DIRECTORY
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">
              Role Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review internal roles, assigned staff and
              action permissions.
            </p>
          </div>

          {/* SEARCH */}

          <form
            action="/admin/roles"
            method="GET"
            className="flex w-full gap-2 sm:w-auto"
          >
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                name="search"
                type="search"
                defaultValue={search}
                placeholder="Search roles..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* EMPTY STATE */}

        {roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-950">
              {search
                ? "No matching roles found"
                : "No employee roles found"}
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try a different search term or clear the current search."
                : "Create internal staff roles and configure their operational permissions."}
            </p>

            {search ? (
              <Link
                href="/admin/roles"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Clear Search
              </Link>
            ) : canManageRoles ? (
              <Link
                href="/admin/roles/new"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />

                Add Role
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <TableHeading>
                    Role
                  </TableHeading>

                  <TableHeading>
                    Staff
                  </TableHeading>

                  <TableHeading>
                    Core Permissions
                  </TableHeading>

                  <TableHeading>
                    Workflow Permissions
                  </TableHeading>

                  <TableHeading>
                    Access Level
                  </TableHeading>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {roles.map((role) => {
                  const enabledPermissionCount = [
                    role.canCreate,
                    role.canEdit,
                    role.canDelete,
                    role.canApprove,
                    role.canAssign,
                    role.canExport
                  ].filter(Boolean).length

                  return (
                    <tr
                      key={role.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* ROLE */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <UserCog className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/admin/roles/${role.id}`}
                              className="font-semibold text-slate-950 transition hover:text-blue-600"
                            >
                              {role.name}
                            </Link>

                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                              {role.description ||
                                "No description provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STAFF COUNT */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />

                          <span className="text-sm font-semibold text-slate-700">
                            {role._count.employees}
                          </span>
                        </div>
                      </td>

                      {/* CORE PERMISSIONS */}

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <PermissionBadge
                            label="Create"
                            enabled={role.canCreate}
                          />

                          <PermissionBadge
                            label="Edit"
                            enabled={role.canEdit}
                          />

                          <PermissionBadge
                            label="Delete"
                            enabled={role.canDelete}
                            danger
                          />
                        </div>
                      </td>

                      {/* WORKFLOW PERMISSIONS */}

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <PermissionBadge
                            label="Approve"
                            enabled={role.canApprove}
                          />

                          <PermissionBadge
                            label="Assign"
                            enabled={role.canAssign}
                          />

                          <PermissionBadge
                            label="Export"
                            enabled={role.canExport}
                          />
                        </div>
                      </td>

                      {/* ACCESS LEVEL */}

                      <td className="px-6 py-4">
                        <AccessLevelBadge
                          permissionCount={
                            enabledPermissionCount
                          }
                        />
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/roles/${role.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            View
                          </Link>

                          {canManageRoles && (
                            <Link
                              href={`/admin/roles/${role.id}/edit`}
                              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-50 px-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                            >
                              <Pencil className="h-3.5 w-3.5" />

                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================
          ARCHITECTURE NOTE
      =================================================== */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-semibold text-blue-950">
            Internal Staff Permissions
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Employee Roles control detailed operational
            permissions for KoniqTech internal staff. Broad
            admin navigation and route access remain controlled
            by the linked account&apos;s platform role.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
  variant
}: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600",

    orange:
      "bg-orange-50 text-orange-600",

    red:
      "bg-red-50 text-red-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   PERMISSION BADGE
========================================================= */

function PermissionBadge({
  label,
  enabled,
  danger = false
}: {
  label: string
  enabled: boolean
  danger?: boolean
}) {
  if (!enabled) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
        <XCircle className="h-3 w-3" />

        {label}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
        danger
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      <CheckCircle2 className="h-3 w-3" />

      {label}
    </span>
  )
}

/* =========================================================
   ACCESS LEVEL BADGE
========================================================= */

function AccessLevelBadge({
  permissionCount
}: {
  permissionCount: number
}) {
  if (permissionCount === 6) {
    return (
      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        Full Control
      </span>
    )
  }

  if (permissionCount >= 4) {
    return (
      <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
        Advanced
      </span>
    )
  }

  if (permissionCount >= 1) {
    return (
      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        Standard
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
      Read Only
    </span>
  )
}

/* =========================================================
   TABLE HEADING
========================================================= */

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}