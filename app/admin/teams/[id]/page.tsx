import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Edit3,
  Mail,
  Network,
  ShieldCheck,
  UserRound,
  Users
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import TeamDetailActions from "./TeamDetailActions"

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
   ALLOWED ROLES
========================================================= */

const TEAM_VIEW_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function TeamDetailsPage({
  params
}: PageProps) {
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

  if (!TEAM_VIEW_ROLES.has(currentRole)) {
    redirect("/admin/dashboard")
  }

  /* =======================================================
     PARAMS
  ======================================================= */

  const { id } = await params

  /* =======================================================
     LOAD TEAM

     Organization isolation:
     Team must belong to current orgId.
  ======================================================= */

  const team = await prisma.team.findFirst({
    where: {
      id,
      orgId
    },

    select: {
      id: true,
      name: true,
      description: true,
      active: true,
      createdAt: true,
      updatedAt: true,

      department: {
        select: {
          id: true,
          name: true,
          code: true,
          color: true,
          active: true
        }
      },

      leader: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          phone: true,
          status: true,

          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              designation: true,
              active: true
            }
          }
        }
      },

      members: {
        where: {
          orgId
        },

        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          status: true,

          employee: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              designation: true,
              active: true
            }
          }
        },

        orderBy: {
          name: "asc"
        }
      },

      _count: {
        select: {
          members: true,
          TeamInvitation: true
        }
      }
    }
  })

  if (!team) {
    notFound()
  }

  /* =======================================================
     DATE FORMATTERS
  ======================================================= */

  const createdDate =
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(team.createdAt)

  const updatedDate =
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(team.updatedAt)

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

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Network className="h-7 w-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {team.name}
                </h1>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    team.active
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {team.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />

                  Created {createdDate}
                </span>

                <span>
                  Last updated {updatedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/teams/${team.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Edit3 className="h-4 w-4" />

              Edit Team
            </Link>

            <TeamDetailActions
              teamId={team.id}
              teamName={team.name}
              active={team.active}
              invitationCount={
                team._count.TeamInvitation
              }
            />
          </div>
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Members"
          value={team._count.members}
          description="Internal employees assigned to this team"
          icon={
            <Users className="h-5 w-5" />
          }
          variant="blue"
        />

        <SummaryCard
          title="Leadership"
          value={team.leader ? 1 : 0}
          description={
            team.leader
              ? "Team leader assigned"
              : "No team leader assigned"
          }
          icon={
            <ShieldCheck className="h-5 w-5" />
          }
          variant="orange"
        />

        <SummaryCard
          title="Invitations"
          value={
            team._count.TeamInvitation
          }
          description="Invitations linked to this team"
          icon={
            <Mail className="h-5 w-5" />
          }
          variant="green"
        />
      </div>

      {/* ===================================================
          TEAM OVERVIEW
      =================================================== */}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* DESCRIPTION */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-950">
              Team Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              General information and responsibilities.
            </p>
          </div>

          <div className="p-6">
            <p className="text-sm leading-7 text-slate-600">
              {team.description ||
                "No description has been added for this team."}
            </p>
          </div>
        </div>

        {/* DEPARTMENT */}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold text-slate-950">
              Department
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organizational department assignment.
            </p>
          </div>

          <div className="p-6">
            {team.department ? (
              <Link
                href={`/admin/departments/${team.department.id}`}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor:
                      team.department.color
                        ? `${team.department.color}15`
                        : "#eff6ff",

                    color:
                      team.department.color ||
                      "#2563eb"
                  }}
                >
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-slate-950 transition group-hover:text-blue-700">
                    {team.department.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {team.department.code
                      ? `Code: ${team.department.code}`
                      : "Department"}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Building2 className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No department assigned
                </p>

                <Link
                  href={`/admin/teams/${team.id}/edit`}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Assign Department
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          TEAM LEADER
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Team Leadership
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Employee responsible for managing this team.
          </p>
        </div>

        <div className="p-6">
          {team.leader ? (
            <div className="flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <UserAvatar
                  name={team.leader.name}
                  avatar={team.leader.avatar}
                  variant="orange"
                />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">
                      {team.leader.name}
                    </p>

                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                      Team Leader
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {team.leader.employee
                      ?.designation ||
                      "Internal Employee"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {team.leader.email}
                  </p>
                </div>
              </div>

              {team.leader.employee && (
                <Link
                  href={`/admin/employees/${team.leader.employee.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Employee
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <UserRound className="h-6 w-6" />
              </div>

              <p className="mt-4 font-semibold text-slate-900">
                No team leader assigned
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Assign an internal employee to lead this team.
              </p>

              <Link
                href={`/admin/teams/${team.id}/edit`}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Assign Leader
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          MEMBERS TABLE
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">
              Team Members
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Internal employees currently assigned to {team.name}.
            </p>
          </div>

          <Link
            href={`/admin/teams/${team.id}/edit`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <Users className="h-4 w-4" />

            Manage Members
          </Link>
        </div>

        {team.members.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-950">
              No members assigned
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Add internal employees to organize this team's
              operational responsibilities.
            </p>

            <Link
              href={`/admin/teams/${team.id}/edit`}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Members
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <TableHeading>
                    Employee
                  </TableHeading>

                  <TableHeading>
                    Employee Code
                  </TableHeading>

                  <TableHeading>
                    Designation
                  </TableHeading>

                  <TableHeading>
                    Role
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {team.members.map((member) => {
                  const isLeader =
                    member.id === team.leader?.id

                  return (
                    <tr
                      key={member.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={member.name}
                            avatar={member.avatar}
                            variant={
                              isLeader
                                ? "orange"
                                : "blue"
                            }
                          />

                          <div className="min-w-0">
                            <p className="font-medium text-slate-950">
                              {member.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-700">
                        {member.employee
                          ?.employeeCode ||
                          "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {member.employee
                          ?.designation ||
                          "—"}
                      </td>

                      <td className="px-6 py-4">
                        {isLeader ? (
                          <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                            Team Leader
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            Member
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            member.employee?.active &&
                            member.status === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {member.employee?.active &&
                          member.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {member.employee ? (
                          <Link
                            href={`/admin/employees/${member.employee.id}`}
                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
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
   USER AVATAR
========================================================= */

function UserAvatar({
  name,
  avatar,
  variant
}: {
  name: string
  avatar: string | null
  variant: "blue" | "orange"
}) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    )
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("")

  const styles = {
    blue:
      "bg-blue-50 text-blue-700",

    orange:
      "bg-orange-100 text-orange-700"
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles[variant]}`}
    >
      {initials || "U"}
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