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

   These are KoniqTech internal administration roles.

   They are intentionally separate from customer CRM roles
   such as owner, manager, sales, technician, etc.
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
     Internal platform role comes from session.user.role.

     organizationRole is the customer/organization role and
     should NOT be used for this internal admin authorization.
  ========================================================== */

  const currentRole = String(
    (session.user as any).role ?? ""
  )
    .trim()
    .toLowerCase()

  /* ==========================================================
     AUTHORIZATION
  ========================================================== */

  if (!INTERNAL_EMPLOYEE_ROLES.includes(currentRole)) {
    redirect("/admin/dashboard")
  }

  /* ==========================================================
     GET KONIQTECH ORGANIZATION

     Do not hard-code the organization UUID.
  ========================================================== */

  const koniqTechOrganization =
    await prisma.organization.findFirst({
      where: {
        slug: "koniqtech",
      },
      select: {
        id: true,
        slug: true,
      },
    })

  /* ==========================================================
     ORGANIZATION SAFETY

     If the internal KoniqTech organization cannot be found,
     do not accidentally display records from another tenant.
  ========================================================== */

  if (!koniqTechOrganization) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Employees
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage KoniqTech internal employees, roles,
            departments and reporting structure.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-900">
            KoniqTech organization not found
          </h2>

          <p className="mt-1 text-sm text-red-700">
            The internal KoniqTech organization could not be
            found. Please verify the organization configuration
            before managing employees.
          </p>
        </div>
      </div>
    )
  }

  /* ==========================================================
     LOAD DATA

     Employees are filtered through their department so that
     only employees belonging to the KoniqTech organization
     are displayed.

     Departments are counted directly from Department.
     This is important because the employee table can be empty
     while departments already exist.
  ========================================================== */

  const [
    employees,
    departmentCount,
  ] = await Promise.all([
    prisma.employee.findMany({
      where: {
        department: {
          orgId: koniqTechOrganization.id,
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
        orgId: koniqTechOrganization.id,
      },
    }),
  ])

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const totalEmployees = employees.length

  const activeEmployees = employees.filter(
    (employee) => employee.active
  ).length

  /*
   * IMPORTANT:
   *
   * Do NOT calculate departments from employees.
   *
   * The database can contain departments even when there
   * are currently zero employees assigned to them.
   */
  const departments = departmentCount

  /*
   * A manager is an employee who has at least one employee
   * reporting to them.
   */
  const managers = employees.filter(
    (employee) =>
      employees.some(
        (otherEmployee) =>
          otherEmployee.managerId === employee.id
      )
  ).length

  /* ==========================================================
     PERMISSIONS
  ========================================================== */

  const isSuperAdmin =
    currentRole === "super_admin"

  const canEdit =
    currentRole === "super_admin" ||
    currentRole === "platform_manager"

  const canDelete =
    currentRole === "super_admin"

  const canChangeStatus =
    currentRole === "super_admin"

  /* ==========================================================
     TABLE DATA

     Convert Date objects to strings before passing them into
     the client component.
  ========================================================== */

  const tableRows = employees.map(
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
            Manage KoniqTech internal employees, roles,
            departments and reporting structure.
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
            <BriefcaseBusiness size={20} />
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

        canCreate={
          isSuperAdmin
        }

        canEdit={
          canEdit
        }

        canDelete={
          canDelete
        }

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