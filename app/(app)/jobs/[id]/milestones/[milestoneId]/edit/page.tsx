import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect,
} from "next/navigation"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{
    id: string
    milestoneId: string
  }>
}

export default async function EditMilestonePage({
  params,
}: PageProps) {

  const {
    id,
    milestoneId,
  } = await params

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


  const milestone =
  await prisma.jobMilestone.findFirst({

    where: {
      id: milestoneId,
      jobId: job.id,
    },

  })

if (!milestone) {
  notFound()
}



 

  async function updateMilestone(
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

    const dueDate =
      String(
        formData.get("dueDate") ?? ""
      )

    const status =
      String(
        formData.get("status") ?? "pending"
      )

    const completed =
      formData.get("completed") === "on"

    await prisma.jobMilestone.update({

      where: {
        id: milestoneId,
      },

      data: {

        title,

        status,

        completed,

        dueDate:
          dueDate
            ? new Date(dueDate)
            : null,

      },

    })

    redirect(
      `/jobs/${job.id}/milestones/${milestoneId}`
    )

  }

  return (

    <div className="max-w-5xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/milestones/${milestone.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Milestone
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Edit Milestone
          </h1>

          <p className="mt-2 text-slate-500">
            Update milestone information.
          </p>

        </div>

      </div>

      <form
        action={updateMilestone}
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
              required
              defaultValue={milestone.title}
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
              defaultValue={
                milestone.dueDate
                  ? new Date(
                      milestone.dueDate
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
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
              defaultValue={milestone.status}
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
                defaultChecked={milestone.completed}
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
                Completed
              </span>

            </label>

          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border bg-slate-50 p-6">

            <h2 className="text-lg font-semibold">
              Milestone Summary
            </h2>

            <dl className="mt-6 space-y-4">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Title
                </dt>

                <dd className="font-medium text-right">
                  {milestone.title}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Status
                </dt>

                <dd className="font-medium capitalize">
                  {milestone.status}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Completed
                </dt>

                <dd className="font-medium">
                  {milestone.completed
                    ? "Yes"
                    : "No"}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Created
                </dt>

                <dd className="font-medium">
                  {new Date(
                    milestone.createdAt
                  ).toLocaleDateString()}
                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-2xl border bg-slate-50 p-6">

            <h2 className="text-lg font-semibold">
              Job Summary
            </h2>

            <dl className="mt-6 space-y-4">

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
                  Status
                </dt>

                <dd className="font-medium capitalize">
                  {job.status.replace("_", " ")}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Job ID
                </dt>

                <dd className="font-mono text-xs">
                  {job.id}
                </dd>

              </div>

            </dl>

          </div>

        </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-lg font-semibold text-blue-900">
            Editing Guidelines
          </h2>

          <div className="mt-4 space-y-3 text-sm text-blue-800">

            <p>
              Update milestone details whenever project
              requirements or schedules change.
            </p>

            <p>
              Only mark a milestone as completed after all
              required work has been verified.
            </p>

            <p>
              Keeping milestone dates accurate improves
              project tracking and reporting.
            </p>

          </div>

        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/milestones/${milestone.id}`}
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
            Save Changes
          </button>

        </div>

      </form>

    </div>

  )

}