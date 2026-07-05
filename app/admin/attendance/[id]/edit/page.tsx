import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  UserRole
} from "@prisma/client"

import {
  ArrowLeft,
  CalendarClock,
  Info
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import AttendanceForm, {
  type AttendanceEmployeeOption,
  type AttendanceFormRecord
} from "../../components/AttendanceForm"

import {
  updateAttendanceAction
} from "../../actions"


// ============================================================
// TYPES
// ============================================================

type EditAttendancePageProps = {
  params: Promise<{
    id: string
  }>
}


// ============================================================
// ACCESS ROLES
// ============================================================

const EDIT_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// DATE HELPERS
// ============================================================

function formatDateInput(
  date: Date
) {

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


function formatTimeInput(
  date: Date | null
) {

  if (!date) {
    return ""
  }


  const hours =
    String(
      date.getUTCHours()
    ).padStart(
      2,
      "0"
    )


  const minutes =
    String(
      date.getUTCMinutes()
    ).padStart(
      2,
      "0"
    )


  return `${hours}:${minutes}`
}


// ============================================================
// PAGE
// ============================================================

export default async function EditAttendancePage({
  params
}: EditAttendancePageProps) {

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
    !EDIT_ROLES.includes(
      currentRole
    )
  ) {
    redirect("/admin/attendance")
  }


  // ----------------------------------------------------------
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } = await params


  // ----------------------------------------------------------
  // LOAD ATTENDANCE + EMPLOYEES
  // ----------------------------------------------------------

  const [
    attendanceRecord,
    employeeRecords
  ] = await Promise.all([

    prisma.employeeAttendance.findUnique({

      where: {
        id
      },

      select: {
        id: true,

        employeeId: true,

        attendanceDate: true,

        checkIn: true,
        checkOut: true,

        breakMinutes: true,

        overtimeHours: true,

        status: true,

        workLocation: true,

        latitude: true,
        longitude: true,

        ipAddress: true,
        device: true,

        remarks: true,

        approvedAt: true,

        employee: {
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
        }
      }
    }),


    prisma.employee.findMany({

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

  ])


  // ----------------------------------------------------------
  // NOT FOUND
  // ----------------------------------------------------------

  if (!attendanceRecord) {
    notFound()
  }


  // ----------------------------------------------------------
  // EMPLOYEE OPTIONS
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


  // ----------------------------------------------------------
  // FORM RECORD
  // ----------------------------------------------------------

  const attendance:
    AttendanceFormRecord = {

      id:
        attendanceRecord.id,

      employeeId:
        attendanceRecord.employeeId,

      attendanceDate:
        formatDateInput(
          attendanceRecord.attendanceDate
        ),

      checkIn:
        formatTimeInput(
          attendanceRecord.checkIn
        ),

      checkOut:
        formatTimeInput(
          attendanceRecord.checkOut
        ),

      breakMinutes:
        attendanceRecord.breakMinutes,

      overtimeHours:
        attendanceRecord.overtimeHours,

      status:
        attendanceRecord.status,

      workLocation:
        attendanceRecord.workLocation ??
        "",

      latitude:
        attendanceRecord.latitude !== null
          ? String(
              attendanceRecord.latitude
            )
          : "",

      longitude:
        attendanceRecord.longitude !== null
          ? String(
              attendanceRecord.longitude
            )
          : "",

      ipAddress:
        attendanceRecord.ipAddress ??
        "",

      device:
        attendanceRecord.device ??
        "",

      remarks:
        attendanceRecord.remarks ??
        ""

    }


  // ----------------------------------------------------------
  // BIND UPDATE ACTION
  // ----------------------------------------------------------

  const updateAction =
    updateAttendanceAction.bind(
      null,
      attendanceRecord.id
    )


  // ----------------------------------------------------------
  // EMPLOYEE DISPLAY NAME
  // ----------------------------------------------------------

  const employeeName =
    attendanceRecord.employee.user
      ?.name
      ?.trim() ||
    attendanceRecord.employee.user
      ?.email ||
    attendanceRecord.employee
      .employeeCode ||
    "Employee"


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
          href={`/admin/attendance/${attendanceRecord.id}`}
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Attendance Record
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

        <div className="flex items-start gap-3">

          <div
            className="
              flex h-11 w-11
              shrink-0
              items-center justify-center
              rounded-xl
              bg-orange-50
              text-orange-600
            "
          >
            <CalendarClock className="h-5 w-5" />
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
              Edit Attendance
            </h1>


            <p className="mt-1 text-sm text-slate-500">
              Update the attendance record for{" "}
              <span className="font-medium text-slate-700">
                {employeeName}
              </span>
              .
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* APPROVAL INFORMATION */}
      {/* ==================================================== */}

      {attendanceRecord.approvedAt && (

        <div
          className="
            flex items-start gap-3
            rounded-xl
            border border-orange-200
            bg-orange-50
            px-4 py-3
          "
        >

          <Info
            className="
              mt-0.5
              h-5 w-5
              shrink-0
              text-orange-600
            "
          />


          <div>

            <p className="text-sm font-medium text-orange-900">
              This attendance record is approved
            </p>


            <p
              className="
                mt-1
                text-sm leading-6
                text-orange-700
              "
            >
              Editing attendance details does not
              automatically revoke the existing
              approval. Use the attendance detail
              page if the approval must be revoked.
            </p>

          </div>

        </div>

      )}


      {/* ==================================================== */}
      {/* EDIT INFORMATION */}
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
            Attendance update
          </p>


          <p
            className="
              mt-1
              text-sm leading-6
              text-blue-700
            "
          >
            Total working hours will be recalculated
            securely from the updated check-in,
            check-out, and break duration when you
            save the record.
          </p>

        </div>

      </div>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <AttendanceForm
        mode="edit"
        employees={employees}
        attendance={attendance}
        action={updateAction}
      />

    </div>
  )
}