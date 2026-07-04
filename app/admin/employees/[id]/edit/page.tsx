import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  ArrowLeft,
  UserCog
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import EmployeeForm, {
  type EmployeeFormValues
} from "../../components/EmployeeForm"

import {
  updateEmployeeAction
} from "../../actions"

/* =========================================================
   PAGE CONFIG
========================================================= */

export const dynamic = "force-dynamic"

/* =========================================================
   ALLOWED ROLES
========================================================= */

const EMPLOYEE_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE PROPS
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   DATE FORMATTER

   HTML date inputs require YYYY-MM-DD.
========================================================= */

function formatDateForInput(
  value: Date | null
): string | null {
  if (!value) {
    return null
  }

  return value
    .toISOString()
    .slice(0, 10)
}

/* =========================================================
   EDIT EMPLOYEE PAGE
========================================================= */

export default async function EditEmployeePage({
  params
}: PageProps) {
  /* =======================================================
     AUTH
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  )

  if (
    !EMPLOYEE_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const {
    id
  } = await params

  /* =======================================================
     LOAD EMPLOYEE

     IMPORTANT:
     user.role is required for Platform Access Role.
  ======================================================= */

  const employee =
    await prisma.employee.findUnique({
      where: {
        id
      },

      select: {
        id: true,

        employeeCode: true,

        firstName: true,

        lastName: true,

        email: true,

        phone: true,

        departmentId: true,

        roleId: true,

        managerId: true,

        designation: true,

        joiningDate: true,

        dateOfBirth: true,

        gender: true,

        address: true,

        city: true,

        state: true,

        country: true,

        postalCode: true,

        emergencyContactName: true,

        emergencyContactPhone: true,

        employmentType: true,

        active: true,

        user: {
          select: {
            id: true,
            role: true,
            status: true
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  /* =======================================================
     LOAD FORM OPTIONS
  ======================================================= */

  const [
    departments,
    roles,
    managers
  ] = await Promise.all([
    prisma.department.findMany({
      orderBy: {
        name: "asc"
      },

      select: {
        id: true,
        name: true
      }
    }),

    prisma.employeeRole.findMany({
      orderBy: {
        name: "asc"
      },

      select: {
        id: true,
        name: true
      }
    }),

    prisma.employee.findMany({
      where: {
        active: true,

        id: {
          not: employee.id
        }
      },

      orderBy: [
        {
          firstName: "asc"
        },
        {
          lastName: "asc"
        }
      ],

      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeCode: true
      }
    })
  ])

  /* =======================================================
     FORM DATA

     userRole comes from linked User record.

     roleId comes from EmployeeRole.

     These are intentionally separate.
  ======================================================= */

  const formEmployee: EmployeeFormValues = {
    id:
      employee.id,

    employeeCode:
      employee.employeeCode,

    firstName:
      employee.firstName,

    lastName:
      employee.lastName,

    email:
      employee.email,

    phone:
      employee.phone,

    userRole:
      employee.user?.role ?? null,

    departmentId:
      employee.departmentId,

    roleId:
      employee.roleId,

    managerId:
      employee.managerId,

    designation:
      employee.designation,

    joiningDate:
      formatDateForInput(
        employee.joiningDate
      ),

    dateOfBirth:
      formatDateForInput(
        employee.dateOfBirth
      ),

    gender:
      employee.gender,

    employmentType:
      employee.employmentType,

    address:
      employee.address,

    city:
      employee.city,

    state:
      employee.state,

    country:
      employee.country,

    postalCode:
      employee.postalCode,

    emergencyContactName:
      employee.emergencyContactName,

    emergencyContactPhone:
      employee.emergencyContactPhone
  }

  /* =======================================================
     UPDATE ACTION WRAPPER
  ======================================================= */

  async function updateAction(
    formData: FormData
  ) {
    "use server"

    return updateEmployeeAction(
      id,
      formData
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK LINK
      =================================================== */}

      <Link
        href={`/admin/employees/${employee.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />

        Back to Employee
      </Link>

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <UserCog size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Edit Employee
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update internal employee information,
              access role and reporting structure.
            </p>
          </div>
        </div>

        <div
          className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
            employee.active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {employee.active
            ? "Active Employee"
            : "Inactive Employee"}
        </div>
      </div>

      {/* ===================================================
          EMPLOYEE CONTEXT CARD
      =================================================== */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-blue-950">
              {employee.firstName}{" "}
              {employee.lastName}
            </p>

            <p className="mt-0.5 text-sm text-blue-700">
              {employee.employeeCode}
              {" · "}
              {employee.email}
            </p>
          </div>

          {employee.user ? (
            <span className="mt-2 inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:mt-0">
              Login account linked
            </span>
          ) : (
            <span className="mt-2 inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 sm:mt-0">
              Login account not linked
            </span>
          )}
        </div>
      </div>

      {/* ===================================================
          EMPLOYEE FORM
      =================================================== */}

      <EmployeeForm
        mode="edit"
        employee={formEmployee}
        departments={departments}
        roles={roles}
        managers={managers}
        action={updateAction}
      />
    </div>
  )
}