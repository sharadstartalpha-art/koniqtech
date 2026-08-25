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

export default async function MilestoneDetailsPage({
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

      include: {

        customer: true,

        technician: true,

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

  const badgeClass =
    milestone.completed
      ? "bg-emerald-100 text-emerald-700"
      : milestone.dueDate &&
        milestone.dueDate < new Date()
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700"

  const badgeText =
    milestone.completed
      ? "Completed"
      : milestone.dueDate &&
        milestone.dueDate < new Date()
      ? "Overdue"
      : "Pending"

  return (

    <div className="space-y-8">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/milestones`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Milestones
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {milestone.title}

          </h1>

          <p className="mt-2 text-slate-500">

            View milestone details and progress.

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/milestones/${milestone.id}/edit`}
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
            Edit
          </Link>

          <Link
            href={`/jobs/${job.id}/milestones/${milestone.id}/delete`}
            className="
            rounded-xl
            bg-red-600
            px-5
            py-3
            font-medium
            text-white
            hover:bg-red-700
            "
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="lg:col-span-2 rounded-3xl border bg-white p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-semibold">

              Milestone Overview

            </h2>

            <span
              className={`
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              ${badgeClass}
              `}
            >
              {badgeText}
            </span>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

                        <div>

              <p className="text-sm text-slate-500">
                Milestone
              </p>

              <p className="mt-2 text-lg font-semibold">
                {milestone.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Status
              </p>

              <span
                className={`
                mt-2
                inline-flex
                rounded-full
                px-3
                py-1
                text-sm
                font-medium
                ${badgeClass}
                `}
              >
                {badgeText}
              </span>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="mt-2 font-semibold">

                {milestone.completed
                  ? "Yes"
                  : "No"}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Due Date
              </p>

              <p className="mt-2 font-semibold">

                {milestone.dueDate
                  ? new Date(
                      milestone.dueDate
                    ).toLocaleDateString()
                  : "Not Set"}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-2 font-semibold">

                {new Date(
                  milestone.createdAt
                ).toLocaleString()}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Internal Status
              </p>

              <p className="mt-2 font-semibold capitalize">

                {milestone.status}

              </p>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h3 className="text-lg font-semibold">

              Job Summary

            </h3>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Job
                </span>

                <span className="font-medium text-right">

                  {job.title}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Customer
                </span>

                <span className="font-medium text-right">

                  {job.customer.firstName}{" "}
                  {job.customer.lastName ?? ""}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Job Status
                </span>

                <span className="font-medium capitalize">

                  {job.status.replace(
                    "_",
                    " "
                  )}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">
                  Technician
                </span>

                <span className="font-medium text-right">

                  {job.technician?.name ??
                    "Unassigned"}

                </span>

              </div>

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <h3 className="text-lg font-semibold">

              Timeline

            </h3>

            <div className="mt-6 space-y-5">

              <div>

                <p className="text-sm text-slate-500">
                  Created On
                </p>

                <p className="mt-1 font-medium">

                  {new Date(
                    milestone.createdAt
                  ).toLocaleString()}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Target Completion
                </p>

                <p className="mt-1 font-medium">

                  {milestone.dueDate
                    ? new Date(
                        milestone.dueDate
                      ).toLocaleDateString()
                    : "No due date"}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

            <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Progress
          </h2>

          <div className="mt-6">

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-500">
                Completion
              </span>

              <span className="font-semibold">

                {milestone.completed
                  ? "100%"
                  : "0%"}

              </span>

            </div>

            <div className="mt-3 h-3 rounded-full bg-slate-200">

              <div
                className="
                h-3
                rounded-full
                bg-emerald-500
                transition-all
                "
                style={{
                  width:
                    milestone.completed
                      ? "100%"
                      : "0%",
                }}
              />

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Current Status
              </span>

              <span className="font-semibold">

                {badgeText}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Completion
              </span>

              <span className="font-semibold">

                {milestone.completed
                  ? "Completed"
                  : "Pending"}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Due Date
              </span>

              <span className="font-semibold">

                {milestone.dueDate
                  ? new Date(
                      milestone.dueDate
                    ).toLocaleDateString()
                  : "Not Set"}

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
              Job Details
            </Link>

            <Link
              href={`/jobs/${job.id}/tasks`}
              className="
              rounded-xl
              border
              px-4
              py-3
              text-center
              hover:bg-slate-50
              "
            >
              Job Tasks
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
              All Milestones
            </Link>

            <Link
              href={`/jobs/${job.id}/milestones/${milestone.id}/edit`}
              className="
              rounded-xl
              bg-blue-600
              px-4
              py-3
              text-center
              text-white
              hover:bg-blue-700
              "
            >
              Edit Milestone
            </Link>

          </div>

        </div>

        <div className="rounded-3xl border bg-blue-50 border-blue-100 p-6">

          <h2 className="text-lg font-semibold text-blue-900">
            Notes
          </h2>

          <div className="mt-5 space-y-4 text-sm text-blue-800">

            <p>

              Milestones represent important
              project checkpoints and should
              reflect major stages of work.

            </p>

            <p>

              Keep milestone due dates updated
              to improve project forecasting
              and scheduling accuracy.

            </p>

            <p>

              Mark milestones as completed only
              after all associated work has been
              fully verified.

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}