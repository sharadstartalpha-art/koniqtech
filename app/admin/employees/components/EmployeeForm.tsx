"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useState,
  useTransition,
  type FormEvent,
  type ReactNode
} from "react"

import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
  UserRound
} from "lucide-react"

import type {
  EmployeeActionState
} from "../actions"

/* =========================================================
   OPTION TYPES
========================================================= */

type DepartmentOption = {
  id: string
  name: string
}

type RoleOption = {
  id: string
  name: string
}

type ManagerOption = {
  id: string
  firstName: string
  lastName: string
  employeeCode: string
}

/* =========================================================
   FORM VALUE TYPE
========================================================= */

export type EmployeeFormValues = {
  id?: string

  employeeCode?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string | null

  userRole?: string | null

  departmentId?: string
  roleId?: string
  managerId?: string | null

  designation?: string | null

  joiningDate?: string | null
  dateOfBirth?: string | null

  gender?: string | null
  employmentType?: string | null

  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null

  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
}

/* =========================================================
   COMPONENT PROPS
========================================================= */

type Props = {
  mode: "create" | "edit"

  employee?: EmployeeFormValues

  departments: DepartmentOption[]

  roles: RoleOption[]

  managers: ManagerOption[]

  action: (
    formData: FormData
  ) => Promise<EmployeeActionState>
}

/* =========================================================
   INTERNAL PLATFORM ROLE OPTIONS

   IMPORTANT:
   These values must match Prisma UserRole enum exactly.
========================================================= */

