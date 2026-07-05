import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  Network,
  ShieldCheck,
  Users
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import TeamForm, {
  type TeamDepartmentOption,
  type TeamEmployeeOption
} from "../components/TeamForm"

import {
  createTeamAction
} from "../actions"

export const dynamic = "force-dynamic"

/* =========================================================
   ALLOWED INTERNAL ROLES
========================================================= */

const TEAM_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function NewTeamPage() {
  /* =======================================================
     AUTHORIZATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = String(
    session.user.orgId ?? ""
  )

  const currentRole = String(
    session.user.role ?? ""
  )

  if (!orgId) {
    redirect("/admin/dashboard")
  }

  if (
    !TEAM_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/teams")
  }

  /* =======================================================
     LOAD DEPARTMENTS + INTERNAL EMPLOYEES

     Employee itself has no orgId.

     Organization isolation is enforced through:

     Employee.user.orgId === current orgId
  ======================================================= */

  const [
    departmentRecords,
    employeeRecords
  ] = await Promise.all([
    prisma.department.findMany({
      where: {
        orgId,
        active: true
      },

      select: {
        id: true,
        name: true,
        color: true
      },

      orderBy: {
        name: "asc"
      }
    }),

    prisma.employee.findMany({
      where: {
        active: true,

        user: {
          is: {
            orgId,
            status: "active"
          }
        }
      },

      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        email: true,
        designation: true,
        departmentId: true,

        user: {
          select: {
            id: true
          }
        }
      },

      orderBy: [
        {
          firstName: "asc"
        },
        {
          lastName: "asc"
        }
      ]
    })
  ])

  /* =======================================================
     MAP FORM OPTIONS
  ======================================================= */

  const departments: TeamDepartmentOption[] =
    departmentRecords.map(
      (department) => ({
        id: department.id,
        name: department.name,
        color: department.color
      })
    )

  /*
   * Prisma knows user can technically be null because
   * Employee.userId is optional.
   *
   * The query above already filters to Employee records
   * having a matching linked User, but we still filter here
   * for TypeScript safety.
   */

  const employees: TeamEmployeeOption[] =
    employeeRecords
      .filter(
        (
          employee
        ): employee is typeof employee & {
          user: {
            id: string
          }
        } => employee.user !== null
      )
      .map((employee) => ({
        userId: employee.user.id,

        employeeId: employee.id,

        employeeCode:
          employee.employeeCode,

        name:
          `${employee.firstName} ${employee.lastName}`.trim(),

        email:
          employee.email,

        designation:
          employee.designation,

        departmentId:
          employee.departmentId
      }))

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        href="/admin/teams"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Teams
      </Link>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Network className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Create Team
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Create an internal KoniqTech team,
              assign its department, select a leader,
              and organize internal employees.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          <ShieldCheck className="h-4 w-4" />

          Internal Team
        </div>
      </div>

      {/* ===================================================
          SUMMARY STRIP
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          icon={
            <Network className="h-5 w-5" />
          }
          title="Available Departments"
          value={departments.length}
          description="Active departments available for team assignment."
          variant="blue"
        />

        <InfoCard
          icon={
            <Users className="h-5 w-5" />
          }
          title="Available Employees"
          value={employees.length}
          description="Active internal employee accounts available for teams."
          variant="green"
        />
      </div>

      {/* ===================================================
          WARNING WHEN NO EMPLOYEES EXIST
      =================================================== */}

      {employees.length === 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

            <div>
              <p className="text-sm font-semibold text-orange-900">
                No internal employees are available
              </p>

              <p className="mt-1 text-sm leading-6 text-orange-700">
                You can still create the team, but a team
                leader and members cannot be assigned until
                active employees have linked internal user
                accounts.
              </p>

              <Link
                href="/admin/employees/new"
                className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Add Employee
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          FORM
      =================================================== */}

      <TeamForm
        mode="create"
        departments={departments}
        employees={employees}
        action={createTeamAction}
      />
    </div>
  )
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  title,
  value,
  description,
  variant
}: {
  icon: React.ReactNode
  title: string
  value: number
  description: string
  variant: "blue" | "green"
}) {
  const iconStyles = {
    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconStyles[variant]}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {value}
            </p>

            <p className="text-sm font-medium text-slate-700">
              {title}
            </p>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}