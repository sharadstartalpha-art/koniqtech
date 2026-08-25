import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import { notFound, redirect } from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobTasksPage({
  params,
}: PageProps) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const { id } = await params

  const job =
    await prisma.job.findFirst({

      where: {
        id,
        orgId,
      },

      include: {

        customer: {
          select: {
            firstName: true,
            lastName: true,
            companyName: true,
          },
        },

        tasks: {

          orderBy: {
            createdAt: "asc",
          },

        },

      },

    })

  if (!job) {
    notFound()
  }

  const totalTasks =
    job.tasks.length

  const completedTasks =
    job.tasks.filter(
      task =>
        task.status === "completed"
    ).length

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        )

  return (

    <div className="space-y-8">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-2 text-4xl font-bold">
            Job Tasks
          </h1>

          <p className="mt-2 text-slate-500">

            {job.customer.companyName ??

              `${job.customer.firstName} ${job.customer.lastName ?? ""}`}

          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/tasks/create`}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
            hover:bg-blue-700
          "
        >
          + New Task
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Tasks
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalTasks}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {completedTasks}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Remaining
          </p>

          <h2 className="mt-2 text-3xl font-bold text-amber-600">
            {totalTasks - completedTasks}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {progress}%
          </h2>

          <div className="mt-4 h-3 rounded-full bg-slate-200">

            <div
              className="h-3 rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

            <div className="rounded-3xl border bg-white overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">
                Task
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Depends On
              </th>

              <th className="text-left">
                Created
              </th>

              <th className="text-right pr-6">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {job.tasks.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                  py-16
                  text-center
                  text-slate-500
                  "
                >

                  <div className="space-y-4">

                    <p className="text-lg font-medium">
                      No tasks have been created.
                    </p>

                    <Link
                      href={`/jobs/${job.id}/tasks/create`}
                      className="
                      inline-flex
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-3
                      text-white
                      hover:bg-blue-700
                      "
                    >
                      Create First Task
                    </Link>

                  </div>

                </td>

              </tr>

            )}

            {job.tasks.map(task => {

              const dependency =
                task.dependsOnId
                  ? job.tasks.find(
                      t =>
                        t.id ===
                        task.dependsOnId
                    )
                  : null

              const badgeClass =
                task.status === "completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : task.status === "in_progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"

              return (

                <tr
                  key={task.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4">

                    <div className="font-medium">

                      {task.title}

                    </div>

                  </td>

                  <td>

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        font-medium
                        ${badgeClass}
                      `}
                    >

                      {task.status
                        .replace("_", " ")
                        .replace(
                          /\b\w/g,
                          c => c.toUpperCase()
                        )}

                    </span>

                  </td>

                  <td>

                    {dependency ? (

                      <span className="text-slate-700">

                        {dependency.title}

                      </span>

                    ) : (

                      <span className="text-slate-400">

                        —

                      </span>

                    )}

                  </td>

                  <td>

                    {new Date(
                      task.createdAt
                    ).toLocaleDateString()}

                  </td>

                  <td className="pr-6">

                    <div className="flex justify-end gap-2">

                      <Link
                        href={`/jobs/${job.id}/tasks/${task.id}`}
                        className="
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        hover:bg-slate-100
                        "
                      >
                        View
                      </Link>

                      <Link
                        href={`/jobs/${job.id}/tasks/${task.id}/edit`}
                        className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-sm
                        text-white
                        hover:bg-blue-700
                        "
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/jobs/${job.id}/tasks/${task.id}/delete`}
                        className="
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        text-white
                        hover:bg-red-700
                        "
                      >
                        Delete
                      </Link>

                    </div>

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

            <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Job Summary
          </h2>

          <dl className="mt-6 space-y-4">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Job
              </dt>

              <dd className="font-medium">
                {job.title}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Status
              </dt>

              <dd className="font-medium capitalize">

                {job.status.replace("_", " ")}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Scheduled
              </dt>

              <dd>

                {job.scheduledDate
                  ? new Date(
                      job.scheduledDate
                    ).toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Completed
              </dt>

              <dd>

                {job.completedDate
                  ? new Date(
                      job.completedDate
                    ).toLocaleDateString()
                  : "-"}

              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Task Status
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span>
                Todo
              </span>

              <span className="font-semibold">

                {
                  job.tasks.filter(
                    t =>
                      t.status === "todo"
                  ).length
                }

              </span>

            </div>

            <div className="flex justify-between">

              <span>
                In Progress
              </span>

              <span className="font-semibold">

                {
                  job.tasks.filter(
                    t =>
                      t.status ===
                      "in_progress"
                  ).length
                }

              </span>

            </div>

            <div className="flex justify-between">

              <span>
                Completed
              </span>

              <span className="font-semibold text-emerald-600">

                {completedTasks}

              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-3">

            <Link
              href={`/jobs/${job.id}`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Job Overview
            </Link>

            <Link
              href={`/jobs/${job.id}/edit`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Edit Job
            </Link>

            <Link
              href={`/jobs/${job.id}/materials`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Materials
            </Link>

            <Link
              href={`/jobs/${job.id}/crew`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Crew
            </Link>

            <Link
              href={`/jobs/${job.id}/milestones`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Milestones
            </Link>

          </div>

        </div>

      </div>

   

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Job Summary
          </h2>

          <dl className="mt-6 space-y-4">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Job
              </dt>

              <dd className="font-medium">
                {job.title}
              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Status
              </dt>

              <dd className="font-medium capitalize">

                {job.status.replace("_", " ")}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Scheduled
              </dt>

              <dd>

                {job.scheduledDate
                  ? new Date(
                      job.scheduledDate
                    ).toLocaleDateString()
                  : "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Completed
              </dt>

              <dd>

                {job.completedDate
                  ? new Date(
                      job.completedDate
                    ).toLocaleDateString()
                  : "-"}

              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Task Status
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span>
                Todo
              </span>

              <span className="font-semibold">

                {
                  job.tasks.filter(
                    t =>
                      t.status === "todo"
                  ).length
                }

              </span>

            </div>

            <div className="flex justify-between">

              <span>
                In Progress
              </span>

              <span className="font-semibold">

                {
                  job.tasks.filter(
                    t =>
                      t.status ===
                      "in_progress"
                  ).length
                }

              </span>

            </div>

            <div className="flex justify-between">

              <span>
                Completed
              </span>

              <span className="font-semibold text-emerald-600">

                {completedTasks}

              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-3">

            <Link
              href={`/jobs/${job.id}`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Job Overview
            </Link>

            <Link
              href={`/jobs/${job.id}/edit`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Edit Job
            </Link>

            <Link
              href={`/jobs/${job.id}/materials`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Materials
            </Link>

            <Link
              href={`/jobs/${job.id}/crew`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Crew
            </Link>

            <Link
              href={`/jobs/${job.id}/milestones`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Milestones
            </Link>

          </div>

        </div>

      </div>

    </div>

  )

}