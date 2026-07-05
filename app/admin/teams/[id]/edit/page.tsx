import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  Edit3,
  Network,
  ShieldCheck,
  Users
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import TeamForm, {
  type TeamDepartmentOption,
  type TeamEmployeeOption,
  type TeamFormValues
} from "../../components/TeamForm"

import {
  updateTeamAction
} from "../../actions"

export const dynamic = "force-dynamic"

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   PERMISSIONS
========================================================= */

const TEAM_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function EditTeamPage({
  params
}: PageProps) {
  /* =======================================================
     AUTH
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
     PARAMS
  ======================================================= */

  const { id } = await params

  /* =======================================================
     LOAD DATA

     1. Existing Team
     2. Active Departments
     3. Active Internal Employees

     Employee organization isolation is enforced through
     the linked User record.
  ======================================================= */

  const [
    teamRecord,
    departmentRecords,
    employeeRecords
  ] = await Promise.all([
    /* -----------------------------------------------------
       TEAM
    ----------------------------------------------------- */

    prisma.team.findFirst({
      where: {
        id,
        orgId
      },

      select: {
        id: true,
        name: true,
        description: true,
        departmentId: true,
        leaderId: true,
        active: true,

        members: {
          where: {
            orgId
          },

          select: {
            id: true
          }
        },

        department: {
          select: {
            id: true,
            name: true,
            active: true
          }
        },

        leader: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    }),

    /* -----------------------------------------------------
       DEPARTMENTS
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       INTERNAL EMPLOYEES

       Employee does not have orgId.

       Therefore organization isolation is enforced through:

       Employee.user.orgId
    ----------------------------------------------------- */

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
     NOT FOUND
  ======================================================= */

  if (!teamRecord) {
    notFound()
  }

  /* =======================================================
     DEPARTMENT OPTIONS

     Important:
     If the team is connected to an inactive department,
     keep that department available in the edit form.

     Otherwise editing the team could silently lose its
     existing department context.
  ======================================================= */

  let departments: TeamDepartmentOption[] =
    departmentRecords.map(
      (department) => ({
        id: department.id,

        name: department.name,

        color: department.color
      })
    )

  if (
    teamRecord.department &&
    !departments.some(
      (department) =>
        department.id ===
        teamRecord.department?.id
    )
  ) {
    const existingDepartment =
      await prisma.department.findFirst({
        where: {
          id:
            teamRecord.department.id,

          orgId
        },

        select: {
          id: true,
          name: true,
          color: true
        }
      })

    if (existingDepartment) {
      departments = [
        {
          id:
            existingDepartment.id,

          name:
            `${existingDepartment.name} (Inactive)`,

          color:
            existingDepartment.color
        },

        ...departments
      ]
    }
  }

  /* =======================================================
     EMPLOYEE OPTIONS

     Prisma still types Employee.user as nullable because
     Employee.userId is optional.

     The query guarantees a linked matching user, but this
     filter also gives TypeScript safe narrowing.
  ======================================================= */

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
        userId:
          employee.user.id,

        employeeId:
          employee.id,

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
     FORM VALUES
  ======================================================= */

  const team: TeamFormValues = {
    id:
      teamRecord.id,

    name:
      teamRecord.name,

    description:
      teamRecord.description,

    departmentId:
      teamRecord.departmentId,

    leaderId:
      teamRecord.leaderId,

    memberIds:
      teamRecord.members.map(
        (member) => member.id
      ),

    active:
      teamRecord.active
  }

  /* =======================================================
     BOUND UPDATE ACTION

     TeamForm expects:

     (formData: FormData)
       => Promise<TeamActionState>

     updateTeamAction expects:

     (teamId: string, formData: FormData)
       => Promise<TeamActionState>

     Binding the ID creates the correct function signature.
  ======================================================= */

  const updateAction =
    updateTeamAction.bind(
      null,
      teamRecord.id
    )

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK LINK
      =================================================== */}

      <Link
        href={`/admin/teams/${teamRecord.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Team
      </Link>

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Edit3 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Edit Team
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Update the team structure, department,
              leadership, members, and operational status.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
            teamRecord.active
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />

          {teamRecord.active
            ? "Active Team"
            : "Inactive Team"}
        </span>
      </div>

      {/* ===================================================
          TEAM CONTEXT
      =================================================== */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Network className="h-6 w-6" />
            </div>

            <div>
              <p className="font-semibold text-blue-950">
                {teamRecord.name}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-700">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />

                  {teamRecord.members.length}{" "}
                  {teamRecord.members.length === 1
                    ? "member"
                    : "members"}
                </span>

                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />

                  {teamRecord.department?.name ??
                    "No department"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <ContextCard
              label="Members"
              value={
                teamRecord.members.length
              }
              variant="blue"
            />

            <ContextCard
              label="Leader"
              value={
                teamRecord.leader
                  ? "Assigned"
                  : "None"
              }
              variant={
                teamRecord.leader
                  ? "green"
                  : "orange"
              }
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <TeamForm
        mode="edit"
        team={team}
        departments={departments}
        employees={employees}
        action={updateAction}
      />
    </div>
  )
}

/* =========================================================
   CONTEXT CARD
========================================================= */

function ContextCard({
  label,
  value,
  variant
}: {
  label: string
  value: string | number
  variant:
    | "blue"
    | "green"
    | "orange"
}) {
  const styles = {
    blue:
      "border-blue-200 text-blue-700",

    green:
      "border-green-200 text-green-700",

    orange:
      "border-orange-200 text-orange-700"
  }

  return (
    <div
      className={`min-w-24 rounded-lg border bg-white px-4 py-2.5 text-center ${styles[variant]}`}
    >
      <p className="text-sm font-bold">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-medium text-slate-500">
        {label}
      </p>
    </div>
  )
}