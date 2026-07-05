import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileText,
  Mail,
  ReceiptText,
  ShieldCheck,
  UserRound,
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

import PayrollActions from "../components/PayrollActions"


// ============================================================
// TYPES
// ============================================================

type PayrollDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}


// ============================================================
// ACCESS ROLES
// ============================================================

const VIEW_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// MONTHS
// ============================================================

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
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
// STATUS DESCRIPTION
// ============================================================

const STATUS_DESCRIPTIONS: Record<
  SalaryStatus,
  string
> = {
  pending:
    "Payroll is awaiting processing.",

  processed:
    "Payroll has been processed and is ready for payment.",

  paid:
    "Payroll payment has been successfully recorded.",

  failed:
    "Payroll processing or payment requires attention."
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
  ).format(
    Number(value)
  )
}


// ============================================================
// DATE FORMATTER
// ============================================================

function formatDate(
  date: Date | null
) {

  if (!date) {
    return "Not recorded"
  }


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
// DATE TIME FORMATTER
// ============================================================

function formatDateTime(
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

      hour:
        "2-digit",

      minute:
        "2-digit"
    }
  ).format(date)
}


// ============================================================
// ENUM LABEL
// ============================================================

function formatEnumLabel(
  value: string
) {

  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
}


// ============================================================
// PAGE
// ============================================================

