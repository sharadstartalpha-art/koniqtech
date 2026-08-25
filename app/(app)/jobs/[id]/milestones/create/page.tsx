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
  }>
}

export default async function CreateMilestonePage({
  params,
}: PageProps) {

  const { id } =
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
        milestones: true,
      },

    })

  if (!job) {
    notFound()
  }

  async function createMilestone(
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
        "Milestone title is required."
      )
    }

    const dueDateValue =
      String(
        formData.get("dueDate") ?? ""
      )

    const status =
      String(
        formData.get("status") ?? "pending"
      )

    const completed =
      formData.get("completed") === "on"

    await prisma.jobMilestone.create({

      data: {

        jobId: job.id,

        title,

        status,

        completed,

        dueDate:
          dueDateValue
            ? new Date(dueDateValue)
            : null,

      },

    })

    redirect(
      `/jobs/${job.id}/milestones`
    )

  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Create Milestone
          </h1>

          <p className="mt-2 text-slate-500">

            Add a new milestone for
            <span className="font-semibold">
              {" "}
              {job.title}
            </span>

          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/milestones`}
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
        action={createMilestone}
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
              Milestone Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Enter milestone title"
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
              htmlFor="dueDate"
              className="text-sm font-medium"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
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

        </div>

        <div className="grid gap-6 md:grid-cols-2">

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
              defaultValue="pending"
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

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

          <div className="flex items-end">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="completed"
                className="
                h-5
                w-5
                rounded
                border-slate-300
                text-blue-600
                focus:ring-blue-500
                "
              />

              <span className="font-medium">
                Mark as completed
              </span>

            </label>

          </div>

        </div>

        <div className="rounded-2xl border bg-slate-50 p-6">

          <h2 className="text-lg font-semibold">
            Job Summary
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
                Customer
              </p>

              <p className="font-medium">
                {job.customer.firstName}{" "}
                {job.customer.lastName ?? ""}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Current Job Status
              </p>

              <p className="font-medium capitalize">
                {job.status.replace("_", " ")}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Existing Milestones
              </p>

              <p className="font-medium">
                {job.milestones?.length ?? 0}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h3 className="text-lg font-semibold text-blue-900">
            Tip
          </h3>

          <p className="mt-3 text-sm text-blue-800">

            Milestones represent major project checkpoints,
            such as permits approved, materials delivered,
            inspection completed, or project handover.

          </p>

        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/milestones`}
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
            Create Milestone
          </button>

        </div>

      </form>

    </div>

  )

}