import Link from "next/link"
import { notFound } from "next/navigation"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Edit3,
  Mail,
  Network,
  UserRound,
  Users
} from "lucide-react"

import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"

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
   PAGE
========================================================= */

export default async function DepartmentDetailsPage({
  params
}: PageProps) {
  const { id } = await params

  const session = await auth()

  if (!session?.user?.orgId) {
    notFound()
  }

  const orgId = session.user.orgId

  /* =======================================================
     LOAD DEPARTMENT
  ======================================================= */

  const department = await prisma.department.findFirst({
    where: {
      id,
      orgId
    },

    include: {
      Employee: {
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
          employeeCode: true,
          firstName: true,
          lastName: true,
          email: true,
          designation: true,
          avatar: true,
          active: true,

          role: {
            select: {
              name: true
            }
          }
        }
      },

      teams: {
        orderBy: {
          name: "asc"
        },

        select: {
          id: true,
          name: true
        }
      },

      _count: {
        select: {
          Employee: true,
          users: true,
          teams: true
        }
      }
    }
  })

  if (!department) {
    notFound()
  }

  /* =======================================================
     DATE FORMATTER
  ======================================================= */

  const createdDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(department.createdAt)

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK LINK
      =================================================== */}

      <Link
        href="/admin/departments"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Departments
      </Link>

      {/* ===================================================
          DEPARTMENT HEADER
      =================================================== */}

      <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: department.color
                ? `${department.color}15`
                : "#eff6ff",

              color: department.color || "#2563eb"
            }}
          >
            <Building2 className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {department.name}
              </h1>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  department.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {department.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              {department.code && (
                <span>
                  Code:{" "}
                  <span className="font-medium text-slate-700">
                    {department.code}
                  </span>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Created {createdDate}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/admin/departments/${department.id}/edit`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Edit3 className="h-4 w-4" />
          Edit Department
        </Link>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Employees"
          value={department._count.Employee}
          description="Employees assigned to department"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Users"
          value={department._count.users}
          description="Platform users linked to department"
          icon={<UserRound className="h-5 w-5" />}
        />

        <StatCard
          title="Teams"
          value={department._count.teams}
          description="Teams within this department"
          icon={<Network className="h-5 w-5" />}
        />
      </div>

      {/* ===================================================
          DESCRIPTION
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Department Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            General information about this department.
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm leading-7 text-slate-600">
            {department.description ||
              "No description has been added for this department."}
          </p>
        </div>
      </div>

      {/* ===================================================
          EMPLOYEES
      =================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-950">
              Department Employees
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Employees currently assigned to {department.name}.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {department.Employee.length} employees
          </span>
        </div>

        {department.Employee.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-950">
              No employees assigned
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              Employees assigned to this department will appear here.
            </p>

            <Link
              href="/admin/employees/new"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Add Employee
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
                {department.Employee.map((employee) => {
                  const fullName =
                    `${employee.firstName} ${employee.lastName}`.trim()

                  return (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      {/* Employee */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {employee.avatar ? (
                            <img
                              src={employee.avatar}
                              alt={fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                              {employee.firstName
                                .charAt(0)
                                .toUpperCase()}

                              {employee.lastName
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-slate-950">
                              {fullName}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail className="h-3.5 w-3.5" />

                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee Code */}

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">
                          {employee.employeeCode}
                        </span>
                      </td>

                      {/* Role */}

                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {employee.designation ||
                            employee.role.name}
                        </p>

                        {employee.designation && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {employee.role.name}
                          </p>
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            employee.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {employee.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/employees/${employee.id}`}
                          className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================
          TEAMS
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Teams
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Teams assigned to this department.
          </p>
        </div>

        {department.teams.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Network className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              No teams have been assigned to this department.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {department.teams.map((team) => (
              <Link
                key={team.id}
                href={`/admin/teams/${team.id}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium text-slate-950">
                    {team.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    View team
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
  icon
}: {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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