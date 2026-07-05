import Link from "next/link"

import { redirect } from "next/navigation"

import {
  AttendanceStatus,
  Prisma,
  UserRole
} from "@prisma/client"

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Plus,
  Search,
  UserCheck,
  UserMinus,
  Users
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type AttendancePageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    date?: string
    page?: string
  }>
}


// ============================================================
// CONSTANTS
// ============================================================

const PAGE_SIZE = 20


const VIEW_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const VALID_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.present,
  AttendanceStatus.absent,
  AttendanceStatus.late,
  AttendanceStatus.half_day,
  AttendanceStatus.leave,
  AttendanceStatus.holiday,
  AttendanceStatus.weekend,
  AttendanceStatus.work_from_home
]


// ============================================================
// STATUS LABELS
// ============================================================

const STATUS_LABELS: Record<
  AttendanceStatus,
  string
> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  half_day: "Half Day",
  leave: "Leave",
  holiday: "Holiday",
  weekend: "Weekend",
  work_from_home: "Work From Home"
}


// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES: Record<
  AttendanceStatus,
  string
> = {
  present:
    "border-green-200 bg-green-50 text-green-700",

  absent:
    "border-red-200 bg-red-50 text-red-700",

  late:
    "border-orange-200 bg-orange-50 text-orange-700",

  half_day:
    "border-orange-200 bg-orange-50 text-orange-700",

  leave:
    "border-blue-200 bg-blue-50 text-blue-700",

  holiday:
    "border-purple-200 bg-purple-50 text-purple-700",

  weekend:
    "border-slate-200 bg-slate-50 text-slate-700",

  work_from_home:
    "border-cyan-200 bg-cyan-50 text-cyan-700"
}


// ============================================================
// HELPERS
// ============================================================

function getDateRange(
  dateValue?: string
) {

  if (!dateValue) {
    return null
  }

  const start = new Date(
    `${dateValue}T00:00:00.000Z`
  )

  if (Number.isNaN(start.getTime())) {
    return null
  }

  const end = new Date(start)

  end.setUTCDate(
    end.getUTCDate() + 1
  )

  return {
    gte: start,
    lt: end
  }
}


function getTodayRange() {

  const now = new Date()

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  )

  const end = new Date(start)

  end.setUTCDate(
    end.getUTCDate() + 1
  )

  return {
    gte: start,
    lt: end
  }
}


function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }
  ).format(date)
}


function formatTime(
  date: Date | null
) {

  if (!date) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC"
    }
  ).format(date)
}


function getEmployeeName(
  employee: {
    user: {
      name: string | null
      email: string
    } | null
  }
) {

  if (employee.user?.name) {
    return employee.user.name
  }

  if (employee.user?.email) {
    return employee.user.email
  }

  return "Employee"
}


// ============================================================
// PAGE
// ============================================================

