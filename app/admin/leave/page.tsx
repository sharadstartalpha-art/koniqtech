import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Search,
  XCircle
} from "lucide-react"

import {
  LeaveStatus,
  LeaveType,
  Prisma,
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type LeavePageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    leaveType?: string
    from?: string
    to?: string
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


const VALID_STATUSES: LeaveStatus[] = [
  LeaveStatus.pending,
  LeaveStatus.approved,
  LeaveStatus.rejected,
  LeaveStatus.cancelled
]


const VALID_LEAVE_TYPES: LeaveType[] = [
  LeaveType.casual,
  LeaveType.sick,
  LeaveType.earned,
  LeaveType.unpaid,
  LeaveType.maternity,
  LeaveType.paternity,
  LeaveType.emergency
]


// ============================================================
// STATUS LABELS
// ============================================================

const STATUS_LABELS: Record<
  LeaveStatus,
  string
> = {

  pending:
    "Pending",

  approved:
    "Approved",

  rejected:
    "Rejected",

  cancelled:
    "Cancelled"

}


// ============================================================
// LEAVE TYPE LABELS
// ============================================================

const LEAVE_TYPE_LABELS: Record<
  LeaveType,
  string
> = {

  casual:
    "Casual Leave",

  sick:
    "Sick Leave",

  earned:
    "Earned Leave",

  unpaid:
    "Unpaid Leave",

  maternity:
    "Maternity Leave",

  paternity:
    "Paternity Leave",

  emergency:
    "Emergency Leave"

}


// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES: Record<
  LeaveStatus,
  string
> = {

  pending:
    "border-orange-200 bg-orange-50 text-orange-700",

  approved:
    "border-green-200 bg-green-50 text-green-700",

  rejected:
    "border-red-200 bg-red-50 text-red-700",

  cancelled:
    "border-slate-200 bg-slate-50 text-slate-700"

}


// ============================================================
// LEAVE TYPE STYLES
// ============================================================

const LEAVE_TYPE_STYLES: Record<
  LeaveType,
  string
> = {

  casual:
    "border-blue-200 bg-blue-50 text-blue-700",

  sick:
    "border-red-200 bg-red-50 text-red-700",

  earned:
    "border-green-200 bg-green-50 text-green-700",

  unpaid:
    "border-slate-200 bg-slate-50 text-slate-700",

  maternity:
    "border-purple-200 bg-purple-50 text-purple-700",

  paternity:
    "border-cyan-200 bg-cyan-50 text-cyan-700",

  emergency:
    "border-orange-200 bg-orange-50 text-orange-700"

}


// ============================================================
// DATE HELPERS
// ============================================================

function parseStartDate(
  value?: string
) {

  if (!value) {
    return null
  }


  const date =
    new Date(
      `${value}T00:00:00.000Z`
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }


  return date
}


function parseEndDate(
  value?: string
) {

  if (!value) {
    return null
  }


  const date =
    new Date(
      `${value}T23:59:59.999Z`
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }


  return date
}


function getCurrentMonthRange() {

  const now =
    new Date()


  const start =
    new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        1
      )
    )


  const end =
    new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        1
      )
    )


  return {
    start,
    end
  }
}


// ============================================================
// DISPLAY HELPERS
// ============================================================

function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      timeZone:
        "UTC"
    }
  ).format(date)
}


function formatTotalDays(
  days: number
) {

  if (days === 1) {
    return "1 day"
  }


  return `${days.toFixed(
    Number.isInteger(days)
      ? 0
      : 1
  )} days`
}


// ============================================================
// EMPLOYEE NAME
// ============================================================

