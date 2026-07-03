import Link from "next/link"
import { redirect } from "next/navigation"

import {
  BriefcaseBusiness,
  Plus,
  UserCheck,
  UserRound,
  UsersRound
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import EmployeeDataTable from "./components/EmployeeDataTable"

export const dynamic = "force-dynamic"

export default async function AdminEmployeesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  const allowedRoles = [
    "super_admin",
    "manager",
    "accountant"
  ]

  if (!allowedRoles.includes(currentRole)) {
    redirect("/admin/dashboard")
  }

  const employees = await prisma.employee.findMany({
    include: {
      department: {
        select: {
          id: true,
          name: true
        }
      },

      role: {
        select: {
          id: true,
          name: true
        }
      },

      manager: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },

    orderBy: [
      {
        active: "desc"
      },
      {
        createdAt: "desc"
      }
    ]
  })

  const totalEmployees = employees.length

  const activeEmployees = employees.filter(
    (employee) => employee.active
  ).length

  const departments = new Set(
    employees.map((employee) => employee.departmentId)
  ).size

  const managers = employees.filter(
    (employee) =>
      employees.some(
        (otherEmployee) =>
          otherEmployee.managerId === employee.id
      )
  ).length

  const isSuperAdmin = currentRole === "super_admin"

  const tableRows = employees.map((employee) => ({
    id: employee.id,
    employeeCode: employee.employeeCode,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    designation: employee.designation,
    active: employee.active,

    department: employee.department,
    role: employee.role,
    manager: employee.manager,

    createdAt: employee.createdAt.toISOString()
  }))

  return (
    <div className="space-y-6">
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

        {isSuperAdmin && (
          <Link
            href="/admin/employees/new"
className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"          >
            <Plus size={17} />
            Add Employee
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={totalEmployees}
          icon={<UsersRound size={20} />}
        />

        <StatCard
          label="Active Employees"
          value={activeEmployees}
          icon={<UserCheck size={20} />}
        />

        <StatCard
          label="Departments"
          value={departments}
          icon={<BriefcaseBusiness size={20} />}
        />

        <StatCard
          label="Managers"
          value={managers}
          icon={<UserRound size={20} />}
        />
      </div>

      <EmployeeDataTable
        employees={tableRows}
        canCreate={isSuperAdmin}
        canEdit={
          currentRole === "super_admin" ||
          currentRole === "manager"
        }
        canDelete={isSuperAdmin}
        canChangeStatus={isSuperAdmin}
      />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon
}: {
  label: string
  value: number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  )
}