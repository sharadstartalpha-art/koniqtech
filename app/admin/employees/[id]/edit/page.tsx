import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  UserCog
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  updateEmployeeAction
} from "../../actions"

import EmployeeForm from "../../components/EmployeeForm"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDateInput(
  value: Date | null
) {
  if (!value) {
    return null
  }

  return value.toISOString().slice(0, 10)
}

export default async function EditEmployeePage({
  params
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  if (
    !["super_admin", "manager"].includes(
      currentRole
    )
  ) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

  const [
    employee,
    departments,
    roles,
    managers
  ] = await Promise.all([
    prisma.employee.findUnique({
      where: {
        id
      },

      select: {
        id: true,
        employeeCode: true,

        firstName: true,
        lastName: true,

        email: true,
        phone: true,

        departmentId: true,
        roleId: true,
        managerId: true,

        designation: true,
        joiningDate: true,
        dateOfBirth: true,

        gender: true,
        employmentType: true,

        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,

        emergencyContactName: true,
        emergencyContactPhone: true
      }
    }),

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
        active: true,

        id: {
          not: id
        }
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

  if (!employee) {
    notFound()
  }

  const updateAction = updateEmployeeAction.bind(
    null,
    employee.id
  )

  const formEmployee = {
    ...employee,

    joiningDate: formatDateInput(
      employee.joiningDate
    ),

    dateOfBirth: formatDateInput(
      employee.dateOfBirth
    )
  }

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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <UserCog size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Edit Employee
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update {employee.firstName}{" "}
              {employee.lastName}&apos;s internal
              employee information and access role.
            </p>
          </div>
        </div>
      </div>

      <EmployeeForm
        mode="edit"
        employee={formEmployee}
        departments={departments}
        roles={roles}
        managers={managers}
        action={updateAction}
      />
    </div>
  )
}