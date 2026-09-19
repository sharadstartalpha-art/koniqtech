import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import {
  ArrowLeft,
  UserCog,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import EmployeeForm, {
  type EmployeeFormValues,
} from "../../components/EmployeeForm"

import {
  updateEmployeeAction,
} from "../../actions"

/* =========================================================
   PAGE CONFIG
========================================================= */

export const dynamic = "force-dynamic"

/* =========================================================
   INTERNAL PLATFORM ROLES

   These are User.role values.

   IMPORTANT:
   Do NOT use organizationRole here.
========================================================= */

const EMPLOYEE_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager",
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

  return value.toISOString().slice(0, 10)
}

/* =========================================================
   EDIT EMPLOYEE PAGE
========================================================= */

export default async function EditEmployeePage({
  params,
}: PageProps) {
  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  /* =======================================================
     INTERNAL PLATFORM ROLE

     IMPORTANT:
     Internal platform authorization uses:

       session.user.role

     NOT:

       session.user.organizationRole
  ======================================================= */

  const currentRole = String(
    session.user.role ?? ""
  )
    .trim()
    .toLowerCase()

  if (
    !EMPLOYEE_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     ORGANIZATION

     Internal employees belong to the KoniqTech
     Platform organization.

     The org ID comes from the authenticated session.
     Never trust an organization ID from the browser.
  ======================================================= */

  const sessionOrgId = String(
    session.user.orgId ?? ""
  ).trim()

  if (!sessionOrgId) {
    redirect("/admin/dashboard")
  }

  const organization =
    await prisma.organization.findUnique({
      where: {
        id: sessionOrgId,
      },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    })

  if (!organization) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const { id } = await params

  if (!id) {
    notFound()
  }

  /* =======================================================
     LOAD EMPLOYEE

     IMPORTANT:
     Employee is scoped to the authenticated organization.

     Also load User.role separately from EmployeeRole.

     User.role       = Platform access role
     EmployeeRole    = HR/job role
  ======================================================= */

  const employee =
    await prisma.employee.findFirst({
      where: {
        id,

        department: {
          orgId: organization.id,
        },
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

            /*
             * INTERNAL PLATFORM ACCESS ROLE
             */
            role: true,

            status: true,
          },
        },
      },
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
    managers,
  ] = await Promise.all([
    /* -------------------------------------------------------
       DEPARTMENTS

       Only departments belonging to the current
       internal organization.
    ------------------------------------------------------- */

    prisma.department.findMany({
      where: {
        orgId: organization.id,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    }),

    /* -------------------------------------------------------
       EMPLOYEE ROLES

       EmployeeRole is the HR/job role.

       Example:
       - Data Entry
       - Developer
       - QA
       - Sales Executive
    ------------------------------------------------------- */

    prisma.employeeRole.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    }),

    /* -------------------------------------------------------
       MANAGERS

       Only active employees from the same
       internal organization.
    ------------------------------------------------------- */

    prisma.employee.findMany({
      where: {
        active: true,

        id: {
          not: employee.id,
        },

        department: {
          orgId: organization.id,
        },
      },

      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],

      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeCode: true,
      },
    }),
  ])

  /* =======================================================
     FORM DATA

     IMPORTANT:

     userRole
       -> User.role
       -> platform access

     roleId
       -> EmployeeRole
       -> HR/job role

     These remain completely separate.
  ======================================================= */

  const formEmployee: EmployeeFormValues = {
    id: employee.id,

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
      employee.user?.role
        ? String(employee.user.role)
        : null,

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
      employee.emergencyContactPhone,
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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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