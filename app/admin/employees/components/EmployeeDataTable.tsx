"use client"

import Link from "next/link"

import {
  useMemo,
  useState,
  useTransition
} from "react"

import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  MoreHorizontal,
  Power,
  Search,
  Trash2,
  UserRound
} from "lucide-react"

import {
  deleteEmployeeAction,
  toggleEmployeeStatusAction
} from "../actions"

export type EmployeeTableRow = {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  designation: string | null
  active: boolean
  department: {
    id: string
    name: string
  }
  role: {
    id: string
    name: string
  }
  manager: {
    id: string
    firstName: string
    lastName: string
  } | null
  createdAt: string
}

type Props = {
  employees: EmployeeTableRow[]
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canChangeStatus: boolean
}

const PAGE_SIZE = 10

export default function EmployeeDataTable({
  employees,
  canEdit,
  canDelete,
  canChangeStatus
}: Props) {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("all")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] =
    useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  const departments = useMemo(() => {
    return Array.from(
      new Map(
        employees.map((employee) => [
          employee.department.id,
          employee.department
        ])
      ).values()
    )
  }, [employees])

  const roles = useMemo(() => {
    return Array.from(
      new Map(
        employees.map((employee) => [
          employee.role.id,
          employee.role
        ])
      ).values()
    )
  }, [employees])

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()

    return employees.filter((employee) => {
      const searchableText = [
        employee.employeeCode,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone ?? "",
        employee.designation ?? "",
        employee.department.name,
        employee.role.name
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      const matchesDepartment =
        department === "all" ||
        employee.department.id === department

      const matchesRole =
        role === "all" ||
        employee.role.id === role

      const matchesStatus =
        status === "all" ||
        (status === "active" && employee.active) ||
        (status === "inactive" && !employee.active)

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesRole &&
        matchesStatus
      )
    })
  }, [employees, search, department, role, status])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, totalPages)

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function resetPage() {
    setPage(1)
  }

  function handleToggleStatus(employeeId: string) {
    setOpenMenu(null)

    startTransition(async () => {
      try {
        await toggleEmployeeStatusAction(employeeId)
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Unable to update employee."
        )
      }
    })
  }

  function handleDelete(
    employeeId: string,
    employeeName: string
  ) {
    setOpenMenu(null)

    const confirmed = window.confirm(
      `Delete ${employeeName}? This action cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    startTransition(async () => {
      try {
        await deleteEmployeeAction(employeeId)
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Unable to delete employee."
        )
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                resetPage()
              }}
              placeholder="Search employees..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value)
              resetPage()
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="all">
              All departments
            </option>

            {departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value)
              resetPage()
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All roles</option>

            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              resetPage()
            }}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Employee
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Code
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Role
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Manager
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="w-16 px-5 py-3" />
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <UserRound
                        size={22}
                        className="text-slate-500"
                      />
                    </div>

                    <h3 className="font-semibold text-slate-900">
                      No employees found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing the search or filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((employee) => {
                const fullName =
                  `${employee.firstName} ${employee.lastName}`

                return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                          {employee.firstName
                            .charAt(0)
                            .toUpperCase()}
                          {employee.lastName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="font-medium text-slate-900">
                            {fullName}
                          </div>

                          <div className="text-sm text-slate-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {employee.employeeCode}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {employee.department.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {employee.role.name}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {employee.manager
                        ? `${employee.manager.firstName} ${employee.manager.lastName}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          employee.active
                            ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        }
                      >
                        {employee.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="relative px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === employee.id
                              ? null
                              : employee.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === employee.id && (
                        <div className="absolute right-5 top-12 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl">
                          {canEdit && (
                            <Link
                              href={`/admin/employees/${employee.id}/edit`}
                              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit3 size={16} />
                              Edit employee
                            </Link>
                          )}

                          {canChangeStatus && (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(
                                  employee.id
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Power size={16} />

                              {employee.active
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  employee.id,
                                  fullName
                                )
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete employee
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
        <p className="text-sm text-slate-500">
          Showing {paginatedEmployees.length} of{" "}
          {filteredEmployees.length} employees
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              setPage((value) => Math.max(1, value - 1))
            }
            className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-2 text-sm text-slate-600">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              setPage((value) =>
                Math.min(totalPages, value + 1)
              )
            }
            className="rounded-lg border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}