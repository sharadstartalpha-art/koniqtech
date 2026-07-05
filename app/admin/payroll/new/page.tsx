import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Banknote,
  CircleDollarSign,
  Info,
  Users
} from "lucide-react"

import {
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import PayrollForm, {
  type PayrollEmployeeOption
} from "../components/PayrollForm"

import {
  createPayrollAction
} from "../actions"


// ============================================================
// ACCESS ROLES
// ============================================================

const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// PAGE
// ============================================================

export default async function NewPayrollPage() {

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
  // LOAD ACTIVE EMPLOYEES
  // ----------------------------------------------------------

  const employees =
    await prisma.employee.findMany({

      where: {
        active: true
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


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BREADCRUMB / BACK */}
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
      {/* PAGE HEADER */}
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
              bg-green-50
              text-green-600
            "
          >
            <CircleDollarSign className="h-6 w-6" />
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
              Create Payroll
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Create a salary record for an employee,
              calculate earnings and deductions, and
              assign the payroll period and processing
              status.
            </p>

          </div>

        </div>


        {/* ACTIVE EMPLOYEE COUNT */}

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
            <Users className="h-4 w-4" />
          </div>


          <div>

            <p
              className="
                text-xs font-medium
                uppercase tracking-wide
                text-blue-600
              "
            >
              Active Employees
            </p>


            <p
              className="
                mt-0.5
                text-lg font-semibold
                text-blue-950
              "
            >
              {employeeOptions.length}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* NO EMPLOYEE WARNING */}
      {/* ==================================================== */}

      {employeeOptions.length === 0 ? (

        <div
          className="
            overflow-hidden
            rounded-xl
            border border-orange-200
            bg-orange-50
          "
        >

          <div
            className="
              flex flex-col
              items-center
              px-6 py-14
              text-center
            "
          >

            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-xl
                bg-orange-100
                text-orange-600
              "
            >
              <Users className="h-7 w-7" />
            </div>


            <h2
              className="
                mt-4
                text-lg font-semibold
                text-orange-950
              "
            >
              No Active Employees Available
            </h2>


            <p
              className="
                mt-2
                max-w-lg
                text-sm leading-6
                text-orange-700
              "
            >
              Payroll records can only be created for
              active employees. Add or activate an employee
              before creating payroll.
            </p>


            <Link
              href="/admin/employees"
              className="
                mt-5
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-sm font-medium
                text-white
                transition
                hover:bg-blue-700
              "
            >
              <Users className="h-4 w-4" />

              Manage Employees
            </Link>

          </div>

        </div>

      ) : (

        <>
          {/* ================================================= */}
          {/* INFORMATION BANNER */}
          {/* ================================================= */}

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
                Payroll calculation
              </p>


              <p
                className="
                  mt-1
                  text-sm leading-6
                  text-blue-700
                "
              >
                Net salary is calculated from basic salary,
                HRA, allowance, bonus, incentive, overtime,
                deductions, and tax. The final amount is
                recalculated on the server before the payroll
                record is saved.
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* PAYROLL FORM */}
          {/* ================================================= */}

          <PayrollForm
            mode="create"
            employees={
              employeeOptions
            }
            action={
              createPayrollAction
            }
          />

        </>

      )}


      {/* ==================================================== */}
      {/* FOOTER NOTE */}
      {/* ==================================================== */}

      <div
        className="
          flex items-start gap-3
          rounded-xl
          border border-slate-200
          bg-white
          px-4 py-3
          shadow-sm
        "
      >

        <Banknote
          className="
            mt-0.5
            h-5 w-5
            shrink-0
            text-slate-500
          "
        />


        <p
          className="
            text-sm leading-6
            text-slate-600
          "
        >
          Only one payroll record can exist for the same
          employee, pay month, and pay year. Duplicate payroll
          periods are blocked by both application validation
          and the database unique constraint.
        </p>

      </div>

    </div>
  )
}