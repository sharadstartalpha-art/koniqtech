"use client"

import Link from "next/link"

import {
  type FormEvent,
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save
} from "lucide-react"

import {
  updateDepartmentAction,
  type DepartmentActionState
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type DepartmentData = {
  id: string
  name: string
  code: string | null
  description: string | null
  color: string | null
  active: boolean
}

type Props = {
  department: DepartmentData
}

const INITIAL_STATE: DepartmentActionState = {
  success: false,
  message: ""
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DepartmentEditForm({
  department
}: Props) {
  const router = useRouter()

  const [
    isPending,
    startTransition
  ] = useTransition()

  const [
    state,
    setState
  ] =
    useState<DepartmentActionState>(
      INITIAL_STATE
    )

  const [
    color,
    setColor
  ] = useState(
    department.color || "#2563eb"
  )

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    setState(INITIAL_STATE)

    startTransition(async () => {
      try {
        const result =
          await updateDepartmentAction(
            department.id,
            formData
          )

        setState(result)

        if (result.success) {
          router.push(
            `/admin/departments/${department.id}`
          )

          router.refresh()
        }
      } catch (error) {
        console.error(
          "UPDATE_DEPARTMENT_FORM_ERROR:",
          error
        )

        setState({
          success: false,
          message:
            "Something went wrong while updating the department."
        })
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      {/* HEADER */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-semibold text-slate-950">
          Department Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Edit the department name, code,
          description, color and status.
        </p>
      </div>

      {/* BODY */}

      <div className="space-y-6 p-6">
        {/* MESSAGE */}

        {state.message && (
          <div
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
              state.success
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <span>
              {state.message}
            </span>
          </div>
        )}

        {/* NAME + CODE */}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Department Name"
            name="name"
            defaultValue={
              department.name
            }
            placeholder="e.g. Data Entry"
            required
            error={
              state.errors?.name
            }
          />

          <FormField
            label="Department Code"
            name="code"
            defaultValue={
              department.code
            }
            placeholder="e.g. DATA"
            error={
              state.errors?.code
            }
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label
            htmlFor="department-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="department-description"
            name="description"
            rows={5}
            defaultValue={
              department.description ?? ""
            }
            placeholder="Describe the responsibilities and purpose of this department..."
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* COLOR */}

        <div>
          <label
            htmlFor="department-color"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Department Color
          </label>

          <div className="flex max-w-md items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(event) => {
                setColor(
                  event.target.value
                )
              }}
              className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
              aria-label="Select department color"
            />

            <input
              id="department-color"
              name="color"
              type="text"
              value={color}
              onChange={(event) => {
                setColor(
                  event.target.value
                )
              }}
              placeholder="#2563eb"
              className="h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div
              className="h-11 w-11 shrink-0 rounded-lg border border-slate-200"
              style={{
                backgroundColor:
                  color
              }}
              aria-hidden="true"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Used for department badges,
            reports and organization views.
          </p>
        </div>

        {/* STATUS */}

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <input
              id="department-active"
              name="active"
              type="checkbox"
              defaultChecked={
                department.active
              }
              className="mt-1 h-4 w-4 rounded border-slate-300 accent-green-600"
            />

            <div>
              <label
                htmlFor="department-active"
                className="cursor-pointer text-sm font-semibold text-slate-800"
              >
                Active Department
              </label>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Active departments are available
                for employee and team assignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          href={`/admin/departments/${department.id}`}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-orange-300 bg-orange-50 px-5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />

              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  defaultValue,
  placeholder,
  required = false,
  error
}: {
  label: string
  name: string
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
  error?: string
}) {
  const id =
    `department-${name}`

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type="text"
        defaultValue={
          defaultValue ?? ""
        }
        placeholder={placeholder}
        required={required}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />

          {error}
        </p>
      )}
    </div>
  )
}