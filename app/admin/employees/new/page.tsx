import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  UserPlus
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  createEmployeeAction
} from "../actions"

import EmployeeForm from "../components/EmployeeForm"

export const dynamic = "force-dynamic"

export default async function NewEmployeePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = String(
    session.user.role ?? ""
  ).toLowerCase()

  if (role !== "super_admin") {
    redirect("/admin/employees")
  }

  const [
    departments,
    roles,
    managers
  ] = await Promise.all([
    prisma.department.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true
      }
    }),

    prisma.employeeRole.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true
      }
    }),

    prisma.employee.findMany({
      where: {
        active: true
      },

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
        firstName: true,
        lastName: true,
        employeeCode: true
      }
    })
  ])

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/employees"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Link>

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserPlus size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Add Employee
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new KoniqTech internal staff
              account and assign its operational role.
            </p>
          </div>
        </div>
      </div>

      {departments.length === 0 ||
      roles.length === 0 ? (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h2 className="font-semibold text-orange-900">
            Employee setup is incomplete
          </h2>

          <p className="mt-1 text-sm text-orange-700">
            At least one Department and one Employee
            Role must exist before creating an employee.
          </p>
        </div>
      ) : (
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