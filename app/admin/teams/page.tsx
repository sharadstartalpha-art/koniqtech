import Link from "next/link"
import { redirect } from "next/navigation"

import {
  Building2,
  Plus,
  Users,
  Network,
  ArrowRight,
  UserRoundCheck
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

/* =========================================================
   ALLOWED INTERNAL ROLES
========================================================= */

const ALLOWED_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function TeamsPage() {
  /* =======================================================
     AUTHORIZATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  )

  if (!ALLOWED_ROLES.has(currentRole)) {
    redirect("/admin/dashboard")
  }

  if (!session.user.orgId) {
    redirect("/admin/dashboard")
  }

  const orgId = session.user.orgId

  /* =======================================================
     LOAD TEAMS

     IMPORTANT:
     Queries are isolated by current organization.
  ======================================================= */

  const teams = await prisma.team.findMany({
    where: {
      orgId
    },

    orderBy: {
      name: "asc"
    },

    select: {
      id: true,
      name: true,

      department: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },

      leader: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },

      _count: {
        select: {
          members: true
        }
      }
    }
  })

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalMembers = teams.reduce(
    (total, team) =>
      total + team._count.members,
    0
  )

  const teamsWithLeaders = teams.filter(
    (team) => Boolean(team.leader)
  ).length

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Teams
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage internal KoniqTech teams, departments,
            team leaders and members.
          </p>
        </div>

        <Link
          href="/admin/teams/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />

          Add Team
        </Link>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Teams"
          value={teams.length}
          description="Internal operational teams"
          icon={
            <Network className="h-5 w-5" />
          }
          variant="blue"
        />

        <SummaryCard
          title="Team Members"
          value={totalMembers}
          description="Users assigned across teams"
          icon={
            <Users className="h-5 w-5" />
          }
          variant="green"
        />

        <SummaryCard
          title="Teams With Leaders"
          value={teamsWithLeaders}
          description="Teams with assigned leadership"
          icon={
            <UserRoundCheck className="h-5 w-5" />
          }
          variant="orange"
        />
      </div>

      {/* ===================================================
          TEAM DIRECTORY
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Team Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Teams configured for the internal organization.
          </p>
        </div>

        {teams.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <TableHeading>
                    Team
                  </TableHeading>

                  <TableHeading>
                    Department
                  </TableHeading>

                  <TableHeading>
                    Team Leader
                  </TableHeading>

                  <TableHeading>
                    Members
                  </TableHeading>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {teams.map((team) => (
                  <tr
                    key={team.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* =====================================
                        TEAM
                    ===================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Network className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-950">
                            {team.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Internal Team
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =====================================
                        DEPARTMENT
                    ===================================== */}

                    <td className="px-6 py-4">
                      {team.department ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                team.department.color ||
                                "#2563eb"
                            }}
                          />

                          <Link
                            href={`/admin/departments/${team.department.id}`}
                            className="text-sm font-medium text-slate-700 transition hover:text-blue-600"
                          >
                            {team.department.name}
                          </Link>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          No department
                        </span>
                      )}
                    </td>

                    {/* =====================================
                        LEADER
                    ===================================== */}

                    <td className="px-6 py-4">
                      {team.leader ? (
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {team.leader.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {team.leader.email}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* =====================================
                        MEMBER COUNT
                    ===================================== */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-semibold text-slate-700">
                          {team._count.members}
                        </span>
                      </div>
                    </td>

                    {/* =====================================
                        ACTION
                    ===================================== */}

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/teams/${team.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                      >
                        View

                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================
          ORGANIZATION NOTE
      =================================================== */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-semibold text-blue-950">
            Internal Team Management
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            These teams belong to the current KoniqTech
            organization structure. Team membership and
            leadership should remain separate from customer
            organization workforce operations.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  description,
  icon,
  variant
}: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  variant: "blue" | "green" | "orange"
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600",

    green:
      "bg-green-50 text-green-600",

    orange:
      "bg-orange-50 text-orange-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   TABLE HEADING
========================================================= */

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Network className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-950">
        No teams found
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
        Create a team and assign it to a department,
        then configure its leader and members.
      </p>

      <Link
        href="/admin/teams/new"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />

        Add Team
      </Link>
    </div>
  )
}