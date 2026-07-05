import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  CalendarDays,
  Edit3
} from "lucide-react"

import {
  LeaveStatus,
  UserRole
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import {
  updateLeaveAction
} from "../../actions"

import LeaveForm, {
  type LeaveEmployeeOption,
  type LeaveFormRecord
} from "../../components/LeaveForm"


// ============================================================
// TYPES
// ============================================================

type EditLeavePageProps = {
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
// DATE HELPER
// ============================================================

function formatDateForInput(
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


// ============================================================
// PAGE
// ============================================================

export default async function EditLeavePage({
  params
}: EditLeavePageProps) {

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
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } = await params


  if (!id) {
    notFound()
  }


  // ----------------------------------------------------------
  // LOAD LEAVE + EMPLOYEES
  // ----------------------------------------------------------

  const [
    leaveRecord,
    employeeRecords
  ] = await Promise.all([

    prisma.employeeLeave.findUnique({

      where: {
        id
      },

      select: {

        id: true,

        employeeId: true,

        leaveType: true,

        startDate: true,

        endDate: true,

        totalDays: true,

        reason: true,

        attachment: true,

        managerRemarks: true,

        status: true,

        employee: {

          select: {

            firstName: true,

            lastName: true,

            employeeCode: true

          }

        }

      }

    }),


    prisma.employee.findMany({

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

        employeeCode: true

      }

    })

  ])


  // ----------------------------------------------------------
  // NOT FOUND
  // ----------------------------------------------------------

  if (!leaveRecord) {
    notFound()
  }


  // ----------------------------------------------------------
  // CANCELLED LEAVE CANNOT BE EDITED
  // ----------------------------------------------------------

  if (
    leaveRecord.status ===
    LeaveStatus.cancelled
  ) {
    redirect(
      `/admin/leave/${leaveRecord.id}`
    )
  }


  // ----------------------------------------------------------
  // EMPLOYEE OPTIONS
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


  // ----------------------------------------------------------
  // IMPORTANT:
  //
  // If the employee linked to the leave was deactivated after
  // the request was created, include that employee in the form
  // options so the existing selection is not lost.
  // ----------------------------------------------------------

  const currentEmployeeExists =
    employees.some(
      (employee) =>
        employee.id ===
        leaveRecord.employeeId
    )


  if (!currentEmployeeExists) {

    const currentEmployee =
      await prisma.employee.findUnique({

        where: {
          id:
            leaveRecord.employeeId
        },

        select: {

          id: true,

          firstName: true,

          lastName: true,

          email: true,

          employeeCode: true

        }

      })


    if (currentEmployee) {

      const fullName =
        [
          currentEmployee.firstName,
          currentEmployee.lastName
        ]
          .filter(Boolean)
          .join(" ")
          .trim()


      employees.unshift({

        id:
          currentEmployee.id,

        name:
          fullName ||
          currentEmployee.email ||
          currentEmployee.employeeCode,

        email:
          currentEmployee.email,

        employeeCode:
          currentEmployee.employeeCode

      })
    }
  }


  // ----------------------------------------------------------
  // FORM RECORD
  // ----------------------------------------------------------

  const leave:
    LeaveFormRecord = {

    id:
      leaveRecord.id,

    employeeId:
      leaveRecord.employeeId,

    leaveType:
      leaveRecord.leaveType,

    startDate:
      formatDateForInput(
        leaveRecord.startDate
      ),

    endDate:
      formatDateForInput(
        leaveRecord.endDate
      ),

    totalDays:
      leaveRecord.totalDays,

    reason:
      leaveRecord.reason,

    attachment:
      leaveRecord.attachment ??
      "",

    managerRemarks:
      leaveRecord.managerRemarks ??
      ""

  }


  // ----------------------------------------------------------
  // EMPLOYEE DISPLAY NAME
  // ----------------------------------------------------------

  const employeeName =
    [
      leaveRecord.employee.firstName,
      leaveRecord.employee.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    leaveRecord.employee.employeeCode


  // ----------------------------------------------------------
  // BIND UPDATE ACTION
  // ----------------------------------------------------------

  const updateAction =
    updateLeaveAction.bind(
      null,
      leaveRecord.id
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
          href={
            `/admin/leave/${leaveRecord.id}`
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

          Back to Leave Details
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
              bg-blue-50
              text-blue-600
            "
          >
            <Edit3 className="h-6 w-6" />
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
              Edit Leave Request
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Update the leave request for{" "}
              <span
                className="
                  font-medium
                  text-slate-700
                "
              >
                {employeeName}
              </span>
              .
            </p>

          </div>

        </div>


        {/* CURRENT DURATION */}

        <div
          className="
            flex items-center gap-3
            rounded-xl
            border border-green-200
            bg-green-50
            px-4 py-3
          "
        >

          <CalendarDays
            className="
              h-5 w-5
              text-green-600
            "
          />


          <div>

            <p
              className="
                text-xs font-medium
                uppercase tracking-wide
                text-green-700
              "
            >
              Current Duration
            </p>


            <p
              className="
                mt-0.5
                text-sm font-semibold
                text-green-900
              "
            >
              {leaveRecord.totalDays}{" "}
              {leaveRecord.totalDays === 1
                ? "day"
                : "days"}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* EDIT NOTICE */}
      {/* ==================================================== */}

      {leaveRecord.status !==
        LeaveStatus.pending && (

        <div
          className="
            rounded-xl
            border border-orange-200
            bg-orange-50
            px-4 py-3
          "
        >

          <p
            className="
              text-sm font-semibold
              text-orange-900
            "
          >
            Editing will reset the approval decision
          </p>


          <p
            className="
              mt-1
              text-sm leading-6
              text-orange-800
            "
          >
            This request currently has a{" "}
            <span className="font-semibold">
              {leaveRecord.status}
            </span>{" "}
            status. Saving changes will return the
            request to pending status and clear its
            previous approval or rejection information.
          </p>

        </div>

      )}


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <LeaveForm
        mode="edit"
        employees={employees}
        leave={leave}
        action={updateAction}
      />

    </div>
  )
}