export default async function PayrollDetailsPage({
  params
}: PayrollDetailsPageProps) {

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
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } = await params


  if (!id) {
    notFound()
  }


  // ----------------------------------------------------------
  // LOAD PAYROLL
  // ----------------------------------------------------------

  const payroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id
      },

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

        remarks: true,

        createdAt: true,

        updatedAt: true,


        employee: {

          select: {

            id: true,

            employeeCode: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

            designation: true,

            employmentType: true,

            salaryType: true,

            joiningDate: true,

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

        }

      }

    })


  if (!payroll) {
    notFound()
  }


  // ----------------------------------------------------------
  // EMPLOYEE NAME
  // ----------------------------------------------------------

  const employeeName =
    [
      payroll.employee.firstName,
      payroll.employee.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    payroll.employee.email ||
    payroll.employee.employeeCode


  // ----------------------------------------------------------
  // SALARY CALCULATIONS
  // ----------------------------------------------------------

  const grossEarnings =
    payroll.basicSalary
      .plus(payroll.hra)
      .plus(payroll.allowance)
      .plus(payroll.bonus)
      .plus(payroll.incentive)
      .plus(payroll.overtime)


  const totalDeductions =
    payroll.deductions
      .plus(payroll.tax)


  const payPeriod =
    `${
      MONTHS[
        payroll.payMonth - 1
      ] ??
      `Month ${payroll.payMonth}`
    } ${payroll.payYear}`


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK LINK */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/payroll"
          className="
            inline-flex
            items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Payroll
        </Link>

      </div>


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-5
          xl:flex-row
          xl:items-start
          xl:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <CircleDollarSign className="h-7 w-7" />
          </div>


          <div>

            <div
              className="
                flex flex-wrap
                items-center gap-3
              "
            >

              <h1
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  text-slate-900
                "
              >
                {employeeName}
              </h1>


              <span
                className={`
                  inline-flex
                  rounded-full
                  border
                  px-2.5 py-1
                  text-xs font-medium
                  ${STATUS_STYLES[
                    payroll.status
                  ]}
                `}
              >
                {
                  STATUS_LABELS[
                    payroll.status
                  ]
                }
              </span>

            </div>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Payroll record for {payPeriod}
            </p>


            <p
              className="
                mt-1
                text-xs
                text-slate-400
              "
            >
              Employee Code:{" "}
              {payroll.employee.employeeCode}
            </p>

          </div>

        </div>


        {canManage && (

          <PayrollActions
            payrollId={
              payroll.id
            }
            employeeName={
              employeeName
            }
            status={
              payroll.status
            }
            canEdit={
              true
            }
            canDelete={
              true
            }
            canManagePayment={
              true
            }
          />

        )}

      </div>


      {/* ==================================================== */}
      {/* STATUS BANNER */}
      {/* ==================================================== */}

      <StatusBanner
        status={
          payroll.status
        }
      />


      {/* ==================================================== */}
      {/* PAYROLL SUMMARY */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        <SummaryCard
          label="Basic Salary"
          value={
            formatCurrency(
              payroll.basicSalary
            )
          }
          description="Base salary"
          icon={Banknote}
          iconClassName="
            bg-blue-50
            text-blue-600
          "
        />


        <SummaryCard
          label="Gross Earnings"
          value={
            formatCurrency(
              grossEarnings
            )
          }
          description="Total earnings"
          icon={WalletCards}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />


        <SummaryCard
          label="Total Deductions"
          value={
            formatCurrency(
              totalDeductions
            )
          }
          description="Deductions and tax"
          icon={ReceiptText}
          iconClassName="
            bg-orange-50
            text-orange-600
          "
        />


        <SummaryCard
          label="Net Salary"
          value={
            formatCurrency(
              payroll.netSalary
            )
          }
          description="Final payable amount"
          icon={CircleDollarSign}
          iconClassName="
            bg-green-50
            text-green-600
          "
        />

      </div>


      {/* ==================================================== */}
      {/* MAIN GRID */}
      {/* ==================================================== */}

      <div
        className="
          grid gap-6
          xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]
        "
      >

        {/* ================================================== */}
        {/* LEFT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* EARNINGS BREAKDOWN */}
          {/* ================================================= */}

          <DetailsSection
            title="Earnings Breakdown"
            description="Salary components included in gross earnings."
            icon={CircleDollarSign}
          >

            <div
              className="
                divide-y
                divide-slate-100
              "
            >

              <AmountRow
                label="Basic Salary"
                value={
                  payroll.basicSalary
                }
              />


              <AmountRow
                label="HRA"
                value={
                  payroll.hra
                }
              />


              <AmountRow
                label="Allowance"
                value={
                  payroll.allowance
                }
              />


              <AmountRow
                label="Bonus"
                value={
                  payroll.bonus
                }
              />


              <AmountRow
                label="Incentive"
                value={
                  payroll.incentive
                }
              />


              <AmountRow
                label="Overtime"
                value={
                  payroll.overtime
                }
              />


              <div
                className="
                  flex items-center
                  justify-between gap-4
                  bg-green-50
                  px-5 py-4
                "
              >

                <span
                  className="
                    text-sm font-semibold
                    text-green-800
                  "
                >
                  Gross Earnings
                </span>


                <span
                  className="
                    text-base font-semibold
                    text-green-900
                  "
                >
                  {formatCurrency(
                    grossEarnings
                  )}
                </span>

              </div>

            </div>

          </DetailsSection>


          {/* ================================================= */}
          {/* DEDUCTIONS */}
          {/* ================================================= */}

          <DetailsSection
            title="Deductions & Tax"
            description="Amounts deducted from gross earnings."
            icon={ReceiptText}
          >

            <div
              className="
                divide-y
                divide-slate-100
              "
            >

              <AmountRow
                label="Other Deductions"
                value={
                  payroll.deductions
                }
              />


              <AmountRow
                label="Tax"
                value={
                  payroll.tax
                }
              />


              <div
                className="
                  flex items-center
                  justify-between gap-4
                  bg-orange-50
                  px-5 py-4
                "
              >

                <span
                  className="
                    text-sm font-semibold
                    text-orange-800
                  "
                >
                  Total Deductions
                </span>


                <span
                  className="
                    text-base font-semibold
                    text-orange-900
                  "
                >
                  {formatCurrency(
                    totalDeductions
                  )}
                </span>

              </div>

            </div>

          </DetailsSection>


          {/* ================================================= */}
          {/* FINAL SALARY */}
          {/* ================================================= */}

          <div
            className="
              rounded-xl
              border border-green-200
              bg-green-50
              p-6
            "
          >

            <div
              className="
                flex flex-col gap-5
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
                    bg-green-100
                    text-green-700
                  "
                >
                  <CircleDollarSign className="h-6 w-6" />
                </div>


                <div>

                  <p
                    className="
                      text-sm font-medium
                      text-green-700
                    "
                  >
                    Final Net Salary
                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-green-600
                    "
                  >
                    Gross earnings minus total deductions
                  </p>

                </div>

              </div>


              <p
                className="
                  text-3xl font-semibold
                  tracking-tight
                  text-green-950
                "
              >
                {formatCurrency(
                  payroll.netSalary
                )}
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* REMARKS */}
          {/* ================================================= */}

          <DetailsSection
            title="Payroll Remarks"
            description="Internal notes associated with this payroll record."
            icon={FileText}
          >

            <div className="p-5">

              {payroll.remarks ? (

                <p
                  className="
                    whitespace-pre-wrap
                    text-sm leading-7
                    text-slate-700
                  "
                >
                  {payroll.remarks}
                </p>

              ) : (

                <p
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  No remarks have been added.
                </p>

              )}

            </div>

          </DetailsSection>

        </div>


        {/* ================================================== */}
        {/* RIGHT COLUMN */}
        {/* ================================================== */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* PAYROLL INFORMATION */}
          {/* ================================================= */}

          <DetailsSection
            title="Payroll Information"
            description="Period and salary configuration."
            icon={CalendarDays}
          >

            <div className="p-5">

              <div
                className="
                  space-y-5
                "
              >

                <InfoRow
                  label="Pay Period"
                  value={payPeriod}
                />


                <InfoRow
                  label="Pay Month"
                  value={
                    MONTHS[
                      payroll.payMonth - 1
                    ] ??
                    String(
                      payroll.payMonth
                    )
                  }
                />


                <InfoRow
                  label="Pay Year"
                  value={
                    String(
                      payroll.payYear
                    )
                  }
                />


                <InfoRow
                  label="Salary Type"
                  value={
                    formatEnumLabel(
                      payroll.salaryType
                    )
                  }
                />


                <InfoRow
                  label="Payroll Status"
                  value={
                    STATUS_LABELS[
                      payroll.status
                    ]
                  }
                />

              </div>

            </div>

          </DetailsSection>


          {/* ================================================= */}
          {/* PAYMENT INFORMATION */}
          {/* ================================================= */}

          <DetailsSection
            title="Payment Information"
            description="Recorded salary payment details."
            icon={CreditCard}
          >

            <div className="p-5">

              <div className="space-y-5">

                <InfoRow
                  label="Payment Date"
                  value={
                    formatDate(
                      payroll.paymentDate
                    )
                  }
                />


                <InfoRow
                  label="Payment Method"
                  value={
                    payroll.paymentMethod ||
                    "Not recorded"
                  }
                />


                <InfoRow
                  label="Transaction ID"
                  value={
                    payroll.transactionId ||
                    "Not recorded"
                  }
                  breakWords
                />

              </div>

            </div>

          </DetailsSection>


          {/* ================================================= */}
          {/* EMPLOYEE INFORMATION */}
          {/* ================================================= */}

          <DetailsSection
            title="Employee Information"
            description="Employee associated with this payroll."
            icon={UserRound}
          >

            <div className="p-5">

              <div className="space-y-5">

                <InfoRow
                  label="Employee"
                  value={
                    employeeName
                  }
                />


                <InfoRow
                  label="Employee Code"
                  value={
                    payroll.employee
                      .employeeCode
                  }
                />


                <InfoRow
                  label="Email"
                  value={
                    payroll.employee.email
                  }
                  breakWords
                />


                <InfoRow
                  label="Phone"
                  value={
                    payroll.employee.phone ||
                    "Not provided"
                  }
                />


                <InfoRow
                  label="Department"
                  value={
                    payroll.employee
                      .department.name
                  }
                />


                <InfoRow
                  label="Role"
                  value={
                    payroll.employee
                      .role.name
                  }
                />


                <InfoRow
                  label="Designation"
                  value={
                    payroll.employee
                      .designation ||
                    "Not assigned"
                  }
                />


                <InfoRow
                  label="Employment Type"
                  value={
                    payroll.employee
                      .employmentType
                      ? formatEnumLabel(
                          payroll.employee
                            .employmentType
                        )
                      : "Not specified"
                  }
                />


                <InfoRow
                  label="Joining Date"
                  value={
                    formatDate(
                      payroll.employee
                        .joiningDate
                    )
                  }
                />

              </div>

            </div>

          </DetailsSection>


          {/* ================================================= */}
          {/* RECORD INFORMATION */}
          {/* ================================================= */}

          <DetailsSection
            title="Record Information"
            description="Payroll record timestamps."
            icon={Clock3}
          >

            <div className="p-5">

              <div className="space-y-5">

                <InfoRow
                  label="Created"
                  value={
                    formatDateTime(
                      payroll.createdAt
                    )
                  }
                />


                <InfoRow
                  label="Last Updated"
                  value={
                    formatDateTime(
                      payroll.updatedAt
                    )
                  }
                />

              </div>

            </div>

          </DetailsSection>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// STATUS BANNER
