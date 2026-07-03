import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  Activity,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
  WalletCards
} from "lucide-react"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

function formatDate(
  value: Date | null | undefined
) {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value)
}

function formatDateTime(
  value: Date | null | undefined
) {
  if (!value) {
    return "Never"
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value)
}

export default async function EmployeeProfilePage({
  params
}: PageProps) {
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

  const { id } = await params

  const employee =
    await prisma.employee.findUnique({
      where: {
        id
      },

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
            employeeCode: true,
            firstName: true,
            lastName: true,
            designation: true
          }
        },

        subordinates: {
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
            employeeCode: true,
            firstName: true,
            lastName: true,
            designation: true,
            email: true
          }
        },

        _count: {
          select: {
            tasks: true,
            attendances: true,
            leaves: true,
            documents: true,
            activities: true,
            subordinates: true
          }
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const isSuperAdmin =
    currentRole === "super_admin"

  const canEdit =
    currentRole === "super_admin" ||
    currentRole === "manager"

  const fullName =
    `${employee.firstName} ${employee.lastName}`

  const initials =
    `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
      .toUpperCase()

  const location = [
    employee.city,
    employee.state,
    employee.country
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="space-y-6">
      {/* BACK + HEADER */}

      <div>
        <Link
          href="/admin/employees"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employees
        </Link>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  {fullName}
                </h1>

                <span
                  className={
                    employee.active
                      ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                      : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"
                  }
                >
                  {employee.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {employee.designation ||
                  employee.role.name}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span>
                  {employee.employeeCode}
                </span>

                <span>
                  {employee.department.name}
                </span>

                <span>
                  {employee.role.name}
                </span>
              </div>
            </div>
          </div>

          {canEdit && (
            <Link
              href={`/admin/employees/${employee.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <Edit3 size={17} />
              Edit Employee
            </Link>
          )}
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <ProfileStat
          label="Tasks"
          value={employee._count.tasks}
          icon={<CheckCircle2 size={19} />}
          href={`/admin/employees/${employee.id}/tasks`}
        />

        <ProfileStat
          label="Attendance"
          value={employee._count.attendances}
          icon={<Clock3 size={19} />}
          href={`/admin/employees/${employee.id}/attendance`}
        />

        <ProfileStat
          label="Leave"
          value={employee._count.leaves}
          icon={<CalendarDays size={19} />}
          href={`/admin/employees/${employee.id}/leave`}
        />

        <ProfileStat
          label="Documents"
          value={employee._count.documents}
          icon={<FileText size={19} />}
          href={`/admin/employees/${employee.id}/documents`}
        />

        <ProfileStat
          label="Activities"
          value={employee._count.activities}
          icon={<Activity size={19} />}
          href={`/admin/employees/${employee.id}/activity`}
        />

        <ProfileStat
          label="Reports"
          value={employee._count.subordinates}
          icon={<UsersRound size={19} />}
        />
      </div>

      {/* MAIN CONTENT */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* EMPLOYMENT DETAILS */}

          <SectionCard
            title="Employment Details"
            description="Internal employment and reporting information."
            icon={
              <BriefcaseBusiness size={19} />
            }
          >
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <InfoItem
                label="Employee Code"
                value={employee.employeeCode}
              />

              <InfoItem
                label="Designation"
                value={
                  employee.designation || "—"
                }
              />

              <InfoItem
                label="Department"
                value={employee.department.name}
              />

              <InfoItem
                label="Role"
                value={employee.role.name}
              />

              <InfoItem
                label="Employment Type"
                value={
                  employee.employmentType
                    ? employee.employmentType
                        .replaceAll("_", " ")
                    : "—"
                }
                capitalize
              />

              <InfoItem
                label="Joining Date"
                value={formatDate(
                  employee.joiningDate
                )}
              />

              <InfoItem
                label="Reporting Manager"
                value={
                  employee.manager
                    ? `${employee.manager.firstName} ${employee.manager.lastName}`
                    : "No reporting manager"
                }
              />

              <InfoItem
                label="Account Status"
                value={
                  employee.active
                    ? "Active"
                    : "Inactive"
                }
              />
            </div>
          </SectionCard>

          {/* PERSONAL DETAILS */}

          <SectionCard
            title="Personal Information"
            description="Contact and personal information for this employee."
            icon={<UserRound size={19} />}
          >
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <InfoItem
                label="Email Address"
                value={employee.email}
                icon={<Mail size={16} />}
              />

              <InfoItem
                label="Phone Number"
                value={employee.phone || "—"}
                icon={<Phone size={16} />}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(
                  employee.dateOfBirth
                )}
              />

              <InfoItem
                label="Gender"
                value={
                  employee.gender
                    ? employee.gender.replaceAll(
                        "_",
                        " "
                      )
                    : "—"
                }
                capitalize
              />

              <InfoItem
                label="Location"
                value={location || "—"}
                icon={<MapPin size={16} />}
              />

              <InfoItem
                label="Postal Code"
                value={
                  employee.postalCode || "—"
                }
              />

              <div className="sm:col-span-2">
                <InfoItem
                  label="Address"
                  value={employee.address || "—"}
                />
              </div>
            </div>
          </SectionCard>

          {/* DIRECT REPORTS */}

          <SectionCard
            title="Direct Reports"
            description="Active employees reporting directly to this employee."
            icon={<UsersRound size={19} />}
          >
            {employee.subordinates.length ===
            0 ? (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 text-center">
                <UsersRound
                  size={24}
                  className="text-slate-400"
                />

                <p className="mt-3 font-medium text-slate-700">
                  No direct reports
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  No active employees currently
                  report to this employee.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {employee.subordinates.map(
                  (subordinate) => (
                    <Link
                      key={subordinate.id}
                      href={`/admin/employees/${subordinate.id}`}
                      className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:text-blue-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                          {subordinate.firstName
                            .charAt(0)
                            .toUpperCase()}

                          {subordinate.lastName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {
                              subordinate.firstName
                            }{" "}
                            {
                              subordinate.lastName
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {subordinate.designation ||
                              subordinate.employeeCode}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm text-slate-500">
                        {
                          subordinate.employeeCode
                        }
                      </span>
                    </Link>
                  )
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">
          {/* QUICK ACTIONS */}

          <SectionCard
            title="Employee Modules"
            description="Open employee operational records."
            icon={<ShieldCheck size={19} />}
          >
            <div className="space-y-2">
              <ModuleLink
                href={`/admin/employees/${employee.id}/attendance`}
                label="Attendance"
                icon={<Clock3 size={17} />}
              />

              <ModuleLink
                href={`/admin/employees/${employee.id}/leave`}
                label="Leave Records"
                icon={
                  <CalendarDays size={17} />
                }
              />

              <ModuleLink
                href={`/admin/employees/${employee.id}/tasks`}
                label="Assigned Tasks"
                icon={
                  <CheckCircle2 size={17} />
                }
              />

              {(isSuperAdmin ||
                currentRole === "accountant") && (
                <ModuleLink
                  href={`/admin/employees/${employee.id}/payroll`}
                  label="Payroll"
                  icon={
                    <WalletCards size={17} />
                  }
                />
              )}

              <ModuleLink
                href={`/admin/employees/${employee.id}/documents`}
                label="Documents"
                icon={<FileText size={17} />}
              />

              <ModuleLink
                href={`/admin/employees/${employee.id}/activity`}
                label="Activity"
                icon={<Activity size={17} />}
              />
            </div>
          </SectionCard>

          {/* MANAGER */}

          <SectionCard
            title="Reporting Manager"
            description="Current reporting structure."
            icon={<UsersRound size={19} />}
          >
            {employee.manager ? (
              <Link
                href={`/admin/employees/${employee.manager.id}`}
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 font-semibold text-orange-700">
                    {employee.manager.firstName
                      .charAt(0)
                      .toUpperCase()}

                    {employee.manager.lastName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {
                        employee.manager
                          .firstName
                      }{" "}
                      {
                        employee.manager
                          .lastName
                      }
                    </p>

                    <p className="truncate text-sm text-slate-500">
                      {employee.manager
                        .designation ||
                        employee.manager
                          .employeeCode}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No reporting manager assigned.
              </div>
            )}
          </SectionCard>

          {/* EMERGENCY CONTACT */}

          <SectionCard
            title="Emergency Contact"
            description="Emergency contact information."
            icon={<Phone size={19} />}
          >
            <div className="space-y-4">
              <InfoItem
                label="Contact Name"
                value={
                  employee.emergencyContactName ||
                  "—"
                }
              />

              <InfoItem
                label="Contact Phone"
                value={
                  employee.emergencyContactPhone ||
                  "—"
                }
              />
            </div>
          </SectionCard>

          {/* ACCOUNT INFORMATION */}

          <SectionCard
            title="Account Information"
            description="Internal account metadata."
            icon={<ShieldCheck size={19} />}
          >
            <div className="space-y-4">
              <InfoItem
                label="Created"
                value={formatDateTime(
                  employee.createdAt
                )}
              />

              <InfoItem
                label="Last Updated"
                value={formatDateTime(
                  employee.updatedAt
                )}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

/* =========================================
   COMPONENTS
========================================= */

function ProfileStat({
  label,
  value,
  icon,
  href
}: {
  label: string
  value: number
  icon: React.ReactNode
  href?: string
}) {
  const content = (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )

  if (!href) {
    return content
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}

function SectionCard({
  title,
  description,
  icon,
  children
}: {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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

function InfoItem({
  label,
  value,
  icon,
  capitalize = false
}: {
  label: string
  value: string
  icon?: React.ReactNode
  capitalize?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div
        className={`mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-900 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <span>{value}</span>
      </div>
    </div>
  )
}

function ModuleLink({
  href,
  label,
  icon
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
    >
      <span className="flex items-center gap-3">
        <span className="text-slate-400">
          {icon}
        </span>

        {label}
      </span>

      <span className="text-slate-300">
        →
      </span>
    </Link>
  )
}