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

export default async function EditTaskPage({
  params,
}: PageProps) {

  const { id, taskId } =
    await params

  const session = await auth()

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

        tasks: {
          orderBy: {
            title: "asc",
          },
        },

      },

    })

  if (!job) {
    notFound()
  }

  const task =
    job.tasks.find(
      t => t.id === taskId
    )

  if (!task) {
    notFound()
  }

  async function updateTask(
    formData: FormData
  ) {

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

    const title =
      String(
        formData.get("title") ?? ""
      ).trim()

    if (!title) {
      throw new Error(
        "Task title is required."
      )
    }

    const status =
      String(
        formData.get("status")
      )

    const dependsOnId =
      String(
        formData.get(
          "dependsOnId"
        ) ?? ""
      )

    await prisma.jobTask.update({

      where: {
        id: taskId,
      },

      data: {

        title,

        status,

        dependsOnId:
          dependsOnId.length
            ? dependsOnId
            : null,

      },

    })

    redirect(
      `/jobs/${job.id}/tasks/${taskId}`
    )

  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-semibold">
            Edit Task
          </h1>

          <p className="mt-2 text-slate-500">
            Update task details.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/tasks/${task.id}`}
          className="
          rounded-xl
          border
          px-5
          py-3
          hover:bg-slate-50
          "
        >
          Cancel
        </Link>

      </div>

      <form
        action={updateTask}
        className="
        rounded-3xl
        border
        bg-white
        p-8
        space-y-8
        "
      >
                <div className="grid gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <label
              htmlFor="title"
              className="text-sm font-medium"
            >
              Task Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={task.title}
              placeholder="Enter task title"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              "
            />

          </div>

          <div className="space-y-2">

            <label
              htmlFor="status"
              className="text-sm font-medium"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={task.status}
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              "
            >

              <option value="todo">
                Todo
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

        </div>

        <div className="space-y-2">

          <label
            htmlFor="dependsOnId"
            className="text-sm font-medium"
          >
            Depends On
          </label>

          <select
            id="dependsOnId"
            name="dependsOnId"
            defaultValue={task.dependsOnId ?? ""}
            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            outline-none
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
            "
          >

            <option value="">
              No Dependency
            </option>

            {job.tasks

              .filter(t => t.id !== task.id)

              .map(t => (

                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.title}
                </option>

              ))}

          </select>

          <p className="text-sm text-slate-500">
            Select a task that must be completed
            before this task can begin.
          </p>

        </div>

        <div className="rounded-2xl border bg-slate-50 p-6">

          <h2 className="text-lg font-semibold">
            Task Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Job
              </p>

              <p className="font-medium">
                {job.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Current Status
              </p>

              <p className="font-medium capitalize">
                {task.status.replace("_", " ")}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="font-medium">
                {new Date(
                  task.createdAt
                ).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Total Job Tasks
              </p>

              <p className="font-medium">
                {job.tasks.length}
              </p>

            </div>

          </div>

        </div>

                <div className="flex items-center justify-between border-t pt-8">

          <div className="text-sm text-slate-500">

            Changes will be saved immediately after you
            click <span className="font-medium">Update Task</span>.

          </div>

          <div className="flex items-center gap-3">

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
              bg-blue-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
              "
            >
              Update Task
            </button>

          </div>

        </div>

      </form>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">

        <h2 className="text-lg font-semibold text-amber-900">
          Important
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-amber-800">

          <li>
            Changing the task status may affect overall job progress.
          </li>

          <li>
            Removing or changing dependencies may impact workflow sequencing.
          </li>

          <li>
            Completed tasks should only be edited if corrections are required.
          </li>

        </ul>

      </div>

    </div>

  )

}