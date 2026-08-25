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
    noteId: string
  }>
}

export default async function JobNotePage({
  params,
}: PageProps) {

  const {
    id,
    noteId,
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
      },

    })

  if (!job) {
    notFound()
  }

  const note =
    await prisma.jobNote.findFirst({

      where: {
        id: noteId,
        jobId: job.id,
      },

      include: {
        author: true,
      },

    })

  if (!note) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/notes`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Notes
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Job Note
          </h1>

          <p className="mt-2 text-slate-500">
            View note details and activity history.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/notes/${note.id}/edit`}
            className="
            rounded-xl
            border
            px-5
            py-3
            font-medium
            hover:bg-slate-100
            "
          >
            Edit
          </Link>

          <Link
            href={`/jobs/${job.id}/notes/${note.id}/delete`}
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

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">

          <div className="rounded-3xl border bg-white p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">

                {note.author?.name
                  ? note.author.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div>

                <h2 className="text-xl font-semibold">

                  {note.author?.name ??
                    "Unknown User"}

                </h2>

                <p className="text-sm text-slate-500">

                  Created{" "}

                  {new Date(
                    note.createdAt
                  ).toLocaleString()}

                </p>

              </div>

            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 whitespace-pre-wrap leading-8">

              {note.content}

            </div>
                      </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Note Information
            </h2>

            <dl className="mt-6 space-y-5">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Author
                </dt>

                <dd className="font-medium text-right">

                  {note.author?.name ??
                    "Unknown User"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Email
                </dt>

                <dd className="text-right break-all">

                  {note.author?.email ??
                    "-"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Created
                </dt>

                <dd className="text-right">

                  {new Date(
                    note.createdAt
                  ).toLocaleString()}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Last Updated
                </dt>

                <dd className="text-right">

                  {new Date(
                    note.updatedAt
                  ).toLocaleString()}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Job Information
            </h2>

            <dl className="mt-6 space-y-5">

              <div>

                <dt className="text-sm text-slate-500">
                  Job
                </dt>

                <dd className="mt-1 font-medium">

                  {job.title}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Customer
                </dt>

                <dd className="mt-1 font-medium">

                  {job.customer.firstName}{" "}
                  {job.customer.lastName ?? ""}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Status
                </dt>

                <dd className="mt-1 font-medium capitalize">

                  {job.status.replace(
                    "_",
                    " "
                  )}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-lg font-semibold text-blue-900">
              Activity Summary
            </h2>

            <div className="mt-5 space-y-4 text-sm text-blue-800">

              <p>

                This note is permanently
                associated with this job and
                becomes part of its audit trail.

              </p>

              <p>

                Any edits are timestamped to
                provide an accurate history of
                communication and field work.

              </p>

              <p>

                Internal notes are only visible
                to authorized users within your
                organization.

              </p>

            </div>

          </div>
                    <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">

              <Link
                href={`/jobs/${job.id}/notes/${note.id}/edit`}
                className="
                flex
                items-center
                justify-center
                rounded-xl
                border
                px-5
                py-3
                font-medium
                transition
                hover:bg-slate-100
                "
              >
                Edit Note
              </Link>

              <Link
                href={`/jobs/${job.id}/notes/${note.id}/delete`}
                className="
                flex
                items-center
                justify-center
                rounded-xl
                bg-red-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-red-700
                "
              >
                Delete Note
              </Link>

              <Link
                href={`/jobs/${job.id}/notes`}
                className="
                flex
                items-center
                justify-center
                rounded-xl
                border
                px-5
                py-3
                font-medium
                transition
                hover:bg-slate-100
                "
              >
                Back to Notes
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}