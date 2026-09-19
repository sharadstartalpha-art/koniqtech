import Link from "next/link"
import { redirect } from "next/navigation"

import {
  BriefcaseBusiness,
  Plus,
  UserCheck,
  UserRound,
  UsersRound,
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import EmployeeDataTable from "./components/EmployeeDataTable"

export const dynamic = "force-dynamic"

/* ============================================================
   INTERNAL PLATFORM ROLES
============================================================ */

const INTERNAL_EMPLOYEE_ROLES = [
  "super_admin",
  "platform_manager",
  "platform_sales",
  "support",
  "finance",
  "developer",
  "qa",
  "customer_success",
  "marketing",
  "data_entry",
]

/* ============================================================
   PAGE
============================================================ */

export default async function AdminEmployeesPage() {
  /* ==========================================================
     AUTHENTICATION
  ========================================================== */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  /* ==========================================================
     CURRENT INTERNAL PLATFORM ROLE

     IMPORTANT:
     Internal platform authorization uses session.user.role.

     Do NOT use organizationRole here.
  ========================================================== */

  const user = session.user as {
    role?: unknown
    orgId?: unknown
    email?: unknown
  }

  const currentRole = String(
    user.role ?? ""
  )
    .trim()
    .toLowerCase()

  /* ==========================================================
     AUTHORIZATION
  ========================================================== */

  if (
    !INTERNAL_EMPLOYEE_ROLES.includes(
      currentRole
    )
  ) {
    redirect("/admin/dashboard")
  }

  /* ==========================================================
     GET ORGANIZATION FROM AUTHENTICATED SESSION

     IMPORTANT:
     Do NOT assume the organization slug.

     The authenticated internal admin already belongs
     to the KoniqTech organization, so use session.user.orgId.

     This is safer and avoids failures when the organization
     slug is different in production.
  ========================================================== */

  const sessionOrgId = String(
    user.orgId ?? ""
  ).trim()

  if (!sessionOrgId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage KoniqTech internal employees,
            roles, departments and reporting structure.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
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

     The ID comes from the authenticated session.
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage KoniqTech internal employees,
            roles, departments and reporting structure.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
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
     LOAD EMPLOYEES + DEPARTMENT COUNT

     Employees are filtered through their department so
     only employees belonging to this organization appear.

     Departments are counted directly from Department.

     This is important because departments can exist even
     when there are zero employees.
  ========================================================== */

  const [
    employees,
    departmentCount,
  ] = await Promise.all([
    prisma.employee.findMany({
      where: {
        department: {
          orgId:
            koniqTechOrganization.id,
        },
      },

      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },

        role: {
          select: {
            id: true,
            name: true,
          },
        },

        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },

      orderBy: [
        {
          active: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),

    prisma.department.count({
      where: {
        orgId:
          koniqTechOrganization.id,
      },
    }),
  ])

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalEmployees =
    employees.length

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.active
    ).length

  /*
   * IMPORTANT:
   * Count departments directly from the database.
   *
   * Do NOT derive this from employees.
   */

  const departments =
    departmentCount

  /*
   * A manager is an employee who has at least
   * one employee reporting to them.
   */

  const managers =
    employees.filter(
      (employee) =>
        employees.some(
          (otherEmployee) =>
            otherEmployee.managerId ===
            employee.id
        )
    ).length

  /* ==========================================================
     PERMISSIONS
  ========================================================== */

  const isSuperAdmin =
    currentRole === "super_admin"

  const canEdit =
    currentRole ===
      "super_admin" ||
    currentRole ===
      "platform_manager"

  const canDelete =
    isSuperAdmin

  const canChangeStatus =
    isSuperAdmin

  /* ==========================================================
     TABLE DATA

     Convert Date objects to strings before passing
     them to the client component.
  ========================================================== */

  const tableRows =
    employees.map(
      (employee) => ({
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

        designation:
          employee.designation,

        active:
          employee.active,

        department:
          employee.department,

        role:
          employee.role,

        manager:
          employee.manager,

        createdAt:
          employee.createdAt.toISOString(),
      })
    )

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="space-y-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage KoniqTech internal employees,
            roles, departments and reporting structure.
          </p>
        </div>

        {/* ====================================================
            ADD EMPLOYEE
        ==================================================== */}

        {isSuperAdmin && (
          <Link
            href="/admin/employees/new"
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Plus size={17} />

            Add Employee
          </Link>
        )}

      </div>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Employees"
          value={totalEmployees}
          icon={
            <UsersRound size={20} />
          }
        />

        <StatCard
          label="Active Employees"
          value={activeEmployees}
          icon={
            <UserCheck size={20} />
          }
        />

        <StatCard
          label="Departments"
          value={departments}
          icon={
            <BriefcaseBusiness
              size={20}
            />
          }
        />

        <StatCard
          label="Managers"
          value={managers}
          icon={
            <UserRound size={20} />
          }
        />

      </div>

      {/* ======================================================
          EMPLOYEE TABLE
      ====================================================== */}

      <EmployeeDataTable
        employees={tableRows}
        canCreate={isSuperAdmin}
        canEdit={canEdit}
        canDelete={canDelete}
        canChangeStatus={
          canChangeStatus
        }
      />

    </div>
  )
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
      "
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-700
          "
        >
          {icon}
        </div>

      </div>
    </div>
  )
}