import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CreateJobTaskPage({
  params,
}: PageProps) {

  const { id } = await params

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
      tasks: {
        orderBy: {
          title: "asc",
        },
      },
      customer: true,
    },
  })

  if (!job) {
    notFound()
  }

  async function createTask(formData: FormData) {
    "use server"

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
    })

    if (!job) {
      notFound()
    }

    const title = String(
      formData.get("title") ?? ""
    ).trim()

    if (!title) {
      throw new Error("Task title is required.")
    }

    const status = String(
      formData.get("status") ?? "todo"
    )

    const dependsOnId =
      String(formData.get("dependsOnId") ?? "")

    await prisma.jobTask.create({
      data: {
        jobId: job.id,
        title,
        status,
        dependsOnId:
          dependsOnId.length > 0
            ? dependsOnId
            : null,
      },
    })

    redirect(`/jobs/${job.id}/tasks`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-semibold">
            Create Task
          </h1>

          <p className="mt-2 text-slate-500">
            Add a new task to
            <span className="font-semibold text-slate-700">
              {" "}
              {job.title}
            </span>
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/tasks`}
          className="rounded-xl border px-5 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={createTask}
        className="rounded-3xl border bg-white p-8 space-y-8"
      >
                <div className="grid gap-6 md:grid-cols-2">

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Task Title
            </label>

            <input
              name="title"
              type="text"
              required
              placeholder="Enter task title"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            />

          </div>

          <div className="space-y-2">

            <label className="text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue="todo"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
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

          <label className="text-sm font-medium">
            Depends On
          </label>

          <select
            name="dependsOnId"
            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            outline-none
            focus:border-blue-500
            "
          >

            <option value="">
              No Dependency
            </option>

            {job.tasks.map(task => (

              <option
                key={task.id}
                value={task.id}
              >
                {task.title}
              </option>

            ))}

          </select>

          <p className="text-sm text-slate-500">
            Select another task that must be completed before this task can begin.
          </p>

        </div>

        <div className="rounded-2xl border bg-slate-50 p-5">

          <h2 className="font-semibold">
            Job Information
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

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
                Customer
              </p>

              <p className="font-medium">
                {job.customer.firstName}
                {job.customer.lastName
                  ? ` ${job.customer.lastName}`
                  : ""}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Existing Tasks
              </p>

              <p className="font-medium">
                {job.tasks.length}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Job Status
              </p>

              <p className="font-medium capitalize">
                {job.status.replace("_", " ")}
              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t pt-6">

          <Link
            href={`/jobs/${job.id}/tasks`}
            className="
            rounded-xl
            border
            px-6
            py-3
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
            hover:bg-blue-700
            "
          >
            Create Task
          </button>

        </div>

      </form>

    </div>

  )

}