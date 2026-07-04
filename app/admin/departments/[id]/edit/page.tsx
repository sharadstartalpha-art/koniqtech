import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Building2,
  Edit3
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import DepartmentEditForm from "./DepartmentEditForm"

export const dynamic = "force-dynamic"

/* =========================================================
   PAGE PROPS
========================================================= */

type PageProps = {
  params: Promise<{
    id: string
  }>
}

/* =========================================================
   ALLOWED ROLES
========================================================= */

const DEPARTMENT_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

/* =========================================================
   PAGE
========================================================= */

export default async function EditDepartmentPage({
  params
}: PageProps) {
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

  if (
    !DEPARTMENT_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/departments")
  }

  if (!session.user.orgId) {
    redirect("/admin/dashboard")
  }

  const orgId = session.user.orgId

  /* =======================================================
     PARAMS
  ======================================================= */

  const { id } = await params

  /* =======================================================
     LOAD DEPARTMENT

     Tenant-safe query:
     Department must belong to current organization.
  ======================================================= */

  const department =
    await prisma.department.findFirst({
      where: {
        id,
        orgId
      },

      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        color: true,
        active: true,

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
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* BACK */}

      <Link
        href={`/admin/departments/${department.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Department
      </Link>

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Edit3 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Edit Department
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update department information, display
              settings and operational status.
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
            department.active
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {department.active
            ? "Active Department"
            : "Inactive Department"}
        </span>
      </div>

      {/* DEPARTMENT CONTEXT */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm"
              style={
                department.color
                  ? {
                      color:
                        department.color
                    }
                  : undefined
              }
            >
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="font-semibold text-blue-950">
                {department.name}
              </p>

              <p className="mt-0.5 text-sm text-blue-700">
                {department.code
                  ? `Code: ${department.code}`
                  : "No department code"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <ContextBadge
              value={
                department._count.Employee
              }
              label="Employees"
            />

            <ContextBadge
              value={
                department._count.teams
              }
              label="Teams"
            />

            <ContextBadge
              value={
                department._count.users
              }
              label="Users"
            />
          </div>
        </div>
      </div>

      {/* EDIT FORM */}

      <DepartmentEditForm
        department={{
          id:
            department.id,

          name:
            department.name,

          code:
            department.code,

          description:
            department.description,

          color:
            department.color,

          active:
            department.active
        }}
      />
    </div>
  )
}

/* =========================================================
   CONTEXT BADGE
========================================================= */

function ContextBadge({
  value,
  label
}: {
  value: number
  label: string
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-center">
      <p className="text-sm font-bold text-blue-700">
        {value}
      </p>

      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>
    </div>
  )
}