// ============================================================

function StatusBanner({
  status
}: {
  status: SalaryStatus
}) {

  const config:
    Record<
      SalaryStatus,
      {
        icon: React.ComponentType<{
          className?: string
        }>
        wrapper: string
        iconWrapper: string
        title: string
      }
    > = {

    pending: {
      icon:
        Clock3,

      wrapper:
        "border-orange-200 bg-orange-50",

      iconWrapper:
        "bg-orange-100 text-orange-600",

      title:
        "Payroll Pending"
    },


    processed: {
      icon:
        ShieldCheck,

      wrapper:
        "border-blue-200 bg-blue-50",

      iconWrapper:
        "bg-blue-100 text-blue-600",

      title:
        "Payroll Processed"
    },


    paid: {
      icon:
        Banknote,

      wrapper:
        "border-green-200 bg-green-50",

      iconWrapper:
        "bg-green-100 text-green-600",

      title:
        "Payroll Paid"
    },


    failed: {
      icon:
        ReceiptText,

      wrapper:
        "border-red-200 bg-red-50",

      iconWrapper:
        "bg-red-100 text-red-600",

      title:
        "Payroll Requires Attention"
    }

  }


  const current =
    config[status]


  const Icon =
    current.icon


  return (
    <div
      className={`
        flex items-start gap-4
        rounded-xl
        border
        p-4
        ${current.wrapper}
      `}
    >

      <div
        className={`
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          ${current.iconWrapper}
        `}
      >
        <Icon className="h-5 w-5" />
      </div>


      <div>

        <p
          className="
            text-sm font-semibold
            text-slate-900
          "
        >
          {current.title}
        </p>


        <p
          className="
            mt-1
            text-sm leading-6
            text-slate-600
          "
        >
          {
            STATUS_DESCRIPTIONS[
              status
            ]
          }
        </p>

      </div>

    </div>
  )
}


