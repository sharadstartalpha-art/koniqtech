import Link from "next/link"
import {
  Building2,
  Plus,
  Users,
  ArrowRight,
  Layers3
} from "lucide-react"

import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    orderBy: {
      name: "asc"
    },
    include: {
      _count: {
        select: {
    Employee: true,
    users: true,
    teams: true
  }
      }
    }
  })

  const totalEmployees = departments.reduce(
    (total, department) =>
      total + department._count.Employee,
    0
  )

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Departments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage internal departments and employee organization.
          </p>
        </div>

        <Link
          href="/admin/departments/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Department
        </Link>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Departments"
          value={departments.length}
          description="Active organizational departments"
          icon={<Building2 className="h-5 w-5" />}
        />

        <SummaryCard
          title="Employees"
          value={totalEmployees}
          description="Employees assigned to departments"
          icon={<Users className="h-5 w-5" />}
        />

        <SummaryCard
          title="Organization Structure"
          value={departments.length}
          description="Departments available for assignment"
          icon={<Layers3 className="h-5 w-5" />}
        />
      </div>

      {/* =========================================================
          DEPARTMENT TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-950">
            Department Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Departments available across the internal platform.
          </p>
        </div>

        {departments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employees
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* DEPARTMENT */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-950">
                            {department.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Department
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-md px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {department.description ||
                          "No description added"}
                      </p>
                    </td>

                    {/* EMPLOYEE COUNT */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-700">
                          {department._count.Employee}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/departments/${department.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
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
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Building2 className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-950">
        No departments found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Create your first department to organize employees and
        reporting structures.
      </p>

      <Link
        href="/admin/departments/new"
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add Department
      </Link>
    </div>
  )
}