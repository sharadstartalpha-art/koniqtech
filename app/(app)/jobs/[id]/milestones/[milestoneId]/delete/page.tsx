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

export default async function DeleteMilestonePage({
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

  async function deleteMilestone() {

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

    await prisma.jobMilestone.delete({

      where: {
        id: milestone.id,
      },

    })

    redirect(
      `/jobs/${job.id}/milestones`
    )

  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/milestones/${milestone.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Milestone
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Milestone
        </h1>

        <p className="mt-2 text-slate-500">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Warning
        </h2>

        <p className="mt-4 text-red-700 leading-7">
          You are about to permanently delete this
          milestone. All milestone information will be
          removed from this job.
        </p>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-xl font-semibold">
          Milestone Summary
        </h2>

        <dl className="mt-8 space-y-5">

          <div className="flex justify-between">

            <dt className="text-slate-500">
              Title
            </dt>

            <dd className="font-medium">
              {milestone.title}
            </dd>

          </div>

          <div className="flex justify-between">

            <dt className="text-slate-500">
              Status
            </dt>

            <dd className="capitalize font-medium">
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
              Due Date
            </dt>

            <dd className="font-medium">
              {milestone.dueDate
                ? new Date(
                    milestone.dueDate
                  ).toLocaleDateString()
                : "Not Set"}
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

      <div className="rounded-3xl border bg-slate-50 p-8">

        <h2 className="text-xl font-semibold">
          Related Job
        </h2>

        <dl className="mt-8 space-y-5">

          <div className="flex justify-between">

            <dt className="text-slate-500">
              Job Title
            </dt>

            <dd className="font-medium">
              {job.title}
            </dd>

          </div>

          <div className="flex justify-between">

            <dt className="text-slate-500">
              Status
            </dt>

            <dd className="capitalize font-medium">
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

      <form
        action={deleteMilestone}
        className="rounded-3xl border bg-white p-8"
      >

        <h2 className="text-xl font-semibold">
          Confirm Deletion
        </h2>

        <p className="mt-3 text-slate-600 leading-7">
          If you continue, this milestone will be
          permanently removed from the project.
          This operation cannot be undone.
        </p>

        <div className="mt-10 flex justify-end gap-4">

          <Link
            href={`/jobs/${job.id}/milestones/${milestone.id}`}
            className="
            rounded-xl
            border
            px-6
            py-3
            font-medium
            transition
            hover:bg-slate-100
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
            transition
            hover:bg-red-700
            "
          >
            Delete Milestone
          </button>

        </div>

      </form>

    </div>

  )

}