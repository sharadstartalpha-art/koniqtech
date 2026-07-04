"use client"

import Link from "next/link"

import {
  useState,
  useTransition
} from "react"

import {
  AlertCircle,
  BriefcaseBusiness,
  Loader2,
  Save,
  ShieldCheck,
  UserRound
} from "lucide-react"

import type {
  EmployeeActionState,
} from "../actions"


import {
  useRouter
} from "next/navigation"

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

const [fieldErrors, setFieldErrors] =
  useState<Record<string, string>>({})

  function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()

  const form =
    event.currentTarget

  const formData =
    new FormData(form)

  setMessage(null)
  setFieldErrors({})

  startTransition(async () => {
    const result =
      await action(formData)

    if (!result.success) {
      setMessage(result.message)

      setFieldErrors(
        result.errors ?? {}
      )

      return
    }

    router.push(
      "/admin/employees"
    )

    router.refresh()
  })
}

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {message && (
  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    <AlertCircle
      size={18}
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

      {/* BASIC INFORMATION */}

      <FormSection
        icon={<UserRound size={19} />}
        title="Basic Information"
        description="Employee identity and contact information."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <FormField
            label="Employee Code"
            name="employeeCode"
            defaultValue={employee?.employeeCode}
            placeholder="KT-EMP-001"
            required
          />

          <FormField
            label="First Name"
            name="firstName"
            defaultValue={employee?.firstName}
            placeholder="First name"
            required
          />

          <FormField
            label="Last Name"
            name="lastName"
            defaultValue={employee?.lastName}
            placeholder="Last name"
            required
          />

          <FormField
            label="Email Address"
            name="email"
            type="email"
            defaultValue={employee?.email}
            placeholder="employee@koniqtech.com"
            required
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            defaultValue={employee?.phone}
            placeholder="+91..."
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
            required={mode === "create"}
          />
        </div>
      </FormSection>

      {/* EMPLOYMENT INFORMATION */}

      <FormSection
        icon={<BriefcaseBusiness size={19} />}
        title="Employment Information"
        description="Department, role and reporting structure."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            label="Department"
            name="departmentId"
            defaultValue={employee?.departmentId}
            required
          >
            <option value="">
              Select department
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </SelectField>
          
          <SelectField
  label="Platform Access Role"
  name="userRole"
  defaultValue={
    employee?.userRole ?? ""
  }
  required
>
  <option value="">
    Select platform access role
  </option>

  <option value="super_admin">
    Super Admin
  </option>

  <option value="platform_manager">
    Platform Manager
  </option>

  <option value="platform_sales">
    Sales
  </option>

  <option value="marketing">
    Marketing
  </option>

  <option value="finance">
    Accountant / Finance
  </option>

  <option value="support">
    Support
  </option>

  <option value="data_entry">
    Data Entry
  </option>

  <option value="developer">
    Developer
  </option>

  <option value="qa">
    QA
  </option>

  <option value="customer_success">
    Customer Success
  </option>
</SelectField>


          <SelectField
            label="Employee Role"
            name="roleId"
            defaultValue={employee?.roleId}
            required
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

          <SelectField
            label="Reporting Manager"
            name="managerId"
            defaultValue={
              employee?.managerId ?? ""
            }
          >
            <option value="">
              No reporting manager
            </option>

            {managers.map((manager) => (
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

          <FormField
            label="Designation"
            name="designation"
            defaultValue={employee?.designation}
            placeholder="e.g. Sales Manager"
          />

          <SelectField
            label="Employment Type"
            name="employmentType"
            defaultValue={
              employee?.employmentType ?? ""
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

          <FormField
            label="Joining Date"
            name="joiningDate"
            type="date"
            defaultValue={employee?.joiningDate}
          />
        </div>
      </FormSection>

      {/* PERSONAL INFORMATION */}

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
            defaultValue={employee?.dateOfBirth}
          />

          <SelectField
            label="Gender"
            name="gender"
            defaultValue={
              employee?.gender ?? ""
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
            defaultValue={employee?.country}
            placeholder="Country"
          />

          <FormField
            label="State"
            name="state"
            defaultValue={employee?.state}
            placeholder="State"
          />

          <FormField
            label="City"
            name="city"
            defaultValue={employee?.city}
            placeholder="City"
          />

          <FormField
            label="Postal Code"
            name="postalCode"
            defaultValue={employee?.postalCode}
            placeholder="Postal code"
          />

          <div className="md:col-span-2 xl:col-span-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              name="address"
              rows={3}
              defaultValue={
                employee?.address ?? ""
              }
              placeholder="Employee address"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </FormSection>

      {/* EMERGENCY CONTACT */}

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
          />

          <FormField
            label="Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            defaultValue={
              employee?.emergencyContactPhone
            }
            placeholder="Emergency phone number"
          />
        </div>
      </FormSection>

      {/* ACTION BAR */}

      <div className="flex flex-col-reverse gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/admin/employees"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

function FormSection({
  icon,
  title,
  description,
  children
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
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

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | null
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  required = false,
  children
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </div>
  )
}