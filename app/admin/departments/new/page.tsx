import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"

import DepartmentCreateForm from "../components/DepartmentCreateForm"

export default function NewDepartmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/departments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Departments
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Create Department
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new internal department to your organization.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-start gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-950">
              Department Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the department name, code, description and display
              color.
            </p>
          </div>
        </div>

        <DepartmentCreateForm />
      </div>
    </div>
  )
}