// ============================================================
// SUMMARY CARD
// ============================================================

type SummaryCardProps = {
  label: string

  value: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string
}


function SummaryCard({
  label,
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

        <div className="min-w-0">

          <p
            className="
              text-sm font-medium
              text-slate-500
            "
          >
            {label}
          </p>


          <p
            className="
              mt-2
              truncate
              text-xl font-semibold
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
              text-slate-400
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
// DETAILS SECTION
// ============================================================

type DetailsSectionProps = {
  title: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode
}


function DetailsSection({
  title,
  description,
  icon: Icon,
  children
}: DetailsSectionProps) {

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex items-start gap-3
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
        "
      >

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

          <h2
            className="
              font-semibold
              text-slate-900
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-0.5
              text-sm leading-6
              text-slate-500
            "
          >
            {description}
          </p>

        </div>

      </div>


      {children}

    </section>
  )
}


// ============================================================
// AMOUNT ROW
// ============================================================

function AmountRow({
  label,
  value
}: {
  label: string

  value:
    | Prisma.Decimal
    | number
    | string
}) {

  return (
    <div
      className="
        flex items-center
        justify-between gap-4
        px-5 py-4
      "
    >

      <span
        className="
          text-sm
          text-slate-600
        "
      >
        {label}
      </span>


      <span
        className="
          text-sm font-medium
          text-slate-900
        "
      >
        {formatCurrency(
          value
        )}
      </span>

    </div>
  )
}


// ============================================================
// INFO ROW
// ============================================================

function InfoRow({
  label,
  value,
  breakWords = false
}: {
  label: string

  value: string

  breakWords?: boolean
}) {

  return (
    <div>

      <p
        className="
          text-xs font-medium
          uppercase tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-1
          text-sm font-medium
          text-slate-800
          ${
            breakWords
              ? "break-all"
              : ""
          }
        `}
      >
        {value}
      </p>

    </div>
  )
}