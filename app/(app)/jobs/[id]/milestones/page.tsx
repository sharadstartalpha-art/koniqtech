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
  }>
}

export default async function JobMilestonesPage({
  params,
}: PageProps) {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const { id } =
    await params

  const job =
    await prisma.job.findFirst({

      where: {
        id,
        orgId,
      },

      include: {

        customer: true,

        milestones: {

          orderBy: [
            {
              completed: "asc",
            },
            {
              dueDate: "asc",
            },
            {
              createdAt: "asc",
            },
          ],

        },

      },

    })

  if (!job) {
    notFound()
  }

  const totalMilestones =
    job.milestones.length

  const completedMilestones =
    job.milestones.filter(
      milestone => milestone.completed
    ).length

  const pendingMilestones =
    totalMilestones -
    completedMilestones

  const overdueMilestones =
    job.milestones.filter(

      milestone =>

        !milestone.completed &&

        milestone.dueDate &&

        milestone.dueDate <
          new Date()

    ).length

  const completionPercentage =
    totalMilestones === 0
      ? 0
      : Math.round(
          (
            completedMilestones /
            totalMilestones
          ) * 100
        )

  return (

    <div className="space-y-8">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            Job Milestones

          </h1>

          <p className="mt-2 text-slate-500">

            Track project milestones and
            overall completion progress.

          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/milestones/create`}
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
          + New Milestone
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total
          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {totalMilestones}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">

            {completedMilestones}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-amber-600">

            {pendingMilestones}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold">

            {completionPercentage}%

          </h2>

          <div className="mt-4 h-3 rounded-full bg-slate-200">

            <div
              className="
              h-3
              rounded-full
              bg-emerald-500
              transition-all
              "
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h3 className="text-lg font-semibold">
            Job Summary
          </h3>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Job
              </span>

              <span className="font-medium">

                {job.title}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Customer
              </span>

              <span className="font-medium">

                {job.customer.firstName}{" "}
                {job.customer.lastName ?? ""}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Status
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
                Overdue
              </span>

              <span className="font-semibold text-red-600">

                {overdueMilestones}

              </span>

            </div>

          </div>

        </div>

                <div className="lg:col-span-2 rounded-3xl border bg-white overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="p-4 text-left">
                  Milestone
                </th>

                <th className="text-left">
                  Due Date
                </th>

                <th className="text-left">
                  Status
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

              {job.milestones.length === 0 && (

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

                        No milestones have been created.

                      </p>

                      <Link
                        href={`/jobs/${job.id}/milestones/create`}
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
                        Create First Milestone
                      </Link>

                    </div>

                  </td>

                </tr>

              )}

              {job.milestones.map(milestone => {

                const badgeClass =
                  milestone.completed
                    ? "bg-emerald-100 text-emerald-700"
                    : milestone.dueDate &&
                      milestone.dueDate < new Date()
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"

                const badgeLabel =
                  milestone.completed
                    ? "Completed"
                    : milestone.dueDate &&
                      milestone.dueDate < new Date()
                    ? "Overdue"
                    : "Pending"

                return (

                  <tr
                    key={milestone.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-4">

                      <div>

                        <p className="font-semibold">

                          {milestone.title}

                        </p>

                      </div>

                    </td>

                    <td>

                      {milestone.dueDate ? (

                        new Date(
                          milestone.dueDate
                        ).toLocaleDateString()

                      ) : (

                        <span className="text-slate-400">

                          —

                        </span>

                      )}

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

                        {badgeLabel}

                      </span>

                    </td>

                    <td>

                      {new Date(
                        milestone.createdAt
                      ).toLocaleDateString()}

                    </td>

                    <td className="pr-6">

                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/jobs/${job.id}/milestones/${milestone.id}`}
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
                          href={`/jobs/${job.id}/milestones/${milestone.id}/edit`}
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
                          href={`/jobs/${job.id}/milestones/${milestone.id}/delete`}
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

      </div>

            <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Progress Summary
          </h2>

          <div className="mt-6">

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                Completion
              </span>

              <span className="font-semibold">
                {completionPercentage}%
              </span>

            </div>

            <div className="mt-3 h-3 rounded-full bg-slate-200">

              <div
                className="h-3 rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Total Milestones
              </span>

              <span className="font-semibold">
                {totalMilestones}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Completed
              </span>

              <span className="font-semibold text-emerald-600">
                {completedMilestones}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Pending
              </span>

              <span className="font-semibold text-amber-600">
                {pendingMilestones}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Overdue
              </span>

              <span className="font-semibold text-red-600">
                {overdueMilestones}
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
              href={`/jobs/${job.id}/milestones/create`}
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
              + New Milestone
            </Link>

          </div>

        </div>

        <div className="rounded-3xl border bg-slate-50 p-6">

          <h2 className="text-lg font-semibold">
            Project Health
          </h2>

          <div className="mt-6 space-y-5">

            <div>

              <p className="text-sm text-slate-500">
                Completion Rate
              </p>

              <p className="mt-1 text-2xl font-bold">
                {completionPercentage}%
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Current Status
              </p>

              <p className="mt-1 font-semibold capitalize">
                {job.status.replace("_", " ")}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Recommendation
              </p>

              <p className="mt-1 text-sm">

                {overdueMilestones > 0
                  ? "Review overdue milestones and update the project schedule."
                  : pendingMilestones > 0
                  ? "Continue progressing through the remaining milestones."
                  : "All milestones are complete. This project is ready for closeout."}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}