const INTERNAL_PLATFORM_ROLES = [
  {
    value: "super_admin",
    label: "Super Admin"
  },
  {
    value: "platform_manager",
    label: "Platform Manager"
  },
  {
    value: "platform_sales",
    label: "Sales"
  },
  {
    value: "marketing",
    label: "Marketing"
  },
  {
    value: "finance",
    label: "Accountant / Finance"
  },
  {
    value: "support",
    label: "Support"
  },
  {
    value: "data_entry",
    label: "Data Entry"
  },
  {
    value: "developer",
    label: "Developer"
  },
  {
    value: "qa",
    label: "QA"
  },
  {
    value: "customer_success",
    label: "Customer Success"
  }
] as const

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function EmployeeForm({
  mode,
  employee,
  departments,
  roles,
  managers,
  action
}: Props) {
  const router = useRouter()

  const [isPending, startTransition] =
    useTransition()

  const [message, setMessage] =
    useState<string | null>(null)

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null)

  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({})

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form = event.currentTarget

    const formData = new FormData(form)

    setMessage(null)
    setSuccessMessage(null)
    setFieldErrors({})

    startTransition(async () => {
      try {
        const result = await action(formData)

        if (!result.success) {
          setMessage(
            result.message ||
              "Unable to save employee."
          )

          setFieldErrors(
            result.errors ?? {}
          )

          return
        }

        setSuccessMessage(
          result.message ||
            (mode === "create"
              ? "Employee created successfully."
              : "Employee updated successfully.")
        )

        router.push("/admin/employees")
        router.refresh()
      } catch (error) {
        console.error(
          "Employee form submission failed:",
          error
        )

        setMessage(
          "Something went wrong while saving the employee. Please try again."
        )
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ===================================================
          ERROR MESSAGE
      =================================================== */}

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Unable to save employee
            </p>

            <p className="mt-1">
              {message}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          SUCCESS MESSAGE
      =================================================== */}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Employee saved
            </p>

            <p className="mt-1">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================
          BASIC INFORMATION
      =================================================== */}

      <FormSection
        icon={<UserRound size={19} />}
        title="Basic Information"
        description="Employee identity, login and contact information."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FormField
            label="Employee Code"
            name="employeeCode"
            defaultValue={
              employee?.employeeCode
            }
            placeholder="KT-EMP-001"
            required
            error={
              fieldErrors.employeeCode
            }
          />

          <FormField
            label="First Name"
            name="firstName"
            defaultValue={
              employee?.firstName
            }
            placeholder="First name"
            required
            error={
              fieldErrors.firstName
            }
          />

          <FormField
            label="Last Name"
            name="lastName"
            defaultValue={
              employee?.lastName
            }
            placeholder="Last name"
            required
            error={
              fieldErrors.lastName
            }
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            defaultValue={
              employee?.email
            }
            placeholder="employee@koniqtech.com"
            required
            error={
              fieldErrors.email
            }
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            defaultValue={
              employee?.phone
            }
            placeholder="+91..."
            error={
              fieldErrors.phone
            }
          />

          <FormField
            label={
              mode === "create"
                ? "Password"
                : "New Password"
            }
            name="password"
            type="password"
            placeholder={
              mode === "create"
                ? "Minimum 8 characters"
                : "Leave blank to keep current password"
            }
            required={
              mode === "create"
            }
            error={
              fieldErrors.password
            }
          />
        </div>
      </FormSection>

      {/* ===================================================
          EMPLOYMENT INFORMATION
      =================================================== */}

      <FormSection
        icon={
          <BriefcaseBusiness size={19} />
        }
        title="Employment Information"
        description="Department, platform access, employee role and reporting structure."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* DEPARTMENT */}

          <SelectField
            label="Department"
            name="departmentId"
            defaultValue={
              employee?.departmentId
            }
            required
            error={
              fieldErrors.departmentId
            }
          >
            <option value="">
              Select department
            </option>

            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              )
            )}
          </SelectField>

          {/* PLATFORM ACCESS ROLE */}

          <SelectField
            label="Platform Access Role"
            name="userRole"
            defaultValue={
              employee?.userRole ?? ""
            }
            required
            error={
              fieldErrors.userRole
            }
          >
            <option value="">
              Select platform access role
            </option>

            {INTERNAL_PLATFORM_ROLES.map(
              (role) => (
                <option
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
                </option>
              )
            )}
          </SelectField>

          {/* EMPLOYEE ROLE */}

          <SelectField
            label="Employee Role"
            name="roleId"
            defaultValue={
              employee?.roleId
            }
            required
            error={
              fieldErrors.roleId
            }
          >
            <option value="">
              Select role
            </option>

            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name}
              </option>
            ))}
          </SelectField>

          {/* REPORTING MANAGER */}

          <SelectField
            label="Reporting Manager"
            name="managerId"
            defaultValue={
              employee?.managerId ?? ""
            }
            error={
              fieldErrors.managerId
            }
          >
            <option value="">
              No reporting manager
            </option>

            {managers
              .filter(
                (manager) =>
                  manager.id !== employee?.id
              )
              .map((manager) => (
                <option
                  key={manager.id}
                  value={manager.id}
                >
                  {manager.firstName}{" "}
                  {manager.lastName} (
                  {manager.employeeCode})
                </option>
              ))}
          </SelectField>

          {/* DESIGNATION */}

          <FormField
            label="Designation"
            name="designation"
            defaultValue={
              employee?.designation
            }
            placeholder="e.g. Sales Manager"
            error={
              fieldErrors.designation
            }
          />

          {/* EMPLOYMENT TYPE */}

          <SelectField
            label="Employment Type"
            name="employmentType"
            defaultValue={
              employee?.employmentType ??
              ""
            }
            error={
              fieldErrors.employmentType
            }
          >
            <option value="">
              Select employment type
            </option>

            <option value="full_time">
              Full Time
            </option>

            <option value="part_time">
              Part Time
            </option>

            <option value="contract">
              Contract
            </option>

            <option value="intern">
              Intern
            </option>
          </SelectField>

          {/* JOINING DATE */}

          <FormField
            label="Joining Date"
            name="joiningDate"
            type="date"
            defaultValue={
              employee?.joiningDate
            }
            error={
              fieldErrors.joiningDate
            }
          />
        </div>
      </FormSection>

      {/* ===================================================
          PERSONAL INFORMATION
      =================================================== */}

      <FormSection
        icon={<ShieldCheck size={19} />}
        title="Personal Information"
        description="Optional employee personal information."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            defaultValue={
              employee?.dateOfBirth
            }
            error={
              fieldErrors.dateOfBirth
            }
          />

          <SelectField
            label="Gender"
            name="gender"
            defaultValue={
              employee?.gender ?? ""
            }
            error={
              fieldErrors.gender
            }
          >
            <option value="">
              Select gender
            </option>

            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>

            <option value="other">
              Other
            </option>

            <option value="prefer_not_to_say">
              Prefer not to say
            </option>
          </SelectField>

          <FormField
            label="Country"
            name="country"
            defaultValue={
              employee?.country
            }
            placeholder="Country"
            error={
              fieldErrors.country
            }
          />

          <FormField
            label="State"
            name="state"
            defaultValue={
              employee?.state
            }
            placeholder="State"
            error={
              fieldErrors.state
            }
          />

          <FormField
            label="City"
            name="city"
            defaultValue={
              employee?.city
            }
            placeholder="City"
            error={
              fieldErrors.city
            }
          />

          <FormField
            label="Postal Code"
            name="postalCode"
            defaultValue={
              employee?.postalCode
            }
            placeholder="Postal code"
            error={
              fieldErrors.postalCode
            }
          />

          <div className="md:col-span-2 xl:col-span-3">
            <label
              htmlFor="employee-address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <textarea
              id="employee-address"
              name="address"
              rows={3}
              defaultValue={
                employee?.address ?? ""
              }
              placeholder="Employee address"
              className={`w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                fieldErrors.address
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {fieldErrors.address && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                <AlertCircle size={13} />

                {fieldErrors.address}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* ===================================================
          EMERGENCY CONTACT
      =================================================== */}

      <FormSection
        icon={<AlertCircle size={19} />}
        title="Emergency Contact"
        description="Emergency contact information for the employee."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Contact Name"
            name="emergencyContactName"
            defaultValue={
              employee?.emergencyContactName
            }
            placeholder="Emergency contact name"
            error={
              fieldErrors.emergencyContactName
            }
          />

          <FormField
            label="Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            defaultValue={
              employee?.emergencyContactPhone
            }
            placeholder="Emergency phone number"
            error={
              fieldErrors.emergencyContactPhone
            }
          />
        </div>
      </FormSection>

      {/* ===================================================
          ACTION BAR
      =================================================== */}

      <div className="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/admin/employees"
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
              <Loader2
                size={17}
                className="animate-spin"
              />

              Saving...
            </>
          ) : (
            <>
              <Save size={17} />

              {mode === "create"
                ? "Create Employee"
                : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  icon,
  title,
  description,
  children
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>

          <div>
            <h2 className="font-semibold text-slate-950">
              {title}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {children}
      </div>
    </section>
  )
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
  error
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
  error?: string
}) {
  const fieldId = `employee-${name}`

  return (
    <div>
      <label
        htmlFor={fieldId}
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
        id={fieldId}
        name={name}
        type={type}
        defaultValue={
          defaultValue ?? ""
        }
        placeholder={placeholder}
        required={required}
        aria-invalid={
          error ? true : undefined
        }
        aria-describedby={
          error
            ? `${fieldId}-error`
            : undefined
        }
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p
          id={`${fieldId}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} />

          {error}
        </p>
      )}
    </div>
  )
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  name,
  defaultValue,
  required = false,
  error,
  children
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  error?: string
  children: ReactNode
}) {
  const fieldId = `employee-${name}`

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        id={fieldId}
        name={name}
        defaultValue={
          defaultValue ?? ""
        }
        required={required}
        aria-invalid={
          error ? true : undefined
        }
        aria-describedby={
          error
            ? `${fieldId}-error`
            : undefined
        }
        className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      >
        {children}
      </select>

      {error && (
        <p
          id={`${fieldId}-error`}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"
        >
          <AlertCircle size={13} />

          {error}
        </p>
      )}
    </div>
  )
}