import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CircleDollarSign,
  Info,
  PencilLine
} from "lucide-react"

import {
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import PayrollForm, {
  type PayrollEmployeeOption,
  type PayrollFormValues
} from "../../components/PayrollForm"

import {
  updatePayrollAction
} from "../../actions"


// ============================================================
// TYPES
// ============================================================

type EditPayrollPageProps = {
  params: Promise<{
    id: string
  }>
}


// ============================================================
// ACCESS ROLES
// ============================================================

const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// DATE INPUT FORMATTER
// ============================================================

function formatDateInput(
  date: Date | null
) {

  if (!date) {
    return ""
  }


  const year =
    date.getUTCFullYear()


  const month =
    String(
      date.getUTCMonth() + 1
    ).padStart(
      2,
      "0"
    )


  const day =
    String(
      date.getUTCDate()
    ).padStart(
      2,
      "0"
    )


  return `${year}-${month}-${day}`
}


// ============================================================
// PAGE
// ============================================================

export default async function EditPayrollPage({
  params
}: EditPayrollPageProps) {

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
    !MANAGE_ROLES.includes(
      currentRole
    )
  ) {
    redirect(
      "/admin/payroll"
    )
  }


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
  // LOAD PAYROLL RECORD
  // ----------------------------------------------------------

  const payroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id
      },

      select: {

        id: true,

        employeeId: true,

        salaryType: true,

        basicSalary: true,

        hra: true,

        allowance: true,

        bonus: true,

        incentive: true,

        overtime: true,

        deductions: true,

        tax: true,

        payMonth: true,

        payYear: true,

        paymentDate: true,

        paymentMethod: true,

        transactionId: true,

        status: true,

        remarks: true,


        employee: {

          select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            employeeCode: true,

            active: true

          }

        }

      }

    })


  if (!payroll) {
    notFound()
  }


  // ----------------------------------------------------------
  // LOAD EMPLOYEES
  //
  // Current employee is included even if inactive so that
  // historical payroll records remain editable.
  // ----------------------------------------------------------

  const employees =
    await prisma.employee.findMany({

      where: {

        OR: [

          {
            active: true
          },

          {
            id:
              payroll.employeeId
          }

        ]

      },

      orderBy: [

        {
          firstName:
            "asc"
        },

        {
          lastName:
            "asc"
        }

      ],

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

    })


  // ----------------------------------------------------------
  // MAP EMPLOYEE OPTIONS
  // ----------------------------------------------------------

  const employeeOptions:
    PayrollEmployeeOption[] =
    employees.map(
      (employee) => {

        const fullName =
          [
            employee.firstName,
            employee.lastName
          ]
            .filter(Boolean)
            .join(" ")
            .trim()


        return {

          id:
            employee.id,

          name:
            fullName ||
            employee.email ||
            employee.employeeCode,

          email:
            employee.email,

          employeeCode:
            employee.employeeCode,

          designation:
            employee.designation,

          departmentName:
            employee.department.name

        }

      }
    )


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
  // MAP INITIAL FORM VALUES
  //
  // Prisma Decimal values must be converted before crossing
  // the Server Component -> Client Component boundary.
  // ----------------------------------------------------------

  const initialValues:
    PayrollFormValues = {

    employeeId:
      payroll.employeeId,

    salaryType:
      payroll.salaryType,

    basicSalary:
      payroll.basicSalary.toString(),

    hra:
      payroll.hra.toString(),

    allowance:
      payroll.allowance.toString(),

    bonus:
      payroll.bonus.toString(),

    incentive:
      payroll.incentive.toString(),

    overtime:
      payroll.overtime.toString(),

    deductions:
      payroll.deductions.toString(),

    tax:
      payroll.tax.toString(),

    payMonth:
      payroll.payMonth,

    payYear:
      payroll.payYear,

    paymentDate:
      formatDateInput(
        payroll.paymentDate
      ),

    paymentMethod:
      payroll.paymentMethod ??
      "",

    transactionId:
      payroll.transactionId ??
      "",

    status:
      payroll.status,

    remarks:
      payroll.remarks ??
      ""

  }


  // ----------------------------------------------------------
  // BIND UPDATE ACTION
  // ----------------------------------------------------------

  const updateAction =
    updatePayrollAction.bind(
      null,
      payroll.id
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-wrap
          items-center gap-4
        "
      >

        <Link
          href={
            `/admin/payroll/${payroll.id}`
          }
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

          Back to Payroll Details
        </Link>


        <span
          className="
            hidden h-4 w-px
            bg-slate-300
            sm:block
          "
        />


        <Link
          href="/admin/payroll"
          className="
            text-sm font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          All Payroll Records
        </Link>

      </div>


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <PencilLine className="h-6 w-6" />
          </div>


          <div>

            <h1
              className="
                text-2xl
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Edit Payroll
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Update payroll details for{" "}
              <span
                className="
                  font-medium
                  text-slate-700
                "
              >
                {employeeName}
              </span>.
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


        <div
          className="
            inline-flex
            items-center gap-3
            self-start
            rounded-xl
            border border-blue-200
            bg-blue-50
            px-4 py-3
          "
        >

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              bg-blue-100
              text-blue-600
            "
          >
            <CircleDollarSign className="h-4 w-4" />
          </div>


          <div>

            <p
              className="
                text-xs font-medium
                uppercase tracking-wide
                text-blue-600
              "
            >
              Payroll Period
            </p>


            <p
              className="
                mt-0.5
                text-sm font-semibold
                text-blue-950
              "
            >
              {getMonthName(
                payroll.payMonth
              )}{" "}
              {payroll.payYear}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* INFORMATION */}
      {/* ==================================================== */}

      <div
        className="
          flex items-start gap-3
          rounded-xl
          border border-blue-200
          bg-blue-50
          px-4 py-3
        "
      >

        <Info
          className="
            mt-0.5
            h-5 w-5
            shrink-0
            text-blue-600
          "
        />


        <div>

          <p
            className="
              text-sm font-medium
              text-blue-900
            "
          >
            Editing payroll record
          </p>


          <p
            className="
              mt-1
              text-sm leading-6
              text-blue-700
            "
          >
            The employee is locked for this payroll record.
            Earnings, deductions, pay period, payment details,
            and payroll status can be updated. Net salary will
            be recalculated on the server when changes are saved.
          </p>

        </div>

      </div>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <PayrollForm
        mode="edit"
        employees={
          employeeOptions
        }
        initialValues={
          initialValues
        }
        action={
          updateAction
        }
      />

    </div>
  )
}


// ============================================================
// MONTH NAME
// ============================================================

function getMonthName(
  month: number
) {

  const months = [
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


  return (
    months[
      month - 1
    ] ??
    `Month ${month}`
  )
}