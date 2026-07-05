import Link from "next/link"
import { redirect } from "next/navigation"

import {
  ArrowLeft,
  PlusCircle,
  ShieldCheck
} from "lucide-react"

import { auth } from "@/auth"

import {
  createRoleAction
} from "../actions"

import RoleForm from "../components/RoleForm"

export const dynamic = "force-dynamic"

/* =========================================================
   ACCESS CONTROL
========================================================= */

const ROLE_MANAGEMENT_ROLES = new Set([
  "super_admin"
])

/* =========================================================
   PAGE
========================================================= */

export default async function NewRolePage() {
  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  /* =======================================================
     AUTHORIZATION
  ======================================================= */

  const currentRole = String(
    session.user.role ?? ""
  )

  if (
    !ROLE_MANAGEMENT_ROLES.has(
      currentRole
    )
  ) {
    redirect("/admin/roles")
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        href="/admin/roles"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Roles
      </Link>

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <PlusCircle className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Create Employee Role
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Create a new internal KoniqTech staff role and
              configure its operational permissions.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
          <ShieldCheck className="h-4 w-4" />

          Internal Staff Role
        </span>
      </div>

      {/* ===================================================
          INFORMATION PANEL
      =================================================== */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-blue-950">
              Employee Role Permissions
            </p>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-blue-700">
              This role will be available for KoniqTech internal
              employees. Configure create, edit, delete,
              approval, assignment, and export permissions
              according to the employee&apos;s responsibilities.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          FORM
      =================================================== */}

      <RoleForm
        mode="create"
        action={createRoleAction}
      />
    </div>
  )
}