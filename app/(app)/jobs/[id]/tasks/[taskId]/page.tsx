import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
    taskId: string
  }>
}

export default async function TaskDetailsPage({
  params,
}: PageProps) {

  const { id, taskId } = await params

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = (session.user as any).orgId

  const job = await prisma.job.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      customer: true,
    },
  })

  if (!job) {
    notFound()
  }

  const task = await prisma.jobTask.findFirst({
    where: {
      id: taskId,
      jobId: job.id,
    },
  })

  if (!task) {
    notFound()
  }

  const dependency = task.dependsOnId
    ? await prisma.jobTask.findUnique({
        where: {
          id: task.dependsOnId,
        },
      })
    : null

  const blockedTasks =
    await prisma.jobTask.findMany({
      where: {
        dependsOnId: task.id,
      },
      orderBy: {
        title: "asc",
      },
    })

  const badgeColor =
    task.status === "completed"
      ? "bg-emerald-100 text-emerald-700"
      : task.status === "in_progress"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700"

  return (

    <div className="max-w-6xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-semibold">
            Task Details
          </h1>

          <p className="mt-2 text-slate-500">
            View task information for this job.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/tasks`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Back to Tasks
          </Link>

          <Link
            href={`/jobs/${job.id}/tasks/${task.id}/edit`}
            className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Edit Task
          </Link>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2 rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-semibold">
            {task.title}
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${badgeColor}`}
            >
              {task.status.replace("_", " ")}
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              Job: {job.title}
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm">
              Customer: {job.customer.firstName} {job.customer.lastName ?? ""}
            </span>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

                        <div className="rounded-2xl border p-6">

              <h3 className="text-lg font-semibold">
                Task Information
              </h3>

              <dl className="mt-6 space-y-5">

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Title
                  </dt>

                  <dd className="font-medium text-right">
                    {task.title}
                  </dd>

                </div>

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Status
                  </dt>

                  <dd>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${badgeColor}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>

                  </dd>

                </div>

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Job
                  </dt>

                  <dd className="font-medium text-right">
                    {job.title}
                  </dd>

                </div>

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Customer
                  </dt>

                  <dd className="font-medium text-right">
                    {job.customer.firstName}{" "}
                    {job.customer.lastName ?? ""}
                  </dd>

                </div>

                <div className="flex justify-between">

                  <dt className="text-slate-500">
                    Created
                  </dt>

                  <dd>
                    {new Date(
                      task.createdAt
                    ).toLocaleString()}
                  </dd>

                </div>

              </dl>

            </div>

            <div className="rounded-2xl border p-6">

              <h3 className="text-lg font-semibold">
                Dependency
              </h3>

              {dependency ? (

                <div className="mt-6 rounded-xl border bg-slate-50 p-5">

                  <div className="text-sm text-slate-500">
                    Depends On
                  </div>

                  <div className="mt-2 text-lg font-semibold">
                    {dependency.title}
                  </div>

                  <div className="mt-3">

                    <Link
                      href={`/jobs/${job.id}/tasks/${dependency.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Dependency
                    </Link>

                  </div>

                </div>

              ) : (

                <div className="mt-6 rounded-xl bg-green-50 p-5">

                  <p className="text-green-700">
                    This task has no dependency.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h3 className="text-lg font-semibold">
              Tasks Waiting On This
            </h3>

            <div className="mt-5 space-y-3">

              {blockedTasks.length === 0 && (

                <p className="text-slate-500">
                  No dependent tasks.
                </p>

              )}

              {blockedTasks.map(blocked => (

                <Link
                  key={blocked.id}
                  href={`/jobs/${job.id}/tasks/${blocked.id}`}
                  className="
                  block
                  rounded-xl
                  border
                  p-4
                  hover:bg-slate-50
                  "
                >

                  <div className="font-medium">
                    {blocked.title}
                  </div>

                  <div className="mt-2">

                    <span
                      className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      ${
                        blocked.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : blocked.status === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }
                      `}
                    >
                      {blocked.status.replace("_", " ")}
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <h3 className="text-lg font-semibold">
              Quick Actions
            </h3>

            <div className="mt-5 grid gap-3">

              <Link
                href={`/jobs/${job.id}/tasks/${task.id}/edit`}
                className="
                rounded-xl
                bg-blue-600
                py-3
                text-center
                text-white
                hover:bg-blue-700
                "
              >
                Edit Task
              </Link>

              <Link
                href={`/jobs/${job.id}/tasks/${task.id}/delete`}
                className="
                rounded-xl
                bg-red-600
                py-3
                text-center
                text-white
                hover:bg-red-700
                "
              >
                Delete Task
              </Link>

              <Link
                href={`/jobs/${job.id}/tasks`}
                className="
                rounded-xl
                border
                py-3
                text-center
                hover:bg-slate-50
                "
              >
                Back to Task List
              </Link>

            </div>

          </div>
                    <div className="rounded-3xl border bg-white p-6">

            <h3 className="text-lg font-semibold">
              Task Summary
            </h3>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Dependency
                </span>

                <span className="font-medium">

                  {dependency
                    ? "Yes"
                    : "None"}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Blocking Tasks
                </span>

                <span className="font-medium">

                  {blockedTasks.length}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Current Status
                </span>

                <span
                  className={`
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  font-medium
                  ${badgeColor}
                  `}
                >
                  {task.status
                    .replace("_", " ")
                    .replace(
                      /\b\w/g,
                      c => c.toUpperCase()
                    )}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Created
                </span>

                <span>

                  {new Date(
                    task.createdAt
                  ).toLocaleDateString()}

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}