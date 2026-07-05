import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileDown,
  Mail,
  Pencil,
  PlusCircle,
  Send,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
  XCircle
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import RoleActions from "../components/RoleActions"

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

const ROLE_VIEW_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function RoleDetailPage({
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

  if (!ROLE_VIEW_ROLES.has(currentRole)) {
    redirect("/admin/dashboard")
  }

  const canManage =
    currentRole === "super_admin"

  /* =======================================================
     PARAMS
  ======================================================= */

  const { id } = await params

  /* =======================================================
     LOAD ROLE

     EmployeeRole is internal and platform-wide in the
     current schema, so there is no orgId filter here.
  ======================================================= */

  const role =
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

        employees: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
            active: true,

            department: {
              select: {
                id: true,
                name: true
              }
            },

            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },

          orderBy: [
            {
              firstName: "asc"
            },
            {
              lastName: "asc"
            }
          ]
        },

        _count: {
          select: {
            employees: true
          }
        }
      }
    })

  if (!role) {
    notFound()
  }

  /* =======================================================
     PERMISSION SUMMARY
  ======================================================= */

  const permissions = [
    role.canCreate,
    role.canEdit,
    role.canDelete,
    role.canApprove,
    role.canAssign,
    role.canExport
  ]

  const enabledPermissionCount =
    permissions.filter(Boolean).length

  const activeEmployeeCount =
    role.employees.filter(
      (employee) => employee.active
    ).length

  const inactiveEmployeeCount =
    role._count.employees -
    activeEmployeeCount

  const accessLevel =
    getAccessLevel(
      enabledPermissionCount
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
        href="/admin/roles"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Roles
      </Link>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserCog className="h-6 w-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {role.name}
              </h1>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${accessLevel.className}`}
              >
                {accessLevel.label}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {role.description ||
                "No description has been provided for this employee role."}
            </p>
          </div>
        </div>

        <RoleActions
          roleId={role.id}
          roleName={role.name}
          employeeCount={
            role._count.employees
          }
          canManage={canManage}
        />
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Assigned Staff"
          value={role._count.employees}
          description="Total employees using this role"
          icon={
            <Users className="h-5 w-5" />
          }
          variant="blue"
        />

        <SummaryCard
          title="Active Staff"
          value={activeEmployeeCount}
          description="Currently active employees"
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          variant="green"
        />

        <SummaryCard
          title="Inactive Staff"
          value={inactiveEmployeeCount}
          description="Inactive employee records"
          icon={
            <XCircle className="h-5 w-5" />
          }
          variant="red"
        />

        <SummaryCard
          title="Permissions"
          value={`${enabledPermissionCount}/6`}
          description="Enabled operational permissions"
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          variant="orange"
        />
      </div>

      {/* ===================================================
          ROLE OVERVIEW
      =================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* =================================================
            PERMISSIONS
        ================================================= */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-950">
              Role Permissions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Operational permissions assigned to this
              internal employee role.
            </p>
          </div>

          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <PermissionCard
                title="Create"
                description="Create supported operational records."
                enabled={role.canCreate}
                icon={
                  <PlusCircle className="h-5 w-5" />
                }
                variant="green"
              />

              <PermissionCard
                title="Edit"
                description="Modify existing operational records."
                enabled={role.canEdit}
                icon={
                  <Pencil className="h-5 w-5" />
                }
                variant="blue"
              />

              <PermissionCard
                title="Delete"
                description="Delete supported operational records."
                enabled={role.canDelete}
                icon={
                  <Trash2 className="h-5 w-5" />
                }
                variant="red"
              />

              <PermissionCard
                title="Approve"
                description="Approve or reject workflow requests."
                enabled={role.canApprove}
                icon={
                  <UserCheck className="h-5 w-5" />
                }
                variant="orange"
              />

              <PermissionCard
                title="Assign"
                description="Assign supported work and operational records."
                enabled={role.canAssign}
                icon={
                  <Send className="h-5 w-5" />
                }
                variant="blue"
              />

              <PermissionCard
                title="Export"
                description="Export supported internal data and reports."
                enabled={role.canExport}
                icon={
                  <FileDown className="h-5 w-5" />
                }
                variant="green"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            ROLE INFORMATION
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-950">
              Role Information
            </h2>
          </div>

          <div className="space-y-5 p-5">
            <InfoRow
              icon={
                <ShieldCheck className="h-4 w-4" />
              }
              label="Access Level"
              value={accessLevel.label}
            />

            <InfoRow
              icon={
                <Users className="h-4 w-4" />
              }
              label="Assigned Employees"
              value={String(
                role._count.employees
              )}
            />

            <InfoRow
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              label="Permissions Enabled"
              value={`${enabledPermissionCount} of 6`}
            />

            <InfoRow
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Created"
              value={formatDate(
                role.createdAt
              )}
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          ASSIGNED EMPLOYEES
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">
              Assigned Employees
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Internal employees currently assigned to the{" "}
              {role.name} role.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            <Users className="h-4 w-4" />

            {role._count.employees} Staff
          </span>
        </div>

        {role.employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-950">
              No employees assigned
            </h3>

            <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
              Employees assigned to this role will appear
              here. Role assignment is managed from the
              Employee Management module.
            </p>

            <Link
              href="/admin/employees"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Employees
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <TableHeading>
                    Employee
                  </TableHeading>

                  <TableHeading>
                    Department
                  </TableHeading>

                  <TableHeading>
                    Designation
                  </TableHeading>

                  <TableHeading>
                    Manager
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {role.employees.map(
                  (employee) => {
                    const fullName =
                      `${employee.firstName} ${employee.lastName}`.trim()

                    const managerName =
                      employee.manager
                        ? `${employee.manager.firstName} ${employee.manager.lastName}`.trim()
                        : "Not assigned"

                    return (
                      <tr
                        key={employee.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* EMPLOYEE */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                              {getInitials(
                                employee.firstName,
                                employee.lastName
                              )}
                            </div>

                            <div>
                              <Link
                                href={`/admin/employees/${employee.id}`}
                                className="font-semibold text-slate-950 transition hover:text-blue-600"
                              >
                                {fullName}
                              </Link>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="text-xs font-medium text-blue-600">
                                  {employee.employeeCode}
                                </span>

                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Mail className="h-3 w-3" />

                                  {employee.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* DEPARTMENT */}

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                            <Building2 className="h-4 w-4 text-slate-400" />

                            {employee.department.name}
                          </span>
                        </td>

                        {/* DESIGNATION */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {employee.designation ||
                            "Not specified"}
                        </td>

                        {/* MANAGER */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {managerName}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">
                          {employee.active ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />

                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <XCircle className="h-3.5 w-3.5" />

                              Inactive
                            </span>
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/employees/${employee.id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  }
                )}
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
            Internal Role Architecture
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            This page manages EmployeeRole permissions for
            KoniqTech internal staff. Customer CRM roles and
            OrganizationRole permissions remain separate and
            are not modified here.
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
  value: string | number
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
   PERMISSION CARD
========================================================= */

function PermissionCard({
  title,
  description,
  enabled,
  icon,
  variant
}: {
  title: string
  description: string
  enabled: boolean
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const iconStyles = {
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
    <div
      className={`rounded-xl border p-4 ${
        enabled
          ? "border-green-200 bg-green-50/30"
          : "border-slate-200 bg-slate-50/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles[variant]}`}
        >
          {icon}
        </div>

        {enabled ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-700">
            <CheckCircle2 className="h-3 w-3" />

            Enabled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
            <XCircle className="h-3 w-3" />

            Disabled
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-950">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-blue-600">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
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

/* =========================================================
   HELPERS
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

function getInitials(
  firstName: string,
  lastName: string
) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`
    .toUpperCase()
}

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  ).format(date)
}