function getEmployeeName(
  employee: {
    firstName: string
    lastName: string
    email: string
    employeeCode: string
  }
) {

  const fullName =
    [
      employee.firstName,
      employee.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim()


  return (
    fullName ||
    employee.email ||
    employee.employeeCode
  )
}


// ============================================================
// PAGE
// ============================================================

export default async function LeavePage({
  searchParams
}: LeavePageProps) {

  // ----------------------------------------------------------
  // AUTHORIZATION
  // ----------------------------------------------------------

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    redirect("/login")
  }


  const currentRole =
    session.user.role as UserRole


  if (
    !VIEW_ROLES.includes(
      currentRole
    )
  ) {
    redirect(
      "/admin/dashboard"
    )
  }


  const canManage =
    MANAGE_ROLES.includes(
      currentRole
    )


  // ----------------------------------------------------------
  // SEARCH PARAMS
  // ----------------------------------------------------------

  const params =
    await searchParams


  const search =
    params.search
      ?.trim() ??
    ""


  const selectedStatus =
    params.status &&
    VALID_STATUSES.includes(
      params.status as LeaveStatus
    )
      ? params.status as LeaveStatus
      : undefined


  const selectedLeaveType =
    params.leaveType &&
    VALID_LEAVE_TYPES.includes(
      params.leaveType as LeaveType
    )
      ? params.leaveType as LeaveType
      : undefined


  const selectedFrom =
    params.from
      ?.trim() ??
    ""


  const selectedTo =
    params.to
      ?.trim() ??
    ""


  const requestedPage =
    Number(
      params.page ??
      "1"
    )


  const currentPage =
    Number.isInteger(
      requestedPage
    ) &&
    requestedPage > 0
      ? requestedPage
      : 1


  const skip =
    (
      currentPage - 1
    ) * PAGE_SIZE


  // ----------------------------------------------------------
  // DATE FILTERS
  // ----------------------------------------------------------

  const fromDate =
    parseStartDate(
      selectedFrom
    )


  const toDate =
    parseEndDate(
      selectedTo
    )


  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const where:
    Prisma.EmployeeLeaveWhereInput = {

      ...(selectedStatus
        ? {
            status:
              selectedStatus
          }
        : {}),


      ...(selectedLeaveType
        ? {
            leaveType:
              selectedLeaveType
          }
        : {}),


      ...(fromDate || toDate
        ? {

            AND: [

              ...(toDate
                ? [
                    {
                      startDate: {
                        lte:
                          toDate
                      }
                    }
                  ]
                : []),


              ...(fromDate
                ? [
                    {
                      endDate: {
                        gte:
                          fromDate
                      }
                    }
                  ]
                : [])

            ]

          }
        : {}),


      ...(search
        ? {

            employee: {

              is: {

                OR: [

                  {
                    firstName: {
                      contains:
                        search,

                      mode:
                        "insensitive"
                    }
                  },

                  {
                    lastName: {
                      contains:
                        search,

                      mode:
                        "insensitive"
                    }
                  },

                  {
                    email: {
                      contains:
                        search,

                      mode:
                        "insensitive"
                    }
                  },

                  {
                    employeeCode: {
                      contains:
                        search,

                      mode:
                        "insensitive"
                    }
                  },

                  {
                    designation: {
                      contains:
                        search,

                      mode:
                        "insensitive"
                    }
                  },

                  {
                    department: {

                      is: {

                        name: {
                          contains:
                            search,

                          mode:
                            "insensitive"
                        }

                      }

                    }
                  }

                ]

              }

            }

          }
        : {})

    }


  // ----------------------------------------------------------
  // CURRENT MONTH RANGE
  // ----------------------------------------------------------

  const currentMonth =
    getCurrentMonthRange()


  // ----------------------------------------------------------
  // DATABASE QUERIES
  // ----------------------------------------------------------

  const [
    leaveRecords,
    totalRecords,
    pendingCount,
    approvedCount,
    rejectedCount,
    currentMonthApprovedDays
  ] = await Promise.all([

    // --------------------------------------------------------
    // RECORDS
    // --------------------------------------------------------

    prisma.employeeLeave.findMany({

      where,

      orderBy: [

        {
          createdAt:
            "desc"
        },

        {
          startDate:
            "desc"
        }

      ],

      skip,

      take:
        PAGE_SIZE,

      select: {

        id: true,

        leaveType: true,

        startDate: true,

        endDate: true,

        totalDays: true,

        status: true,

        createdAt: true,

        employee: {

          select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            employeeCode: true,

            designation: true,

            department: {

              select: {
                name: true
              }

            }

          }

        },


        approver: {

          select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            employeeCode: true

          }

        }

      }

    }),


    // --------------------------------------------------------
    // FILTERED COUNT
    // --------------------------------------------------------

    prisma.employeeLeave.count({
      where
    }),


    // --------------------------------------------------------
    // PENDING COUNT
    // --------------------------------------------------------

    prisma.employeeLeave.count({

      where: {
        status:
          LeaveStatus.pending
      }

    }),


    // --------------------------------------------------------
    // APPROVED COUNT
    // --------------------------------------------------------

    prisma.employeeLeave.count({

      where: {
        status:
          LeaveStatus.approved
      }

    }),


    // --------------------------------------------------------
    // REJECTED COUNT
    // --------------------------------------------------------

    prisma.employeeLeave.count({

      where: {
        status:
          LeaveStatus.rejected
      }

    }),


    // --------------------------------------------------------
    // APPROVED DAYS THIS MONTH
    // --------------------------------------------------------

    prisma.employeeLeave.aggregate({

      where: {

        status:
          LeaveStatus.approved,

        startDate: {
          lt:
            currentMonth.end
        },

        endDate: {
          gte:
            currentMonth.start
        }

      },

      _sum: {
        totalDays:
          true
      }

    })

  ])


  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  const approvedDaysThisMonth =
    currentMonthApprovedDays
      ._sum
      .totalDays ??
    0


  // ----------------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------------

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalRecords /
        PAGE_SIZE
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


    if (selectedLeaveType) {

      query.set(
        "leaveType",
        selectedLeaveType
      )
    }


    if (selectedFrom) {

      query.set(
        "from",
        selectedFrom
      )
    }


    if (selectedTo) {

      query.set(
        "to",
        selectedTo
      )
    }


    query.set(
      "page",
      String(page)
    )


    return (
      `/admin/leave?${query.toString()}`
    )
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-semibold
              tracking-tight
              text-slate-900
            "
          >
            Leave Management
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Manage employee leave requests,
            approvals, rejections, and cancellations.
          </p>

        </div>


        {canManage && (

          <Link
            href="/admin/leave/new"
            className="
              inline-flex h-11
              items-center justify-center
              gap-2
              rounded-lg
              bg-green-600
              px-4
              text-sm font-medium
              text-white
              shadow-sm
              transition
              hover:bg-green-700
              focus:outline-none
              focus:ring-2
              focus:ring-green-500
              focus:ring-offset-2
            "
          >
            <CalendarPlus className="h-4 w-4" />

            New Leave Request
          </Link>

        )}

      </div>


      {/* ==================================================== */}
      {/* SUMMARY CARDS */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <SummaryCard
          title="Pending Requests"
          value={pendingCount}
          description="Awaiting decision"
          icon={Clock3}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />


        <SummaryCard
          title="Approved Requests"
          value={approvedCount}
          description="Approved leave requests"
          icon={CheckCircle2}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />


        <SummaryCard
          title="Rejected Requests"
          value={rejectedCount}
          description="Rejected leave requests"
          icon={XCircle}
          iconClassName="
            bg-red-50
            text-red-600
          "
        />


        <SummaryCard
          title="Approved Days"
          value={approvedDaysThisMonth}
          description="Approved days this month"
          icon={CalendarCheck2}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />

      </div>


      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <div
        className="
          rounded-xl
          border border-slate-200
          bg-white
          p-4
          shadow-sm
        "
      >

        <form
          method="GET"
          className="
            grid gap-3
            md:grid-cols-2
            xl:grid-cols-6
          "
        >

          {/* SEARCH */}

          <div
            className="
              relative
              md:col-span-2
              xl:col-span-2
            "
          >

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
              placeholder="Search employee, email, code..."
              className="
                h-10 w-full
                rounded-lg
                border border-slate-300
                bg-white
                pl-9 pr-3
                text-sm
                text-slate-900
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
              selectedStatus ??
              ""
            }
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
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
                  {
                    STATUS_LABELS[
                      status
                    ]
                  }
                </option>

              )
            )}

          </select>


          {/* LEAVE TYPE */}

          <select
            name="leaveType"
            defaultValue={
              selectedLeaveType ??
              ""
            }
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          >

            <option value="">
              All leave types
            </option>


            {VALID_LEAVE_TYPES.map(
              (leaveType) => (

                <option
                  key={leaveType}
                  value={leaveType}
                >
                  {
                    LEAVE_TYPE_LABELS[
                      leaveType
                    ]
                  }
                </option>

              )
            )}

          </select>


          {/* FROM */}

          <input
            type="date"
            name="from"
            defaultValue={
              selectedFrom
            }
            aria-label="Leave from date"
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />


          {/* TO */}

          <input
            type="date"
            name="to"
            defaultValue={
              selectedTo
            }
            aria-label="Leave to date"
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />


          {/* FILTER ACTIONS */}

          <div
            className="
              flex gap-2
              md:col-span-2
              xl:col-span-6
              xl:justify-end
            "
          >

            <button
              type="submit"
              className="
                inline-flex h-10
                items-center justify-center
                rounded-lg
                bg-blue-600
                px-5
                text-sm font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Apply Filters
            </button>


            <Link
              href="/admin/leave"
              className="
                inline-flex h-10
                items-center justify-center
                rounded-lg
                border border-orange-200
                bg-orange-50
                px-5
                text-sm font-medium
                text-orange-700
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
      {/* TABLE CONTAINER */}
      {/* ==================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* TABLE TITLE */}

        <div
          className="
            flex flex-col gap-2
            border-b border-slate-200
            px-5 py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                font-semibold
                text-slate-900
              "
            >
              Leave Requests
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {totalRecords} request
              {totalRecords === 1
                ? ""
                : "s"}{" "}
              found
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* EMPTY STATE */}
        {/* ================================================== */}

        {leaveRecords.length === 0 ? (

          <div
            className="
              px-6 py-16
              text-center
            "
          >

            <CalendarDays
              className="
                mx-auto
                h-11 w-11
                text-slate-300
              "
            />


            <h3
              className="
                mt-4
                font-medium
                text-slate-900
              "
            >
              No leave requests found
            </h3>


            <p
              className="
                mx-auto mt-2
                max-w-md
                text-sm leading-6
                text-slate-500
              "
            >
              No employee leave requests match the
              current search or filter criteria.
            </p>


            {canManage && (

              <Link
                href="/admin/leave/new"
                className="
                  mt-5
                  inline-flex h-10
                  items-center justify-center
                  gap-2
                  rounded-lg
                  bg-green-600
                  px-4
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <CalendarPlus className="h-4 w-4" />

                New Leave Request
              </Link>

            )}

          </div>

        ) : (

          /* ================================================= */
          /* TABLE */
          /* ================================================= */

          <div className="overflow-x-auto">

            <table
              className="
                min-w-full
                divide-y
                divide-slate-200
              "
            >

              <thead className="bg-slate-50">

                <tr>

                  <TableHeading>
                    Employee
                  </TableHeading>

                  <TableHeading>
                    Leave Type
                  </TableHeading>

                  <TableHeading>
                    Period
                  </TableHeading>

                  <TableHeading>
                    Days
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Decision
                  </TableHeading>

                  <TableHeading align="right">
                    Action
                  </TableHeading>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-100
                  bg-white
                "
              >

                {leaveRecords.map(
                  (leave) => {

                    const employeeName =
                      getEmployeeName(
                        leave.employee
                      )


                    const approverName =
                      leave.approver
                        ? getEmployeeName(
                            leave.approver
                          )
                        : null


                    return (

                      <tr
                        key={leave.id}
                        className="
                          transition
                          hover:bg-slate-50
                        "
                      >

                        {/* EMPLOYEE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <div
                            className="
                              flex items-center
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex h-10 w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-sm
                                font-semibold
                                text-blue-700
                              "
                            >
                              {employeeName
                                .charAt(0)
                                .toUpperCase()}
                            </div>


                            <div className="min-w-0">

                              <p
                                className="
                                  max-w-[220px]
                                  truncate
                                  text-sm
                                  font-medium
                                  text-slate-900
                                "
                              >
                                {employeeName}
                              </p>


                              <p
                                className="
                                  max-w-[220px]
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  leave.employee
                                    .designation ||
                                  leave.employee
                                    .department
                                    .name ||
                                  leave.employee
                                    .employeeCode
                                }
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  max-w-[220px]
                                  truncate
                                  text-xs
                                  text-slate-400
                                "
                              >
                                {
                                  leave.employee
                                    .employeeCode
                                }
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* LEAVE TYPE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs font-medium
                              ${
                                LEAVE_TYPE_STYLES[
                                  leave.leaveType
                                ]
                              }
                            `}
                          >
                            {
                              LEAVE_TYPE_LABELS[
                                leave.leaveType
                              ]
                            }
                          </span>

                        </td>


                        {/* PERIOD */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <p
                            className="
                              text-sm font-medium
                              text-slate-900
                            "
                          >
                            {formatDate(
                              leave.startDate
                            )}
                          </p>


                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-slate-500
                            "
                          >
                            to{" "}
                            {formatDate(
                              leave.endDate
                            )}
                          </p>

                        </td>


                        {/* DAYS */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                            text-sm font-medium
                            text-slate-700
                          "
                        >
                          {formatTotalDays(
                            leave.totalDays
                          )}
                        </td>


                        {/* STATUS */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <span
                            className={`
                              inline-flex
                              rounded-full
                              border
                              px-2.5 py-1
                              text-xs font-medium
                              ${
                                STATUS_STYLES[
                                  leave.status
                                ]
                              }
                            `}
                          >
                            {
                              STATUS_LABELS[
                                leave.status
                              ]
                            }
                          </span>

                        </td>


                        {/* DECISION */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          {leave.status ===
                            LeaveStatus.pending ? (

                            <span
                              className="
                                text-sm
                                text-orange-600
                              "
                            >
                              Awaiting review
                            </span>

                          ) : leave.status ===
                              LeaveStatus.cancelled ? (

                            <span
                              className="
                                text-sm
                                text-slate-500
                              "
                            >
                              Cancelled
                            </span>

                          ) : (

                            <div>

                              <p
                                className="
                                  max-w-[180px]
                                  truncate
                                  text-sm
                                  font-medium
                                  text-slate-700
                                "
                              >
                                {approverName ||
                                  "Internal Approver"}
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  leave.status ===
                                  LeaveStatus.approved
                                    ? "Approved"
                                    : "Rejected"
                                }
                              </p>

                            </div>

                          )}

                        </td>


                        {/* ACTION */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                            text-right
                          "
                        >

                          <Link
                            href={
                              `/admin/leave/${leave.id}`
                            }
                            className="
                              inline-flex h-9
                              items-center justify-center
                              rounded-lg
                              bg-blue-50
                              px-3
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

            <div>

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                Page {currentPage} of {totalPages}
              </p>


              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                "
              >
                Showing up to {PAGE_SIZE} requests
                per page
              </p>

            </div>


            <div
              className="
                flex items-center
                gap-2
              "
            >

              {currentPage > 1 ? (

                <Link
                  href={
                    buildPageUrl(
                      currentPage - 1
                    )
                  }
                  className="
                    inline-flex h-9
                    items-center justify-center
                    rounded-lg
                    border border-orange-200
                    bg-orange-50
                    px-3
                    text-sm font-medium
                    text-orange-700
                    transition
                    hover:bg-orange-100
                  "
                >
                  Previous
                </Link>

              ) : (

                <span
                  className="
                    inline-flex h-9
                    cursor-not-allowed
                    items-center justify-center
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
                  href={
                    buildPageUrl(
                      currentPage + 1
                    )
                  }
                  className="
                    inline-flex h-9
                    items-center justify-center
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
                    inline-flex h-9
                    cursor-not-allowed
                    items-center justify-center
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
    <div
      className="
        rounded-xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex items-start
          justify-between
          gap-4
        "
      >

        <div>

          <p
            className="
              text-sm font-medium
              text-slate-500
            "
          >
            {title}
          </p>


          <p
            className="
              mt-2
              text-3xl font-semibold
              tracking-tight
              text-slate-900
            "
          >
            {value}
          </p>


          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {description}
          </p>

        </div>


        <div
          className={`
            flex h-11 w-11
            shrink-0
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