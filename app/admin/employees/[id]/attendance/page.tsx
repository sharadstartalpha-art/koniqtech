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
  Home,
  MapPin,
  TimerReset,
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

  searchParams: Promise<{
    month?: string
    year?: string
  }>
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value)
}

function formatTime(
  value: Date | null
) {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(value)
}

function formatHours(
  value: number | null
) {
  if (value === null) {
    return "—"
  }

  return `${value.toFixed(2)} hrs`
}

function getMonthName(
  month: number,
  year: number
) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(
    new Date(year, month - 1, 1)
  )
}

function getPreviousMonth(
  month: number,
  year: number
) {
  if (month === 1) {
    return {
      month: 12,
      year: year - 1
    }
  }

  return {
    month: month - 1,
    year
  }
}

function getNextMonth(
  month: number,
  year: number
) {
  if (month === 12) {
    return {
      month: 1,
      year: year + 1
    }
  }

  return {
    month: month + 1,
    year
  }
}

/* =========================================================
   PAGE
========================================================= */

export default async function EmployeeAttendancePage({
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

  const now = new Date()

  const requestedMonth = Number(
    query.month ?? now.getMonth() + 1
  )

  const requestedYear = Number(
    query.year ?? now.getFullYear()
  )

  const month =
    requestedMonth >= 1 &&
    requestedMonth <= 12
      ? requestedMonth
      : now.getMonth() + 1

  const year =
    requestedYear >= 2000 &&
    requestedYear <= 2100
      ? requestedYear
      : now.getFullYear()

  const startDate = new Date(
    year,
    month - 1,
    1
  )

  const endDate = new Date(
    year,
    month,
    1
  )

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
        active: true,

        department: {
          select: {
            id: true,
            name: true
          }
        },

        role: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const attendanceRecords =
    await prisma.employeeAttendance.findMany({
      where: {
        employeeId: employee.id,

        attendanceDate: {
          gte: startDate,
          lt: endDate
        }
      },

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
        attendanceDate: "desc"
      }
    })

  /* =========================================================
     MONTH SUMMARY
  ========================================================= */

  const totalRecords =
    attendanceRecords.length

  const presentDays =
    attendanceRecords.filter(
      (record) =>
        record.status === "present"
    ).length

  const absentDays =
    attendanceRecords.filter(
      (record) =>
        record.status === "absent"
    ).length

  const lateDays =
    attendanceRecords.filter(
      (record) =>
        record.status === "late"
    ).length

  const leaveDays =
    attendanceRecords.filter(
      (record) =>
        record.status === "leave"
    ).length

  const workFromHomeDays =
    attendanceRecords.filter(
      (record) =>
        record.status ===
        "work_from_home"
    ).length

  const totalHours =
    attendanceRecords.reduce(
      (total, record) =>
        total + (record.totalHours ?? 0),
      0
    )

  const overtimeHours =
    attendanceRecords.reduce(
      (total, record) =>
        total + record.overtimeHours,
      0
    )

  const previousMonth =
    getPreviousMonth(month, year)

  const nextMonth =
    getNextMonth(month, year)

  const fullName =
    `${employee.firstName} ${employee.lastName}`

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <Link
          href={`/admin/employees/${employee.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employee Profile
        </Link>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Attendance
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Attendance history for{" "}
                <span className="font-medium text-slate-700">
                  {fullName}
                </span>
                {" "}({employee.employeeCode})
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  {employee.department.name}
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1">
                  {employee.role.name}
                </span>

                {employee.designation && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">
                    {employee.designation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* MONTH NAVIGATION */}

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/employees/${employee.id}/attendance?month=${previousMonth.month}&year=${previousMonth.year}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              ← Previous
            </Link>

            <div className="flex h-10 min-w-40 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700">
              {getMonthName(month, year)}
            </div>

            <Link
              href={`/admin/employees/${employee.id}/attendance?month=${nextMonth.month}&year=${nextMonth.year}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Next →
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <AttendanceStatCard
          label="Records"
          value={String(totalRecords)}
          icon={<CalendarDays size={19} />}
          variant="blue"
        />

        <AttendanceStatCard
          label="Present"
          value={String(presentDays)}
          icon={<CheckCircle2 size={19} />}
          variant="green"
        />

        <AttendanceStatCard
          label="Absent"
          value={String(absentDays)}
          icon={<XCircle size={19} />}
          variant="red"
        />

        <AttendanceStatCard
          label="Late"
          value={String(lateDays)}
          icon={<Clock3 size={19} />}
          variant="orange"
        />

        <AttendanceStatCard
          label="Leave"
          value={String(leaveDays)}
          icon={<CalendarDays size={19} />}
          variant="blue"
        />

        <AttendanceStatCard
          label="Total Hours"
          value={totalHours.toFixed(1)}
          icon={<TimerReset size={19} />}
          variant="green"
        />

        <AttendanceStatCard
          label="Overtime"
          value={overtimeHours.toFixed(1)}
          icon={<Clock3 size={19} />}
          variant="orange"
        />
      </div>

      {/* =====================================================
          SECONDARY SUMMARY
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Work From Home
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {workFromHomeDays}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Home size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Attendance Completion
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {totalRecords > 0
                  ? `${Math.round(
                      ((presentDays +
                        lateDays +
                        workFromHomeDays) /
                        totalRecords) *
                        100
                    )}%`
                  : "0%"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ATTENDANCE TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Attendance Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Daily attendance records for{" "}
            {getMonthName(month, year)}.
          </p>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <CalendarDays size={25} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No attendance records
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No attendance records were found for{" "}
              {getMonthName(month, year)}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <TableHeading>
                    Date
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Check In
                  </TableHeading>

                  <TableHeading>
                    Check Out
                  </TableHeading>

                  <TableHeading>
                    Break
                  </TableHeading>

                  <TableHeading>
                    Total Hours
                  </TableHeading>

                  <TableHeading>
                    Overtime
                  </TableHeading>

                  <TableHeading>
                    Location
                  </TableHeading>

                  <TableHeading>
                    Approved By
                  </TableHeading>

                  <TableHeading>
                    Remarks
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {attendanceRecords.map(
                  (record) => (
                    <tr
                      key={record.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        <div className="font-medium text-slate-900">
                          {formatDate(
                            record.attendanceDate
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <AttendanceStatusBadge
                          status={record.status}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock3
                            size={15}
                            className="text-green-500"
                          />

                          {formatTime(
                            record.checkIn
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock3
                            size={15}
                            className="text-orange-500"
                          />

                          {formatTime(
                            record.checkOut
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {record.breakMinutes} min
                      </TableCell>

                      <TableCell>
                        <span className="font-medium text-slate-800">
                          {formatHours(
                            record.totalHours
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        {record.overtimeHours >
                        0 ? (
                          <span className="font-medium text-orange-600">
                            {record.overtimeHours.toFixed(
                              2
                            )}{" "}
                            hrs
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        {record.workLocation ? (
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={15}
                              className="text-blue-500"
                            />

                            <span>
                              {
                                record.workLocation
                              }
                            </span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell>
                        {record.approver ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600">
                              <UserRound
                                size={14}
                              />
                            </div>

                            <span>
                              {
                                record.approver
                                  .firstName
                              }{" "}
                              {
                                record.approver
                                  .lastName
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            Not approved
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span
                          className="block max-w-52 truncate"
                          title={
                            record.remarks ?? ""
                          }
                        >
                          {record.remarks || "—"}
                        </span>
                      </TableCell>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   ATTENDANCE STATUS BADGE
========================================================= */

function AttendanceStatusBadge({
  status
}: {
  status:
    | "present"
    | "absent"
    | "late"
    | "half_day"
    | "leave"
    | "holiday"
    | "weekend"
    | "work_from_home"
}) {
  const styles = {
    present:
      "bg-green-50 text-green-700 border-green-200",

    absent:
      "bg-red-50 text-red-700 border-red-200",

    late:
      "bg-orange-50 text-orange-700 border-orange-200",

    half_day:
      "bg-orange-50 text-orange-700 border-orange-200",

    leave:
      "bg-blue-50 text-blue-700 border-blue-200",

    holiday:
      "bg-blue-50 text-blue-700 border-blue-200",

    weekend:
      "bg-slate-100 text-slate-600 border-slate-200",

    work_from_home:
      "bg-green-50 text-green-700 border-green-200"
  }

  const labels = {
    present: "Present",
    absent: "Absent",
    late: "Late",
    half_day: "Half Day",
    leave: "Leave",
    holiday: "Holiday",
    weekend: "Weekend",
    work_from_home: "Work From Home"
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function AttendanceStatCard({
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyles[variant]}`}
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