export default async function AttendancePage({
  searchParams
}: AttendancePageProps) {

  // ----------------------------------------------------------
  // AUTHORIZATION
  // ----------------------------------------------------------

  const session = await auth()

  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    redirect("/login")
  }


  const currentRole =
    session.user.role as UserRole


  if (
    !VIEW_ROLES.includes(currentRole)
  ) {
    redirect("/admin/dashboard")
  }


  const canManage =
    MANAGE_ROLES.includes(currentRole)


  // ----------------------------------------------------------
  // SEARCH PARAMS
  // ----------------------------------------------------------

  const params =
    await searchParams


  const search =
    params.search?.trim() ?? ""


  const selectedStatus =
    params.status &&
    VALID_STATUSES.includes(
      params.status as AttendanceStatus
    )
      ? params.status as AttendanceStatus
      : undefined


  const selectedDate =
    params.date?.trim() ?? ""


  const requestedPage =
    Number(params.page ?? "1")


  const currentPage =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1


  const skip =
    (currentPage - 1) * PAGE_SIZE


  // ----------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------

  const dateRange =
    getDateRange(selectedDate)


  const where:
    Prisma.EmployeeAttendanceWhereInput = {
      ...(selectedStatus
        ? {
            status: selectedStatus
          }
        : {}),

      ...(dateRange
        ? {
            attendanceDate:
              dateRange
          }
        : {}),

      ...(search
        ? {
            employee: {
              user: {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive"
                    }
                  },
                  {
                    email: {
                      contains: search,
                      mode: "insensitive"
                    }
                  }
                ]
              }
            }
          }
        : {})
    }


  // ----------------------------------------------------------
  // TODAY RANGE
  // ----------------------------------------------------------

  const todayRange =
    getTodayRange()


  // ----------------------------------------------------------
  // DATABASE QUERIES
  // ----------------------------------------------------------

  const [
    attendanceRecords,
    totalRecords,
    totalEmployees,
    todayPresent,
    todayAbsent,
    todayLate,
    todayWorkFromHome,
    todayApproved
  ] = await Promise.all([

    prisma.employeeAttendance.findMany({
      where,

      orderBy: [
        {
          attendanceDate: "desc"
        },
        {
          createdAt: "desc"
        }
      ],

      skip,

      take: PAGE_SIZE,

      include: {
        employee: {
          select: {
            id: true,

            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },

        approver: {
          select: {
            id: true,

            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    }),


    prisma.employeeAttendance.count({
      where
    }),


    prisma.employee.count(),


    prisma.employeeAttendance.count({
      where: {
        attendanceDate:
          todayRange,

        status:
          AttendanceStatus.present
      }
    }),


    prisma.employeeAttendance.count({
      where: {
        attendanceDate:
          todayRange,

        status:
          AttendanceStatus.absent
      }
    }),


    prisma.employeeAttendance.count({
      where: {
        attendanceDate:
          todayRange,

        status:
          AttendanceStatus.late
      }
    }),


    prisma.employeeAttendance.count({
      where: {
        attendanceDate:
          todayRange,

        status:
          AttendanceStatus.work_from_home
      }
    }),


    prisma.employeeAttendance.count({
      where: {
        attendanceDate:
          todayRange,

        approvedAt: {
          not: null
        }
      }
    })
  ])


  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords / PAGE_SIZE
      )
    )


  function buildPageUrl(
    page: number
  ) {

    const query =
      new URLSearchParams()


    if (search) {
      query.set(
        "search",
        search
      )
    }


    if (selectedStatus) {
      query.set(
        "status",
        selectedStatus
      )
    }


    if (selectedDate) {
      query.set(
        "date",
        selectedDate
      )
    }


    query.set(
      "page",
      String(page)
    )


    return (
      `/admin/attendance?${query.toString()}`
    )
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* PAGE HEADER */}
      {/* ==================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Attendance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employee attendance, working hours,
            locations, and approvals.
          </p>
        </div>


        {canManage && (
          <Link
            href="/admin/attendance/new"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg
              bg-green-600
              px-4 py-2.5
              text-sm font-medium text-white
              shadow-sm
              transition
              hover:bg-green-700
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              focus:ring-offset-2
            "
          >
            <Plus className="h-4 w-4" />

            Add Attendance
          </Link>
        )}

      </div>


      {/* ==================================================== */}
      {/* SUMMARY CARDS */}
      {/* ==================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Total Employees"
          value={totalEmployees}
          description="Internal employees"
          icon={Users}
          iconClassName="bg-blue-50 text-blue-600"
        />


        <SummaryCard
          title="Present Today"
          value={todayPresent}
          description="Marked present"
          icon={UserCheck}
          iconClassName="bg-green-50 text-green-600"
        />


        <SummaryCard
          title="Absent Today"
          value={todayAbsent}
          description="Marked absent"
          icon={UserMinus}
          iconClassName="bg-red-50 text-red-600"
        />


        <SummaryCard
          title="Late Today"
          value={todayLate}
          description="Late arrivals"
          icon={Clock3}
          iconClassName="bg-orange-50 text-orange-600"
        />

      </div>


      {/* ==================================================== */}
      {/* SECONDARY SUMMARY */}
      {/* ==================================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <MiniSummaryCard
          title="Work From Home"
          value={todayWorkFromHome}
          icon={Home}
        />


        <MiniSummaryCard
          title="Approved Today"
          value={todayApproved}
          icon={CheckCircle2}
        />


        <MiniSummaryCard
          title="Displayed Records"
          value={totalRecords}
          icon={CalendarDays}
        />

      </div>


      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <form
          method="GET"
          className="
            grid gap-3
            md:grid-cols-2
            xl:grid-cols-[minmax(260px,1fr)_220px_190px_auto]
          "
        >

          {/* SEARCH */}

          <div className="relative">

            <Search
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search employee name or email..."
              className="
                h-10 w-full
                rounded-lg
                border border-slate-300
                bg-white
                pl-9 pr-3
                text-sm text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* STATUS */}

          <select
            name="status"
            defaultValue={
              selectedStatus ?? ""
            }
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="">
              All statuses
            </option>

            {VALID_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {STATUS_LABELS[status]}
                </option>
              )
            )}
          </select>


          {/* DATE */}

          <input
            type="date"
            name="date"
            defaultValue={selectedDate}
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />


          {/* FILTER ACTIONS */}

          <div className="flex gap-2">

            <button
              type="submit"
              className="
                inline-flex h-10 items-center justify-center
                rounded-lg
                bg-blue-600
                px-4
                text-sm font-medium text-white
                transition
                hover:bg-blue-700
              "
            >
              Filter
            </button>


            <Link
              href="/admin/attendance"
              className="
                inline-flex h-10 items-center justify-center
                rounded-lg
                border border-orange-200
                bg-orange-50
                px-4
                text-sm font-medium text-orange-700
                transition
                hover:bg-orange-100
              "
            >
              Reset
            </Link>

          </div>

        </form>

      </div>


      {/* ==================================================== */}
      {/* TABLE */}
      {/* ==================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="font-semibold text-slate-900">
                Attendance Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {totalRecords} record
                {totalRecords === 1 ? "" : "s"} found
              </p>
            </div>

          </div>

        </div>


        {attendanceRecords.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <CalendarDays
              className="
                mx-auto h-10 w-10
                text-slate-300
              "
            />

            <h3 className="mt-4 font-medium text-slate-900">
              No attendance records found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No attendance records match the current filters.
              Adjust the filters or add a new attendance record.
            </p>


            {canManage && (
              <Link
                href="/admin/attendance/new"
                className="
                  mt-5
                  inline-flex items-center gap-2
                  rounded-lg
                  bg-green-600
                  px-4 py-2.5
                  text-sm font-medium text-white
                  transition
                  hover:bg-green-700
                "
              >
                <Plus className="h-4 w-4" />

                Add Attendance
              </Link>
            )}

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-slate-200">

              <thead className="bg-slate-50">

                <tr>

                  <TableHeading>
                    Employee
                  </TableHeading>

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
                    Hours
                  </TableHeading>

                  <TableHeading>
                    Location
                  </TableHeading>

                  <TableHeading>
                    Approval
                  </TableHeading>

                  <TableHeading align="right">
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100 bg-white">

                {attendanceRecords.map(
                  (record) => {

                    const employeeName =
                      getEmployeeName(
                        record.employee
                      )


                    const approverName =
                      record.approver
                        ? getEmployeeName(
                            record.approver
                          )
                        : null


                    return (
                      <tr
                        key={record.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* EMPLOYEE */}

                        <td className="whitespace-nowrap px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                flex h-9 w-9
                                shrink-0
                                items-center justify-center
                                rounded-full
                                bg-blue-50
                                text-sm font-semibold
                                text-blue-700
                              "
                            >
                              {employeeName
                                .charAt(0)
                                .toUpperCase()}
                            </div>


                            <div className="min-w-0">

                              <p className="max-w-[220px] truncate text-sm font-medium text-slate-900">
                                {employeeName}
                              </p>

                              <p className="max-w-[220px] truncate text-xs text-slate-500">
                                {record.employee.user?.email ??
                                  "No linked email"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                          {formatDate(
                            record.attendanceDate
                          )}
                        </td>


                        {/* STATUS */}

                        <td className="whitespace-nowrap px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs font-medium
                              ${STATUS_STYLES[record.status]}
                            `}
                          >
                            {
                              STATUS_LABELS[
                                record.status
                              ]
                            }
                          </span>

                        </td>


                        {/* CHECK IN */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                          {formatTime(
                            record.checkIn
                          )}
                        </td>


                        {/* CHECK OUT */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                          {formatTime(
                            record.checkOut
                          )}
                        </td>


                        {/* HOURS */}

                        <td className="whitespace-nowrap px-5 py-4">

                          <div className="text-sm font-medium text-slate-900">
                            {record.totalHours !== null
                              ? `${record.totalHours.toFixed(2)} h`
                              : "—"}
                          </div>

                          {record.overtimeHours > 0 && (
                            <div className="mt-0.5 text-xs text-orange-600">
                              +{record.overtimeHours.toFixed(2)} OT
                            </div>
                          )}

                        </td>


                        {/* LOCATION */}

                        <td className="max-w-[180px] px-5 py-4">

                          <p className="truncate text-sm text-slate-700">
                            {record.workLocation ??
                              "—"}
                          </p>

                        </td>


                        {/* APPROVAL */}

                        <td className="whitespace-nowrap px-5 py-4">

                          {record.approvedAt ? (

                            <div>

                              <span
                                className="
                                  inline-flex
                                  rounded-full
                                  border border-green-200
                                  bg-green-50
                                  px-2.5 py-1
                                  text-xs font-medium
                                  text-green-700
                                "
                              >
                                Approved
                              </span>

                              {approverName && (
                                <p className="mt-1 max-w-[150px] truncate text-xs text-slate-500">
                                  by {approverName}
                                </p>
                              )}

                            </div>

                          ) : (

                            <span
                              className="
                                inline-flex
                                rounded-full
                                border border-orange-200
                                bg-orange-50
                                px-2.5 py-1
                                text-xs font-medium
                                text-orange-700
                              "
                            >
                              Pending
                            </span>

                          )}

                        </td>


                        {/* ACTION */}

                        <td className="whitespace-nowrap px-5 py-4 text-right">

                          <Link
                            href={`/admin/attendance/${record.id}`}
                            className="
                              inline-flex items-center justify-center
                              rounded-lg
                              bg-blue-50
                              px-3 py-2
                              text-sm font-medium
                              text-blue-700
                              transition
                              hover:bg-blue-100
                            "
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


        {/* ================================================== */}
        {/* PAGINATION */}
        {/* ================================================== */}

        {totalRecords > 0 && (

          <div
            className="
              flex flex-col gap-3
              border-t border-slate-200
              px-5 py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>


            <div className="flex items-center gap-2">

              {currentPage > 1 ? (

                <Link
                  href={buildPageUrl(
                    currentPage - 1
                  )}
                  className="
                    inline-flex h-9 items-center justify-center
                    rounded-lg
                    border border-slate-300
                    bg-white
                    px-3
                    text-sm font-medium
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Previous
                </Link>

              ) : (

                <span
                  className="
                    inline-flex h-9 items-center justify-center
                    cursor-not-allowed
                    rounded-lg
                    border border-slate-200
                    bg-slate-50
                    px-3
                    text-sm font-medium
                    text-slate-400
                  "
                >
                  Previous
                </span>

              )}


              {currentPage < totalPages ? (

                <Link
                  href={buildPageUrl(
                    currentPage + 1
                  )}
                  className="
                    inline-flex h-9 items-center justify-center
                    rounded-lg
                    bg-blue-600
                    px-3
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Next
                </Link>

              ) : (

                <span
                  className="
                    inline-flex h-9 items-center justify-center
                    cursor-not-allowed
                    rounded-lg
                    bg-blue-100
                    px-3
                    text-sm font-medium
                    text-blue-300
                  "
                >
                  Next
                </span>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  )
}


// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {
  title: string
  value: number
  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string
}


function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName
}: SummaryCardProps) {

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>


        <div
          className={`
            flex h-11 w-11
            items-center justify-center
            rounded-lg
            ${iconClassName}
          `}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  )
}


// ============================================================
// MINI SUMMARY CARD
// ============================================================

type MiniSummaryCardProps = {
  title: string
  value: number

  icon: React.ComponentType<{
    className?: string
  }>
}


function MiniSummaryCard({
  title,
  value,
  icon: Icon
}: MiniSummaryCardProps) {

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          bg-blue-50
          text-blue-600
        "
      >
        <Icon className="h-5 w-5" />
      </div>


      <div>

        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <p className="mt-0.5 text-xl font-semibold text-slate-900">
          {value}
        </p>

      </div>

    </div>
  )
}


// ============================================================
// TABLE HEADING
// ============================================================

type TableHeadingProps = {
  children: React.ReactNode
  align?: "left" | "right"
}


function TableHeading({
  children,
  align = "left"
}: TableHeadingProps) {

  return (
    <th
      scope="col"
      className={`
        whitespace-nowrap
        px-5 py-3
        text-xs font-semibold
        uppercase tracking-wide
        text-slate-500
        ${
          align === "right"
            ? "text-right"
            : "text-left"
        }
      `}
    >
      {children}
    </th>
  )
}