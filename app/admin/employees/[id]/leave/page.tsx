import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  UserRound,
  XCircle
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDate(value: Date | null) {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value)
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    )
}

export default async function EmployeeLeavePage({
  params
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  if (
    ![
      "super_admin",
      "manager"
    ].includes(currentRole)
  ) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

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
        },

        leaves: {
          include: {
            approver: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },

          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const totalLeaves =
    employee.leaves.length

  const pendingLeaves =
    employee.leaves.filter(
      (leave) => leave.status === "pending"
    ).length

  const approvedLeaves =
    employee.leaves.filter(
      (leave) => leave.status === "approved"
    ).length

  const rejectedLeaves =
    employee.leaves.filter(
      (leave) => leave.status === "rejected"
    ).length

  const approvedDays =
    employee.leaves
      .filter(
        (leave) => leave.status === "approved"
      )
      .reduce(
        (total, leave) =>
          total + leave.totalDays,
        0
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
            <CalendarDays size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Leave Records
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Leave history and approval status for{" "}
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
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Applications"
          value={totalLeaves}
          icon={<FileText size={19} />}
          variant="blue"
        />

        <StatCard
          label="Pending"
          value={pendingLeaves}
          icon={<Clock3 size={19} />}
          variant="orange"
        />

        <StatCard
          label="Approved"
          value={approvedLeaves}
          icon={<CheckCircle2 size={19} />}
          variant="green"
        />

        <StatCard
          label="Rejected"
          value={rejectedLeaves}
          icon={<XCircle size={19} />}
          variant="red"
        />

        <StatCard
          label="Approved Days"
          value={approvedDays}
          icon={<CalendarDays size={19} />}
          variant="blue"
        />
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Leave History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Complete leave application history for this
            employee.
          </p>
        </div>

        {employee.leaves.length === 0 ? (
          <EmptyState
            title="No leave records"
            description="This employee has not submitted any leave applications."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <TableHeading>
                    Leave Type
                  </TableHeading>

                  <TableHeading>
                    Start Date
                  </TableHeading>

                  <TableHeading>
                    End Date
                  </TableHeading>

                  <TableHeading>
                    Days
                  </TableHeading>

                  <TableHeading>
                    Reason
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Approved By
                  </TableHeading>

                  <TableHeading>
                    Manager Remarks
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {employee.leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    <TableCell>
                      <span className="font-medium text-slate-900">
                        {formatLabel(
                          leave.leaveType
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        leave.startDate
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDate(
                        leave.endDate
                      )}
                    </TableCell>

                    <TableCell>
                      {leave.totalDays}
                    </TableCell>

                    <TableCell>
                      <span
                        className="block max-w-72 truncate"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </span>
                    </TableCell>

                    <TableCell>
                      <LeaveStatusBadge
                        status={leave.status}
                      />
                    </TableCell>

                    <TableCell>
                      {leave.approver ? (
                        <div className="flex items-center gap-2">
                          <UserRound
                            size={15}
                            className="text-green-600"
                          />

                          <span>
                            {
                              leave.approver
                                .firstName
                            }{" "}
                            {
                              leave.approver
                                .lastName
                            }
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className="block max-w-72 truncate"
                        title={
                          leave.managerRemarks ??
                          ""
                        }
                      >
                        {leave.managerRemarks ||
                          "—"}
                      </span>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function LeaveStatusBadge({
  status
}: {
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
}) {
  const styles = {
    pending:
      "border-orange-200 bg-orange-50 text-orange-700",

    approved:
      "border-green-200 bg-green-50 text-green-700",

    rejected:
      "border-red-200 bg-red-50 text-red-700",

    cancelled:
      "border-slate-200 bg-slate-100 text-slate-600"
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  )
}

function StatCard({
  label,
  value,
  icon,
  variant
}: {
  label: string
  value: number
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <CalendarDays
        size={28}
        className="text-slate-400"
      />

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  )
}

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