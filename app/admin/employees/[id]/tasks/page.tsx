import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Clock3,
  ListTodo,
  XCircle
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
  value: Date | null
) {
  if (!value) {
    return "No due date"
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value)
}

function isOverdue(
  dueDate: Date | null,
  status: string
) {
  if (
    !dueDate ||
    status === "completed" ||
    status === "cancelled"
  ) {
    return false
  }

  return dueDate.getTime() < Date.now()
}

export default async function EmployeeTasksPage({
  params
}: PageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const currentRole = String(
    session.user.role ?? ""
  ).toLowerCase()

  if (
    ![
      "super_admin",
      "manager"
    ].includes(currentRole)
  ) {
    redirect("/admin/dashboard")
  }

  const { id } = await params

  const employee =
    await prisma.employee.findUnique({
      where: {
        id
      },

      select: {
        id: true,
        employeeCode: true,
        firstName: true,
        lastName: true,
        designation: true,

        department: {
          select: {
            name: true
          }
        },

        role: {
          select: {
            name: true
          }
        },

        tasks: {
          orderBy: [
            {
              dueDate: "asc"
            },
            {
              createdAt: "desc"
            }
          ]
        }
      }
    })

  if (!employee) {
    notFound()
  }

  const totalTasks =
    employee.tasks.length

  const pendingTasks =
    employee.tasks.filter(
      (task) => task.status === "pending"
    ).length

  const inProgressTasks =
    employee.tasks.filter(
      (task) => task.status === "in_progress"
    ).length

  const completedTasks =
    employee.tasks.filter(
      (task) => task.status === "completed"
    ).length

  const overdueTasks =
    employee.tasks.filter((task) =>
      isOverdue(task.dueDate, task.status)
    ).length

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0

  const fullName =
    `${employee.firstName} ${employee.lastName}`

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <Link
          href={`/admin/employees/${employee.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Employee Profile
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ListTodo size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Employee Tasks
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Assigned work and task progress for{" "}
              <span className="font-medium text-slate-700">
                {fullName}
              </span>
              {" "}({employee.employeeCode})
            </p>

            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.department.name}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {employee.role.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <TaskStatCard
          label="Total Tasks"
          value={totalTasks}
          icon={<ListTodo size={19} />}
          variant="blue"
        />

        <TaskStatCard
          label="Pending"
          value={pendingTasks}
          icon={<CircleDashed size={19} />}
          variant="orange"
        />

        <TaskStatCard
          label="In Progress"
          value={inProgressTasks}
          icon={<Clock3 size={19} />}
          variant="blue"
        />

        <TaskStatCard
          label="Completed"
          value={completedTasks}
          icon={<CheckCircle2 size={19} />}
          variant="green"
        />

        <TaskStatCard
          label="Overdue"
          value={overdueTasks}
          icon={<AlertTriangle size={19} />}
          variant="red"
        />

        <TaskStatCard
          label="Completion"
          value={`${completionRate}%`}
          icon={<CheckCircle2 size={19} />}
          variant="green"
        />
      </div>

      {/* TASK TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">
            Assigned Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current and historical tasks assigned to
            this employee.
          </p>
        </div>

        {employee.tasks.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <ListTodo
              size={28}
              className="text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No assigned tasks
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This employee does not have any assigned
              tasks yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <TableHeading>
                    Task
                  </TableHeading>

                  <TableHeading>
                    Priority
                  </TableHeading>

                  <TableHeading>
                    Status
                  </TableHeading>

                  <TableHeading>
                    Due Date
                  </TableHeading>

                  <TableHeading>
                    Completed
                  </TableHeading>

                  <TableHeading>
                    Created
                  </TableHeading>
                </tr>
              </thead>

              <tbody>
                {employee.tasks.map((task) => {
                  const overdue = isOverdue(
                    task.dueDate,
                    task.status
                  )

                  return (
                    <tr
                      key={task.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                    >
                      <TableCell>
                        <div className="max-w-md">
                          <p className="font-medium text-slate-900">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <PriorityBadge
                          priority={task.priority}
                        />
                      </TableCell>

                      <TableCell>
                        <TaskStatusBadge
                          status={task.status}
                        />
                      </TableCell>

                      <TableCell>
                        <span
                          className={
                            overdue
                              ? "font-semibold text-red-600"
                              : ""
                          }
                        >
                          {formatDate(
                            task.dueDate
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          task.completedAt
                        )}
                      </TableCell>

                      <TableCell>
                        {formatDate(
                          task.createdAt
                        )}
                      </TableCell>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PriorityBadge({
  priority
}: {
  priority:
    | "low"
    | "medium"
    | "high"
    | "urgent"
}) {
  const styles = {
    low:
      "border-blue-200 bg-blue-50 text-blue-700",

    medium:
      "border-green-200 bg-green-50 text-green-700",

    high:
      "border-orange-200 bg-orange-50 text-orange-700",

    urgent:
      "border-red-200 bg-red-50 text-red-700"
  }

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[priority]}`}
    >
      {priority}
    </span>
  )
}

function TaskStatusBadge({
  status
}: {
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
}) {
  const styles = {
    pending:
      "border-orange-200 bg-orange-50 text-orange-700",

    in_progress:
      "border-blue-200 bg-blue-50 text-blue-700",

    completed:
      "border-green-200 bg-green-50 text-green-700",

    cancelled:
      "border-red-200 bg-red-50 text-red-700"
  }

  const labels = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled"
  }

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

function TaskStatCard({
  label,
  value,
  icon,
  variant
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  variant:
    | "blue"
    | "green"
    | "orange"
    | "red"
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600"
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function TableHeading({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  )
}

function TableCell({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <td className="px-5 py-4 text-sm text-slate-600">
      {children}
    </td>
  )
}