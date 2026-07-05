import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Plus,
  Search,
  Users,
  WalletCards
} from "lucide-react"

import {
  Prisma,
  SalaryStatus,
  SalaryType,
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type PayrollPageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    salaryType?: string
    month?: string
    year?: string
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


const VALID_STATUSES =
  Object.values(
    SalaryStatus
  )


const VALID_SALARY_TYPES =
  Object.values(
    SalaryType
  )


const MONTHS = [
  {
    value: 1,
    label: "January"
  },
  {
    value: 2,
    label: "February"
  },
  {
    value: 3,
    label: "March"
  },
  {
    value: 4,
    label: "April"
  },
  {
    value: 5,
    label: "May"
  },
  {
    value: 6,
    label: "June"
  },
  {
    value: 7,
    label: "July"
  },
  {
    value: 8,
    label: "August"
  },
  {
    value: 9,
    label: "September"
  },
  {
    value: 10,
    label: "October"
  },
  {
    value: 11,
    label: "November"
  },
  {
    value: 12,
    label: "December"
  }
]


// ============================================================
// STATUS LABELS
// ============================================================

const STATUS_LABELS: Record<
  SalaryStatus,
  string
> = {

  pending:
    "Pending",

  processed:
    "Processed",

  paid:
    "Paid",

  failed:
    "Failed"

}


// ============================================================
// STATUS STYLES
// ============================================================

const STATUS_STYLES: Record<
  SalaryStatus,
  string
> = {

  pending:
    "border-orange-200 bg-orange-50 text-orange-700",

  processed:
    "border-blue-200 bg-blue-50 text-blue-700",

  paid:
    "border-green-200 bg-green-50 text-green-700",

  failed:
    "border-red-200 bg-red-50 text-red-700"

}


// ============================================================
// SALARY TYPE LABEL
// ============================================================

function formatSalaryType(
  salaryType: SalaryType
) {

  return salaryType
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
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
// CURRENCY FORMATTER
// ============================================================

function formatCurrency(
  value:
    | Prisma.Decimal
    | number
    | string
) {

  const amount =
    Number(value)


  return new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2
    }
  ).format(amount)
}


// ============================================================
// DATE FORMATTER
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


// ============================================================
// MONTH NAME
// ============================================================

function getMonthName(
  month: number
) {

  return (
    MONTHS.find(
      (item) =>
        item.value === month
    )?.label ??
    `Month ${month}`
  )
}


// ============================================================
// INTEGER PARSER
// ============================================================

function parseInteger(
  value?: string
) {

  if (!value) {
    return undefined
  }


  const parsed =
    Number(value)


  if (
    !Number.isInteger(parsed)
  ) {
    return undefined
  }


  return parsed
}


// ============================================================
// PAGE
// ============================================================

