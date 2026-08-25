import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import {
  notFound,
  redirect,
} from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
    taskId: string
  }>
}

export default async function DeleteTaskPage({
  params,
}: PageProps) {

  const { id, taskId } =
    await params

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const job =
    await prisma.job.findFirst({

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

  const task =
    await prisma.jobTask.findFirst({

      where: {
        id: taskId,
        jobId: job.id,
      },

    })

  if (!task) {
    notFound()
  }

  async function deleteTask() {

    "use server"

    const session =
      await auth()

    if (!session?.user) {
      redirect("/login")
    }

    const orgId =
      (session.user as any).orgId

    const job =
      await prisma.job.findFirst({

        where: {
          id,
          orgId,
        },

      })

    if (!job) {
      notFound()
    }

    const task =
      await prisma.jobTask.findFirst({

        where: {
          id: taskId,
          jobId: job.id,
        },

      })

    if (!task) {
      notFound()
    }

    await prisma.jobTask.updateMany({

      where: {
        dependsOnId: task.id,
      },

      data: {
        dependsOnId: null,
      },

    })

    await prisma.jobTask.delete({

      where: {
        id: task.id,
      },

    })

    redirect(
      `/jobs/${job.id}/tasks`
    )

  }

  return (

    <div className="max-w-3xl mx-auto space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Delete Task
        </h1>

        <p className="mt-2 text-slate-500">
          Permanently remove this task from the job.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

            <span className="text-2xl">
              ⚠️
            </span>

          </div>

          <div>

            <h2 className="text-xl font-semibold text-red-900">
              Are you sure?
            </h2>

            <p className="mt-3 text-red-800">
              This action will permanently delete
              this task. It cannot be undone.
            </p>

          </div>

        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6">
                      <h3 className="text-lg font-semibold">
            Task Information
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Task
              </p>

              <p className="mt-1 font-semibold">
                {task.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Job
              </p>

              <p className="mt-1 font-semibold">
                {job.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Customer
              </p>

              <p className="mt-1 font-semibold">
                {job.customer.firstName}{" "}
                {job.customer.lastName ?? ""}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Status
              </p>

              <span
                className={`
                mt-1
                inline-flex
                rounded-full
                px-3
                py-1
                text-sm
                font-medium
                ${
                  task.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }
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

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-1">
                {new Date(
                  task.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border bg-amber-50 border-amber-200 p-6">

        <h3 className="text-lg font-semibold text-amber-900">
          Before deleting
        </h3>

        <ul className="mt-4 list-disc space-y-2 pl-6 text-amber-800">

          <li>
            The task will be permanently deleted.
          </li>

          <li>
            This action cannot be undone.
          </li>

          <li>
            Any tasks depending on this task will have
            their dependency removed automatically.
          </li>

          <li>
            Historical reports referencing this task may
            no longer show complete information.
          </li>

        </ul>

      </div>

      <form action={deleteTask}>

        <div className="flex justify-end gap-4">

          <Link
            href={`/jobs/${job.id}/tasks/${task.id}`}
            className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            hover:bg-slate-50
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="
            rounded-xl
            bg-red-600
            px-6
            py-3
            font-medium
            text-white
            hover:bg-red-700
            "
          >
            Delete Task
          </button>

        </div>

      </form>

    </div>

  )

}