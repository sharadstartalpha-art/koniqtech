import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CalendarPlus,
  Users
} from "lucide-react"

import {
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import {
  createLeaveAction
} from "../actions"

import LeaveForm, {
  type LeaveEmployeeOption
} from "../components/LeaveForm"


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

export default async function NewLeavePage() {

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
      "/admin/leave"
    )
  }


  // ----------------------------------------------------------
  // LOAD ACTIVE EMPLOYEES
  // ----------------------------------------------------------

  const employeeRecords =
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
        },

        {
          employeeCode:
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
  // MAP FORM OPTIONS
  // ----------------------------------------------------------

  const employees:
    LeaveEmployeeOption[] =
    employeeRecords.map(
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
            employee.employeeCode

        }
      }
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK NAVIGATION */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/leave"
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

          Back to Leave Management
        </Link>

      </div>


      {/* ==================================================== */}
      {/* PAGE HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
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
            <CalendarPlus className="h-6 w-6" />
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
              New Leave Request
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Create a leave request for an active
              employee. The request will be created
              with pending status and can then be
              reviewed by an authorized administrator.
            </p>

          </div>

        </div>


        {/* ================================================== */}
        {/* ACTIVE EMPLOYEE COUNT */}
        {/* ================================================== */}

        <div
          className="
            flex items-center gap-3
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
                text-blue-700
              "
            >
              Active Employees
            </p>


            <p
              className="
                mt-0.5
                text-sm font-semibold
                text-blue-900
              "
            >
              {employees.length}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* NO EMPLOYEES */}
      {/* ==================================================== */}

      {employees.length === 0 ? (

        <div
          className="
            rounded-xl
            border border-orange-200
            bg-orange-50
            p-6
          "
        >

          <div
            className="
              flex items-start gap-4
            "
          >

            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-lg
                bg-orange-100
                text-orange-600
              "
            >
              <Users className="h-5 w-5" />
            </div>


            <div>

              <h2
                className="
                  font-semibold
                  text-orange-900
                "
              >
                No active employees available
              </h2>


              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm leading-6
                  text-orange-800
                "
              >
                A leave request must be associated
                with an active employee. Create a new
                employee or activate an existing
                employee before creating a leave
                request.
              </p>


              <Link
                href="/admin/employees/new"
                className="
                  mt-4
                  inline-flex h-10
                  items-center justify-center
                  rounded-lg
                  bg-orange-600
                  px-4
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-orange-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-500
                  focus:ring-offset-2
                "
              >
                Create Employee
              </Link>

            </div>

          </div>

        </div>

      ) : (

        /* ================================================== */
        /* FORM */
        /* ================================================== */

        <LeaveForm
          mode="create"
          employees={employees}
          action={createLeaveAction}
        />

      )}

    </div>
  )
}