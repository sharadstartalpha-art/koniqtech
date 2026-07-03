import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Database,
  Fingerprint,
  Globe2,
  History,
  MonitorCog
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>

  searchParams: Promise<{
    page?: string
  }>
}

const PAGE_SIZE = 20

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(value)
}

function formatAction(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

function getActionVariant(
  action: string
):
  | "blue"
  | "green"
  | "orange"
  | "red" {
  const normalized =
    action.toLowerCase()

  if (
    normalized.includes("delete") ||
    normalized.includes("remove") ||
    normalized.includes("failed") ||
    normalized.includes("reject")
  ) {
    return "red"
  }

  if (
    normalized.includes("create") ||
    normalized.includes("add") ||
    normalized.includes("approve") ||
    normalized.includes("complete") ||
    normalized.includes("login")
  ) {
    return "green"
  }

  if (
    normalized.includes("update") ||
    normalized.includes("edit") ||
    normalized.includes("change") ||
    normalized.includes("logout")
  ) {
    return "orange"
  }

  return "blue"
}

export default async function EmployeeActivityPage({
  params,
  searchParams
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  const allowedRoles = [
    "super_admin",
    "manager"
  ]

  if (!allowedRoles.includes(currentRole)) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

  const query = await searchParams

  const requestedPage = Number(
    query.page ?? "1"
  )

  const currentPage =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1

  const employee =
    await prisma.employee.findUnique({
      where: {
        id
      },

      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        designation: true,

        department: {
          select: {
            name: true
          }
        },

        role: {
          select: {
            name: true
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const [
    activities,
    totalActivities,
    uniqueEntityRows,
    firstActivity,
    latestActivity
  ] = await Promise.all([
    prisma.employeeActivity.findMany({
      where: {
        employeeId: employee.id
      },

      orderBy: {
        createdAt: "desc"
      },

      skip:
        (currentPage - 1) *
        PAGE_SIZE,

      take: PAGE_SIZE
    }),

    prisma.employeeActivity.count({
      where: {
        employeeId: employee.id
      }
    }),

    prisma.employeeActivity.findMany({
      where: {
        employeeId: employee.id,
        entity: {
          not: null
        }
      },

      distinct: ["entity"],

      select: {
        entity: true
      }
    }),

    prisma.employeeActivity.findFirst({
      where: {
        employeeId: employee.id
      },

      orderBy: {
        createdAt: "asc"
      },

      select: {
        createdAt: true
      }
    }),

    prisma.employeeActivity.findFirst({
      where: {
        employeeId: employee.id
      },

      orderBy: {
        createdAt: "desc"
      },

      select: {
        createdAt: true
      }
    })
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalActivities / PAGE_SIZE
    )
  )

  const fullName =
    `${employee.firstName} ${employee.lastName}`

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <Link
          href={`/admin/employees/${employee.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employee Profile
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Activity size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Employee Activity
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Internal activity and audit timeline for{" "}
              <span className="font-medium text-slate-700">
                {fullName}
              </span>
              {" "}({employee.employeeCode})
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.department.name}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.role.name}
              </span>

              {employee.designation && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {employee.designation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ActivityStatCard
          label="Total Activities"
          value={String(totalActivities)}
          icon={<History size={19} />}
          variant="blue"
        />

        <ActivityStatCard
          label="Entity Types"
          value={String(
            uniqueEntityRows.length
          )}
          icon={<Database size={19} />}
          variant="green"
        />

        <ActivityStatCard
          label="First Activity"
          value={
            firstActivity
              ? new Intl.DateTimeFormat(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }
                ).format(
                  firstActivity.createdAt
                )
              : "—"
          }
          icon={<CalendarDays size={19} />}
          variant="orange"
        />

        <ActivityStatCard
          label="Latest Activity"
          value={
            latestActivity
              ? new Intl.DateTimeFormat(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }
                ).format(
                  latestActivity.createdAt
                )
              : "—"
          }
          icon={<Activity size={19} />}
          variant="green"
        />
      </div>

      {/* ACTIVITY TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Activity Timeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recorded actions performed by this
            internal employee.
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Activity size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No activity recorded
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are currently no activity records
              associated with this employee.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <TableHeading>
                      Date & Time
                    </TableHeading>

                    <TableHeading>
                      Action
                    </TableHeading>

                    <TableHeading>
                      Entity
                    </TableHeading>

                    <TableHeading>
                      Entity ID
                    </TableHeading>

                    <TableHeading>
                      IP Address
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {activities.map(
                    (activity) => (
                      <tr
                        key={activity.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={15}
                              className="text-slate-400"
                            />

                            <span className="font-medium text-slate-700">
                              {formatDateTime(
                                activity.createdAt
                              )}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <ActionBadge
                            action={
                              activity.action
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {activity.entity ? (
                            <div className="flex items-center gap-2">
                              <Database
                                size={15}
                                className="text-blue-500"
                              />

                              <span className="font-medium text-slate-700">
                                {formatAction(
                                  activity.entity
                                )}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        <TableCell>
                          {activity.entityId ? (
                            <div className="flex items-center gap-2">
                              <Fingerprint
                                size={15}
                                className="text-orange-500"
                              />

                              <span
                                className="max-w-64 truncate font-mono text-xs text-slate-600"
                                title={
                                  activity.entityId
                                }
                              >
                                {
                                  activity.entityId
                                }
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        <TableCell>
                          {activity.ip ? (
                            <div className="flex items-center gap-2">
                              <Globe2
                                size={15}
                                className="text-green-600"
                              />

                              <span className="font-mono text-xs">
                                {activity.ip}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {currentPage} of{" "}
                {totalPages} ·{" "}
                {totalActivities} total activities
              </p>

              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin/employees/${employee.id}/activity?page=${currentPage - 1}`}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 text-sm text-slate-400">
                    Previous
                  </span>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={`/admin/employees/${employee.id}/activity?page=${currentPage + 1}`}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 text-sm text-slate-400">
                    Next
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* AUDIT NOTE */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <MonitorCog
          size={20}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <div>
          <p className="font-semibold text-blue-900">
            Internal audit information
          </p>

          <p className="mt-1 text-sm text-blue-700">
            This page displays recorded EmployeeActivity
            entries. It does not include customer CRM
            UserActivity records.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   ACTION BADGE
========================================================= */

function ActionBadge({
  action
}: {
  action: string
}) {
  const variant =
    getActionVariant(action)

  const styles = {
    blue:
      "border-blue-200 bg-blue-50 text-blue-700",

    green:
      "border-green-200 bg-green-50 text-green-700",

    orange:
      "border-orange-200 bg-orange-50 text-orange-700",

    red:
      "border-red-200 bg-red-50 text-red-700"
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {formatAction(action)}
    </span>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function ActivityStatCard({
  label,
  value,
  icon,
  variant
}: {
  label: string
  value: string
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   TABLE HELPERS
========================================================= */

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}

function TableCell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
      {children}
    </td>
  )
}