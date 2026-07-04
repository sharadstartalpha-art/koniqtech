"use client"

import Link from "next/link"
import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save
} from "lucide-react"

import {
  createDepartmentAction,
  type DepartmentActionState
} from "../actions"

const initialState: DepartmentActionState = {
  success: false,
  message: ""
}

export default function DepartmentCreateForm() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [state, setState] =
    useState<DepartmentActionState>(initialState)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    setState(initialState)

    startTransition(async () => {
      const result = await createDepartmentAction(formData)

      setState(result)

      if (result.success) {
        router.push("/admin/departments")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 p-6">
        {/* Global Message */}

        {state.message && (
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
              state.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <span>{state.message}</span>
          </div>
        )}

        {/* Main Fields */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Department Name */}

          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Department Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Data Entry"
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                state.errors?.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {state.errors?.name && (
              <p className="text-xs text-red-600">
                {state.errors.name}
              </p>
            )}
          </div>

          {/* Department Code */}

          <div className="space-y-2">
            <label
              htmlFor="code"
              className="text-sm font-medium text-slate-700"
            >
              Department Code
            </label>

            <input
              id="code"
              name="code"
              type="text"
              maxLength={30}
              placeholder="e.g. DATA"
              className={`h-11 w-full rounded-lg border bg-white px-3 text-sm uppercase text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                state.errors?.code
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {state.errors?.code ? (
              <p className="text-xs text-red-600">
                {state.errors.code}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Optional short code for internal identification.
              </p>
            )}
          </div>
        </div>

        {/* Description */}

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Describe the responsibilities and purpose of this department..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Color */}

        <div className="space-y-2">
          <label
            htmlFor="color"
            className="text-sm font-medium text-slate-700"
          >
            Department Color
          </label>

          <div className="flex max-w-md items-center gap-3">
            <input
              id="colorPicker"
              type="color"
              defaultValue="#2563eb"
              className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
              onChange={(event) => {
                const input = document.getElementById(
                  "color"
                ) as HTMLInputElement | null

                if (input) {
                  input.value = event.target.value
                }
              }}
            />

            <input
              id="color"
              name="color"
              type="text"
              defaultValue="#2563eb"
              placeholder="#2563eb"
              className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <p className="text-xs text-slate-500">
            Used for department badges, reports and organization views.
          </p>
        </div>
      </div>

      {/* Footer Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          href="/admin/departments"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Create Department
            </>
          )}
        </button>
      </div>
    </form>
  )
}