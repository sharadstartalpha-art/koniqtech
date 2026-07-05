"use client"

import Link from "next/link"

import {
  FormEvent,
  useMemo,
  useState,
  useTransition
} from "react"

import { useRouter } from "next/navigation"

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Save,
  Search,
  UserRound,
  Users,
  X
} from "lucide-react"

import type {
  TeamActionState
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

export type TeamDepartmentOption = {
  id: string
  name: string
  color: string | null
}

export type TeamEmployeeOption = {
  userId: string
  employeeId: string
  employeeCode: string
  name: string
  email: string
  designation: string | null
  departmentId: string | null
}

export type TeamFormValues = {
  id: string

  name: string

  description: string | null

  departmentId: string | null

  leaderId: string | null

  memberIds: string[]

  active: boolean
}

type TeamFormProps = {
  mode: "create" | "edit"

  team?: TeamFormValues

  departments: TeamDepartmentOption[]

  employees: TeamEmployeeOption[]

  action: (
    formData: FormData
  ) => Promise<TeamActionState>
}

const INITIAL_STATE: TeamActionState = {
  success: false,
  message: ""
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TeamForm({
  mode,
  team,
  departments,
  employees,
  action
}: TeamFormProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition
  ] = useTransition()

  const [
    state,
    setState
  ] = useState<TeamActionState>(
    INITIAL_STATE
  )

  const [
    departmentId,
    setDepartmentId
  ] = useState(
    team?.departmentId ?? ""
  )

  const [
    leaderId,
    setLeaderId
  ] = useState(
    team?.leaderId ?? ""
  )

  const [
    selectedMemberIds,
    setSelectedMemberIds
  ] = useState<string[]>(
    team?.memberIds ?? []
  )

  const [
    memberSearch,
    setMemberSearch
  ] = useState("")

  const [
    showMemberSelector,
    setShowMemberSelector
  ] = useState(false)

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const selectedMembers =
    useMemo(() => {
      const selectedSet = new Set(
        selectedMemberIds
      )

      return employees.filter(
        (employee) =>
          selectedSet.has(
            employee.userId
          )
      )
    }, [
      employees,
      selectedMemberIds
    ])

  const filteredEmployees =
    useMemo(() => {
      const query =
        memberSearch
          .trim()
          .toLowerCase()

      return employees.filter(
        (employee) => {
          if (!query) {
            return true
          }

          return (
            employee.name
              .toLowerCase()
              .includes(query) ||

            employee.email
              .toLowerCase()
              .includes(query) ||

            employee.employeeCode
              .toLowerCase()
              .includes(query) ||

            employee.designation
              ?.toLowerCase()
              .includes(query)
          )
        }
      )
    }, [
      employees,
      memberSearch
    ])

  const leader =
    employees.find(
      (employee) =>
        employee.userId === leaderId
    )

  /* =======================================================
     MEMBER HANDLERS
  ======================================================= */

  function toggleMember(
    userId: string
  ) {
    setSelectedMemberIds(
      (current) => {
        if (
          current.includes(userId)
        ) {
          return current.filter(
            (id) => id !== userId
          )
        }

        return [
          ...current,
          userId
        ]
      }
    )
  }

  function removeMember(
    userId: string
  ) {
    setSelectedMemberIds(
      (current) =>
        current.filter(
          (id) => id !== userId
        )
    )
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const form =
      event.currentTarget

    const formData =
      new FormData(form)

    /*
     * Controlled member selection is manually added because
     * the visual member selector does not use normal checkbox
     * submission.
     */

    formData.delete("memberIds")

    selectedMemberIds.forEach(
      (memberId) => {
        formData.append(
          "memberIds",
          memberId
        )
      }
    )

    setState(INITIAL_STATE)

    startTransition(async () => {
      try {
        const result =
          await action(formData)

        setState(result)

        if (result.success) {
          const targetId =
            result.teamId ??
            team?.id

          if (targetId) {
            router.push(
              `/admin/teams/${targetId}`
            )
          } else {
            router.push(
              "/admin/teams"
            )
          }

          router.refresh()
        }
      } catch (error) {
        console.error(
          "TEAM_FORM_SUBMIT_ERROR:",
          error
        )

        setState({
          success: false,

          message:
            "Something went wrong while saving the team."
        })
      }
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="font-semibold text-slate-950">
          Team Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the team structure,
          department, leader and internal members.
        </p>
      </div>

      {/* ===================================================
          BODY
      =================================================== */}

      <div className="space-y-7 p-6">
        {/* =================================================
            GLOBAL MESSAGE
        ================================================= */}

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

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <section className="space-y-5">
          <SectionTitle
            title="Basic Information"
            description="General information about this team."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* TEAM NAME */}

            <div>
              <label
                htmlFor="team-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Team Name

                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="team-name"
                name="name"
                type="text"
                required
                maxLength={100}
                defaultValue={
                  team?.name ?? ""
                }
                placeholder="e.g. Enterprise Sales"
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                  state.errors?.name
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />

              <FieldError
                message={
                  state.errors?.name
                }
              />
            </div>

            {/* DEPARTMENT */}

            <div>
              <label
                htmlFor="team-department"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Department
              </label>

              <div className="relative">
                <select
                  id="team-department"
                  name="departmentId"
                  value={departmentId}
                  onChange={(event) => {
                    setDepartmentId(
                      event.target.value
                    )
                  }}
                  className={`h-11 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition ${
                    state.errors
                      ?.departmentId
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                >
                  <option value="">
                    No department
                  </option>

                  {departments.map(
                    (department) => (
                      <option
                        key={
                          department.id
                        }
                        value={
                          department.id
                        }
                      >
                        {department.name}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              <FieldError
                message={
                  state.errors
                    ?.departmentId
                }
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="team-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="team-description"
              name="description"
              rows={4}
              maxLength={1000}
              defaultValue={
                team?.description ?? ""
              }
              placeholder="Describe this team's responsibilities and objectives..."
              className={`w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                state.errors?.description
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            <FieldError
              message={
                state.errors?.description
              }
            />
          </div>
        </section>

        {/* =================================================
            TEAM LEADERSHIP
        ================================================= */}

        <section className="space-y-5 border-t border-slate-200 pt-7">
          <SectionTitle
            title="Team Leadership"
            description="Assign an internal employee as the team leader."
          />

          <div>
            <label
              htmlFor="team-leader"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Team Leader
            </label>

            <div className="relative">
              <select
                id="team-leader"
                name="leaderId"
                value={leaderId}
                onChange={(event) => {
                  const value =
                    event.target.value

                  setLeaderId(value)

                  /*
                   * Keep leader visually selected as a member.
                   * The server action also enforces this.
                   */

                  if (value) {
                    setSelectedMemberIds(
                      (current) =>
                        current.includes(
                          value
                        )
                          ? current
                          : [
                              ...current,
                              value
                            ]
                    )
                  }
                }}
                className={`h-11 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition ${
                  state.errors?.leaderId
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              >
                <option value="">
                  No team leader
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={
                        employee.userId
                      }
                      value={
                        employee.userId
                      }
                    >
                      {employee.name}
                      {" — "}
                      {employee.employeeCode}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <FieldError
              message={
                state.errors?.leaderId
              }
            />

            {leader && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <EmployeeAvatar
                  name={leader.name}
                  variant="orange"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-orange-900">
                    {leader.name}
                  </p>

                  <p className="truncate text-xs text-orange-700">
                    {leader.designation ||
                      "Team Leader"}
                    {" · "}
                    {leader.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            TEAM MEMBERS
        ================================================= */}

        <section className="space-y-5 border-t border-slate-200 pt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <SectionTitle
              title="Team Members"
              description="Select internal employees who belong to this team."
            />

            <button
              type="button"
              onClick={() => {
                setShowMemberSelector(
                  (current) => !current
                )
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Users className="h-4 w-4" />

              {showMemberSelector
                ? "Close Selector"
                : "Select Members"}
            </button>
          </div>

          <FieldError
            message={
              state.errors?.memberIds
            }
          />

          {/* MEMBER SELECTOR */}

          {showMemberSelector && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {/* SEARCH */}

              <div className="border-b border-slate-200 bg-slate-50/70 p-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={memberSearch}
                    onChange={(event) => {
                      setMemberSearch(
                        event.target.value
                      )
                    }}
                    placeholder="Search employees by name, email, code or designation..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* EMPLOYEE OPTIONS */}

              <div className="max-h-80 overflow-y-auto">
                {filteredEmployees.length ===
                0 ? (
                  <div className="px-4 py-10 text-center">
                    <UserRound className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm text-slate-500">
                      No matching internal employees found.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredEmployees.map(
                      (employee) => {
                        const selected =
                          selectedMemberIds.includes(
                            employee.userId
                          )

                        const isLeader =
                          employee.userId ===
                          leaderId

                        return (
                          <button
                            key={
                              employee.userId
                            }
                            type="button"
                            onClick={() => {
                              /*
                               * Leader remains a member while
                               * selected as team leader.
                               */

                              if (
                                isLeader &&
                                selected
                              ) {
                                return
                              }

                              toggleMember(
                                employee.userId
                              )
                            }}
                            className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition ${
                              selected
                                ? "bg-green-50/70"
                                : "bg-white hover:bg-blue-50/40"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <EmployeeAvatar
                                name={
                                  employee.name
                                }
                                variant={
                                  selected
                                    ? "green"
                                    : "blue"
                                }
                              />

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {
                                      employee.name
                                    }
                                  </p>

                                  {isLeader && (
                                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                                      Leader
                                    </span>
                                  )}
                                </div>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                  {
                                    employee.employeeCode
                                  }
                                  {" · "}
                                  {
                                    employee.designation ||
                                    "Employee"
                                  }
                                  {" · "}
                                  {
                                    employee.email
                                  }
                                </p>
                              </div>
                            </div>

                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                selected
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-slate-300 bg-white text-transparent"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </div>
                          </button>
                        )
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SELECTED MEMBERS */}

          <div className="rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Selected Members
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Employees assigned to this team
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {
                  selectedMembers.length
                }
              </span>
            </div>

            {selectedMembers.length ===
            0 ? (
              <div className="px-4 py-10 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No team members selected
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Use Select Members to add internal employees.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedMembers.map(
                  (employee) => {
                    const isLeader =
                      employee.userId ===
                      leaderId

                    return (
                      <div
                        key={
                          employee.userId
                        }
                        className="flex items-center justify-between gap-4 px-4 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <EmployeeAvatar
                            name={
                              employee.name
                            }
                            variant={
                              isLeader
                                ? "orange"
                                : "blue"
                            }
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {
                                  employee.name
                                }
                              </p>

                              {isLeader && (
                                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                                  Leader
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {
                                employee.employeeCode
                              }
                              {" · "}
                              {
                                employee.designation ||
                                "Employee"
                              }
                            </p>
                          </div>
                        </div>

                        {!isLeader && (
                          <button
                            type="button"
                            onClick={() => {
                              removeMember(
                                employee.userId
                              )
                            }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                            aria-label={`Remove ${employee.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            STATUS - EDIT MODE ONLY
        ================================================= */}

        {mode === "edit" && (
          <section className="border-t border-slate-200 pt-7">
            <SectionTitle
              title="Team Status"
              description="Control whether this team is active."
            />

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-start gap-3">
                <input
                  id="team-active"
                  name="active"
                  type="checkbox"
                  defaultChecked={
                    team?.active ?? true
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-green-600"
                />

                <div>
                  <label
                    htmlFor="team-active"
                    className="cursor-pointer text-sm font-semibold text-slate-800"
                  >
                    Active Team
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Active teams remain available
                    for internal assignments and
                    organizational operations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
        <Link
          href={
            mode === "edit" &&
            team?.id
              ? `/admin/teams/${team.id}`
              : "/admin/teams"
          }
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

              {mode === "create"
                ? "Creating..."
                : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              {mode === "create"
                ? "Create Team"
                : "Save Changes"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  title,
  description
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

/* =========================================================
   FIELD ERROR
========================================================= */

function FieldError({
  message
}: {
  message?: string
}) {
  if (!message) {
    return null
  }

  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />

      {message}
    </p>
  )
}

/* =========================================================
   EMPLOYEE AVATAR
========================================================= */

function EmployeeAvatar({
  name,
  variant
}: {
  name: string
  variant: "blue" | "green" | "orange"
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("")

  const styles = {
    blue:
      "bg-blue-50 text-blue-700",

    green:
      "bg-green-50 text-green-700",

    orange:
      "bg-orange-100 text-orange-700"
  }

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles[variant]}`}
    >
      {initials || "U"}
    </div>
  )
}