export default async function PayrollPage({
  searchParams
}: PayrollPageProps) {

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
      params.status as SalaryStatus
    )
      ? params.status as SalaryStatus
      : undefined


  const selectedSalaryType =
    params.salaryType &&
    VALID_SALARY_TYPES.includes(
      params.salaryType as SalaryType
    )
      ? params.salaryType as SalaryType
      : undefined


  const monthValue =
    parseInteger(
      params.month
    )


  const selectedMonth =
    monthValue &&
    monthValue >= 1 &&
    monthValue <= 12
      ? monthValue
      : undefined


  const yearValue =
    parseInteger(
      params.year
    )


  const selectedYear =
    yearValue &&
    yearValue >= 2000 &&
    yearValue <= 2200
      ? yearValue
      : undefined


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
  // CURRENT PERIOD
  // ----------------------------------------------------------

  const now =
    new Date()


  const currentMonth =
    now.getUTCMonth() + 1


  const currentYear =
    now.getUTCFullYear()


  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const where:
    Prisma.EmployeeSalaryWhereInput = {

      ...(selectedStatus
        ? {
            status:
              selectedStatus
          }
        : {}),


      ...(selectedSalaryType
        ? {
            salaryType:
              selectedSalaryType
          }
        : {}),


      ...(selectedMonth
        ? {
            payMonth:
              selectedMonth
          }
        : {}),


      ...(selectedYear
        ? {
            payYear:
              selectedYear
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
  // DATABASE QUERIES
  // ----------------------------------------------------------

  const [
    payrollRecords,
    totalRecords,
    pendingCount,
    processedCount,
    paidCount,
    failedCount,
    currentPeriodSummary
  ] = await Promise.all([

    // --------------------------------------------------------
    // PAYROLL RECORDS
    // --------------------------------------------------------

    prisma.employeeSalary.findMany({

      where,

      orderBy: [

        {
          payYear:
            "desc"
        },

        {
          payMonth:
            "desc"
        },

        {
          createdAt:
            "desc"
        }

      ],

      skip,

      take:
        PAGE_SIZE,

      select: {

        id: true,

        salaryType: true,

        basicSalary: true,

        hra: true,

        allowance: true,

        bonus: true,

        incentive: true,

        overtime: true,

        deductions: true,

        tax: true,

        netSalary: true,

        payMonth: true,

        payYear: true,

        paymentDate: true,

        paymentMethod: true,

        transactionId: true,

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

            active: true,


            department: {

              select: {
                name: true
              }

            }

          }

        }

      }

    }),


    // --------------------------------------------------------
    // FILTERED COUNT
    // --------------------------------------------------------

    prisma.employeeSalary.count({
      where
    }),


    // --------------------------------------------------------
    // PENDING COUNT
    // --------------------------------------------------------

    prisma.employeeSalary.count({

      where: {
        status:
          SalaryStatus.pending
      }

    }),


    // --------------------------------------------------------
    // PROCESSED COUNT
    // --------------------------------------------------------

    prisma.employeeSalary.count({

      where: {
        status:
          SalaryStatus.processed
      }

    }),


    // --------------------------------------------------------
    // PAID COUNT
    // --------------------------------------------------------

    prisma.employeeSalary.count({

      where: {
        status:
          SalaryStatus.paid
      }

    }),


    // --------------------------------------------------------
    // FAILED COUNT
    // --------------------------------------------------------

    prisma.employeeSalary.count({

      where: {
        status:
          SalaryStatus.failed
      }

    }),


    // --------------------------------------------------------
    // CURRENT PERIOD SUMMARY
    // --------------------------------------------------------

    prisma.employeeSalary.aggregate({

      where: {

        payMonth:
          currentMonth,

        payYear:
          currentYear

      },

      _sum: {

        netSalary:
          true

      },

      _count: {
        id:
          true
      }

    })

  ])


  // ----------------------------------------------------------
  // SUMMARY VALUES
  // ----------------------------------------------------------

  const currentPeriodPayroll =
    currentPeriodSummary
      ._sum
      .netSalary ??
    new Prisma.Decimal(0)


  const currentPeriodEmployees =
    currentPeriodSummary
      ._count
      .id


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


    if (selectedSalaryType) {

      query.set(
        "salaryType",
        selectedSalaryType
      )
    }


    if (selectedMonth) {

      query.set(
        "month",
        String(
          selectedMonth
        )
      )
    }


    if (selectedYear) {

      query.set(
        "year",
        String(
          selectedYear
        )
      )
    }


    query.set(
      "page",
      String(page)
    )


    return (
      `/admin/payroll?${query.toString()}`
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
            Payroll Management
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Manage employee salary records,
            processing status, payments, and
            monthly payroll history.
          </p>

        </div>


        {canManage && (

          <Link
            href="/admin/payroll/new"
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
            <Plus className="h-4 w-4" />

            New Payroll
          </Link>

        )}

      </div>


      {/* ==================================================== */}
      {/* CURRENT PERIOD CARD */}
      {/* ==================================================== */}

      <div
        className="
          rounded-xl
          border border-blue-200
          bg-blue-50
          p-5
        "
      >

        <div
          className="
            flex flex-col gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div
            className="
              flex items-center gap-4
            "
          >

            <div
              className="
                flex h-12 w-12
                shrink-0
                items-center justify-center
                rounded-xl
                bg-blue-100
                text-blue-700
              "
            >
              <CircleDollarSign className="h-6 w-6" />
            </div>


            <div>

              <p
                className="
                  text-sm font-medium
                  text-blue-700
                "
              >
                Current Payroll Period
              </p>


              <h2
                className="
                  mt-1
                  text-xl font-semibold
                  text-blue-950
                "
              >
                {getMonthName(
                  currentMonth
                )}{" "}
                {currentYear}
              </h2>

            </div>

          </div>


          <div
            className="
              grid grid-cols-2
              gap-6
              sm:text-right
            "
          >

            <div>

              <p
                className="
                  text-xs font-medium
                  uppercase tracking-wide
                  text-blue-600
                "
              >
                Employees
              </p>


              <p
                className="
                  mt-1
                  text-lg font-semibold
                  text-blue-950
                "
              >
                {currentPeriodEmployees}
              </p>

            </div>


            <div>

              <p
                className="
                  text-xs font-medium
                  uppercase tracking-wide
                  text-blue-600
                "
              >
                Net Payroll
              </p>


              <p
                className="
                  mt-1
                  text-lg font-semibold
                  text-blue-950
                "
              >
                {formatCurrency(
                  currentPeriodPayroll
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* STATUS SUMMARY */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <SummaryCard
          title="Pending"
          value={pendingCount}
          description="Awaiting processing"
          icon={Clock3}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />


        <SummaryCard
          title="Processed"
          value={processedCount}
          description="Ready for payment"
          icon={WalletCards}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />


        <SummaryCard
          title="Paid"
          value={paidCount}
          description="Successfully paid"
          icon={CheckCircle2}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />


        <SummaryCard
          title="Failed"
          value={failedCount}
          description="Payment requires attention"
          icon={AlertCircle}
          iconClassName="
            bg-red-50
            text-red-600
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


          {/* SALARY TYPE */}

          <select
            name="salaryType"
            defaultValue={
              selectedSalaryType ??
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
              All salary types
            </option>


            {VALID_SALARY_TYPES.map(
              (salaryType) => (

                <option
                  key={salaryType}
                  value={salaryType}
                >
                  {
                    formatSalaryType(
                      salaryType
                    )
                  }
                </option>

              )
            )}

          </select>


          {/* MONTH */}

          <select
            name="month"
            defaultValue={
              selectedMonth
                ? String(
                    selectedMonth
                  )
                : ""
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
              All months
            </option>


            {MONTHS.map(
              (month) => (

                <option
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </option>

              )
            )}

          </select>


          {/* YEAR */}

          <input
            type="number"
            name="year"
            min="2000"
            max="2200"
            defaultValue={
              selectedYear ??
              ""
            }
            placeholder="Year"
            className="
              h-10 w-full
              rounded-lg
              border border-slate-300
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
            "
          />


          {/* ACTIONS */}

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
              href="/admin/payroll"
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
      {/* PAYROLL TABLE */}
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

        {/* TABLE HEADER */}

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
              Payroll Records
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {totalRecords} record
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

        {payrollRecords.length === 0 ? (

          <div
            className="
              px-6 py-16
              text-center
            "
          >

            <Banknote
              className="
                mx-auto
                h-12 w-12
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
              No payroll records found
            </h3>


            <p
              className="
                mx-auto mt-2
                max-w-md
                text-sm leading-6
                text-slate-500
              "
            >
              No employee payroll records match
              the current search and filter criteria.
            </p>


            {canManage && (

              <Link
                href="/admin/payroll/new"
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
                <Plus className="h-4 w-4" />

                Create Payroll
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
                    Pay Period
                  </TableHeading>

                  <TableHeading>
                    Salary Type
                  </TableHeading>

                  <TableHeading>
                    Basic Salary
                  </TableHeading>

                  <TableHeading>
                    Net Salary
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Payment
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

                {payrollRecords.map(
                  (payroll) => {

                    const employeeName =
                      getEmployeeName(
                        payroll.employee
                      )


                    return (

                      <tr
                        key={payroll.id}
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
                              flex items-center gap-3
                            "
                          >

                            <div
                              className="
                                flex h-10 w-10
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

                              <p
                                className="
                                  max-w-[220px]
                                  truncate
                                  text-sm font-medium
                                  text-slate-900
                                "
                              >
                                {employeeName}
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  max-w-[220px]
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  payroll.employee
                                    .designation ||
                                  payroll.employee
                                    .department.name
                                }
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  text-slate-400
                                "
                              >
                                {
                                  payroll.employee
                                    .employeeCode
                                }
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* PAY PERIOD */}

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
                            {getMonthName(
                              payroll.payMonth
                            )}
                          </p>


                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-slate-500
                            "
                          >
                            {payroll.payYear}
                          </p>

                        </td>


                        {/* SALARY TYPE */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <span
                            className="
                              inline-flex
                              rounded-full
                              border border-blue-200
                              bg-blue-50
                              px-2.5 py-1
                              text-xs font-medium
                              text-blue-700
                            "
                          >
                            {formatSalaryType(
                              payroll.salaryType
                            )}
                          </span>

                        </td>


                        {/* BASIC */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                            text-sm
                            text-slate-700
                          "
                        >
                          {formatCurrency(
                            payroll.basicSalary
                          )}
                        </td>


                        {/* NET */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          <p
                            className="
                              text-sm font-semibold
                              text-slate-900
                            "
                          >
                            {formatCurrency(
                              payroll.netSalary
                            )}
                          </p>

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
                                  payroll.status
                                ]
                              }
                            `}
                          >
                            {
                              STATUS_LABELS[
                                payroll.status
                              ]
                            }
                          </span>

                        </td>


                        {/* PAYMENT */}

                        <td
                          className="
                            whitespace-nowrap
                            px-5 py-4
                          "
                        >

                          {payroll.paymentDate ? (

                            <div>

                              <p
                                className="
                                  text-sm font-medium
                                  text-slate-700
                                "
                              >
                                {formatDate(
                                  payroll.paymentDate
                                )}
                              </p>


                              <p
                                className="
                                  mt-0.5
                                  max-w-[160px]
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  payroll.paymentMethod ||
                                  "Payment recorded"
                                }
                              </p>

                            </div>

                          ) : (

                            <span
                              className="
                                text-sm
                                text-slate-400
                              "
                            >
                              Not paid
                            </span>

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
                              `/admin/payroll/${payroll.id}`
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
                Showing up to {PAGE_SIZE} payroll
                records per page
              </p>

            </div>


            <div
              className="
                flex items-center gap-2
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