import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CalendarPlus,
  Info
} from "lucide-react"

import {
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import AttendanceForm, {
  type AttendanceEmployeeOption
} from "../components/AttendanceForm"

import {
  createAttendanceAction
} from "../actions"


// ============================================================
// ACCESS ROLES
// ============================================================

const CREATE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// PAGE
// ============================================================

export default async function NewAttendancePage() {

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
    !CREATE_ROLES.includes(
      currentRole
    )
  ) {
    redirect("/admin/attendance")
  }


  // ----------------------------------------------------------
  // LOAD INTERNAL EMPLOYEES
  // ----------------------------------------------------------

  const employeeRecords =
    await prisma.employee.findMany({

      orderBy: [
        {
          user: {
            name: "asc"
          }
        },
        {
          createdAt: "asc"
        }
      ],

      select: {
        id: true,

        employeeCode: true,

        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })


  // ----------------------------------------------------------
  // FORM OPTIONS
  // ----------------------------------------------------------

  const employees:
    AttendanceEmployeeOption[] =
    employeeRecords.map(
      (employee) => ({
        id:
          employee.id,

        name:
          employee.user?.name?.trim() ||
          employee.user?.email ||
          employee.employeeCode ||
          "Unnamed Employee",

        email:
          employee.user?.email ??
          null,

        employeeCode:
          employee.employeeCode ??
          null
      })
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
          href="/admin/attendance"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Attendance
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

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-xl
                bg-green-50
                text-green-600
              "
            >
              <CalendarPlus className="h-5 w-5" />
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
                Add Attendance
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new internal employee
                attendance record.
              </p>

            </div>

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

          <p className="text-sm font-medium text-blue-900">
            Internal attendance record
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Each employee can have only one
            attendance record for a specific date.
            Working hours are calculated securely
            from check-in, check-out, and break
            duration when the record is saved.
          </p>

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
            px-6 py-10
            text-center
          "
        >

          <h2 className="font-semibold text-orange-900">
            No employees available
          </h2>

          <p
            className="
              mx-auto mt-2
              max-w-lg
              text-sm leading-6
              text-orange-700
            "
          >
            An internal employee record must exist
            before attendance can be created.
          </p>


          <Link
            href="/admin/employees/new"
            className="
              mt-5
              inline-flex h-10
              items-center justify-center
              rounded-lg
              bg-green-600
              px-4
              text-sm font-medium
              text-white
              transition
              hover:bg-green-700
            "
          >
            Create Employee
          </Link>

        </div>

      ) : (

        /* ================================================== */
        /* ATTENDANCE FORM */
        /* ================================================== */

        <AttendanceForm
          mode="create"
          employees={employees}
          action={createAttendanceAction}
        />

      )}

    </div>
  )
}