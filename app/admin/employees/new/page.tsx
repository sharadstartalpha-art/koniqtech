import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  UserPlus,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  createEmployeeAction,
} from "../actions"

import EmployeeForm from "../components/EmployeeForm"

export const dynamic = "force-dynamic"

/* ============================================================
   PAGE
============================================================ */

export default async function NewEmployeePage() {
  /* ==========================================================
     AUTHENTICATION
  ========================================================== */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  /* ==========================================================
     INTERNAL PLATFORM ROLE

     IMPORTANT:
     Internal platform permissions use session.user.role.

     Do NOT use organizationRole here.
  ========================================================== */

  const user = session.user as {
    role?: unknown
    orgId?: unknown
  }

  const currentRole = String(
    user.role ?? ""
  )
    .trim()
    .toLowerCase()

  /* ==========================================================
     AUTHORIZATION

     Only Super Admin can create internal employees.
  ========================================================== */

  if (currentRole !== "super_admin") {
    redirect("/admin/employees")
  }

  /* ==========================================================
     GET ORGANIZATION FROM SESSION

     IMPORTANT:
     Do NOT search using:

       slug: "koniqtech"

     The authenticated admin already has the correct
     organization ID in the session.

     This is also consistent with /admin/employees/page.tsx.
  ========================================================== */

  const sessionOrgId = String(
    user.orgId ?? ""
  ).trim()

  if (!sessionOrgId) {
    return (
      <div className="space-y-6">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div>
          <Link
            href="/admin/employees"
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-blue-600
            "
          >
            <ArrowLeft size={16} />
            Back to Employees
          </Link>

          <div className="flex items-start gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <UserPlus size={21} />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                Add Employee
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new KoniqTech internal staff
                account and assign its operational role.
              </p>

            </div>

          </div>
        </div>

        {/* ======================================================
            ORGANIZATION ERROR
        ====================================================== */}

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-5
          "
        >
          <h2 className="font-semibold text-red-900">
            Organization is not configured
          </h2>

          <p className="mt-1 text-sm text-red-700">
            Your administrator account is not linked
            to an organization. Please verify the
            administrator account configuration.
          </p>
        </div>

      </div>
    )
  }

  /* ==========================================================
     LOAD ORGANIZATION
  ========================================================== */

  const koniqTechOrganization =
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

  /* ==========================================================
     ORGANIZATION SAFETY
  ========================================================== */

  if (!koniqTechOrganization) {
    return (
      <div className="space-y-6">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div>

          <Link
            href="/admin/employees"
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              transition
              hover:text-blue-600
            "
          >
            <ArrowLeft size={16} />
            Back to Employees
          </Link>

          <div className="flex items-start gap-3">

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <UserPlus size={21} />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-950
                "
              >
                Add Employee
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new KoniqTech internal staff
                account and assign its operational role.
              </p>

            </div>

          </div>
        </div>

        {/* ======================================================
            ORGANIZATION ERROR
        ====================================================== */}

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-5
          "
        >

          <h2 className="font-semibold text-red-900">
            Organization not found
          </h2>

          <p className="mt-1 text-sm text-red-700">
            The organization linked to your administrator
            account could not be found. Please verify the
            administrator account and organization configuration.
          </p>

        </div>

      </div>
    )
  }

  /* ==========================================================
     LOAD FORM DATA

     Departments:
       Only departments belonging to the authenticated
       KoniqTech organization.

     Employee Roles:
       EmployeeRole is a global internal role table.

     Managers:
       Only active employees belonging to this organization.
  ========================================================== */

  const [
    departments,
    roles,
    managers,
  ] = await Promise.all([

    /* ========================================================
       DEPARTMENTS
    ======================================================== */

    prisma.department.findMany({
      where: {
        orgId:
          koniqTechOrganization.id,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    }),

    /* ========================================================
       EMPLOYEE ROLES
    ======================================================== */

    prisma.employeeRole.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
      },
    }),

    /* ========================================================
       ACTIVE EMPLOYEES / MANAGERS
    ======================================================== */

    prisma.employee.findMany({
      where: {
        active: true,

        department: {
          orgId:
            koniqTechOrganization.id,
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

  /* ==========================================================
     FORM SETUP VALIDATION
  ========================================================== */

  const setupIncomplete =
    departments.length === 0 ||
    roles.length === 0

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div>

        <Link
          href="/admin/employees"
          className="
            mb-4
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Link>

        <div className="flex items-start gap-3">

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <UserPlus size={21} />
          </div>

          <div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-950
              "
            >
              Add Employee
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new KoniqTech internal staff
              account and assign its operational role.
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          SETUP WARNING
      ====================================================== */}

      {setupIncomplete ? (

        <div
          className="
            rounded-xl
            border
            border-orange-200
            bg-orange-50
            p-5
          "
        >

          <h2 className="font-semibold text-orange-900">
            Employee setup is incomplete
          </h2>

          <p className="mt-1 text-sm text-orange-700">
            At least one Department and one Employee
            Role must exist before creating an employee.
          </p>

          {/* ==================================================
              EXACT MISSING ITEMS
          ================================================== */}

          <div className="mt-4 space-y-2 text-sm">

            {departments.length === 0 && (
              <p className="text-orange-800">
                • No KoniqTech departments are available.
              </p>
            )}

            {roles.length === 0 && (
              <p className="text-orange-800">
                • No Employee Roles are available.
              </p>
            )}

          </div>

          {/* ==================================================
              SETUP LINKS
          ================================================== */}

          <div className="mt-4 flex flex-wrap gap-3">

            {departments.length === 0 && (
              <Link
                href="/admin/departments/new"
                className="
                  inline-flex
                  h-9
                  items-center
                  rounded-lg
                  bg-orange-600
                  px-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-orange-700
                "
              >
                Add Department
              </Link>
            )}

            {roles.length === 0 && (
              <Link
                href="/admin/roles"
                className="
                  inline-flex
                  h-9
                  items-center
                  rounded-lg
                  border
                  border-orange-300
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-100
                "
              >
                Manage Roles
              </Link>
            )}

          </div>

        </div>

      ) : (

        /* ====================================================
           EMPLOYEE FORM
        ==================================================== */

        <EmployeeForm
          mode="create"
          departments={departments}
          roles={roles}
          managers={managers}
          action={createEmployeeAction}
        />

      )}

    </div>
  )
}