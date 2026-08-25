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

export default async function JobNotesPage({
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

      },

    })

  if (!job) {
    notFound()
  }

  const notes =
    await prisma.jobNote.findMany({

      where: {
        jobId: job.id,
      },
       include: {
      author: true,
    },

      orderBy: {
        createdAt: "desc",
      },

    })

  const totalNotes =
    notes.length

  const today =
    new Date()

  const notesToday =
    notes.filter(note => {

      const created =
        new Date(note.createdAt)

      return (
        created.getDate() ===
          today.getDate() &&
        created.getMonth() ===
          today.getMonth() &&
        created.getFullYear() ===
          today.getFullYear()
      )

    }).length

  return (

    <div className="max-w-7xl mx-auto space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Job Notes
          </h1>

          <p className="mt-2 text-slate-500">
            Internal communication and history for this job.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/notes/create`}
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
          + New Note
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Notes
          </p>

          <p className="mt-2 text-4xl font-bold">
            {totalNotes}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Added Today
          </p>

          <p className="mt-2 text-4xl font-bold text-green-600">
            {notesToday}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Customer
          </p>

          <p className="mt-2 text-lg font-semibold">
            {job.customer.firstName}{" "}
            {job.customer.lastName}
          </p>

        </div>

      </div>

      <div className="rounded-3xl border bg-white overflow-hidden">

        <div className="border-b px-8 py-6">

          <h2 className="text-xl font-semibold">
            Activity Timeline
          </h2>

        </div>

                {notes.length === 0 ? (

          <div className="px-8 py-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5h2M12 7v10m-7 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />

              </svg>

            </div>

            <h3 className="mt-6 text-xl font-semibold">
              No Notes Yet
            </h3>

            <p className="mt-2 text-slate-500">
              Create the first note to start tracking
              communication and job history.
            </p>

            <Link
              href={`/jobs/${job.id}/notes/create`}
              className="
              mt-8
              inline-flex
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-medium
              text-white
              hover:bg-blue-700
              "
            >
              Create First Note
            </Link>

          </div>

        ) : (

          <div className="divide-y">

            {notes.map((note) => (

              <div
                key={note.id}
                className="px-8 py-8 hover:bg-slate-50 transition"
              >

                <div className="flex items-start justify-between gap-6">

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">

                        note.author?.name
                          ? note.author?.name.charAt(0).toUpperCase()
                          : "U"

                      </div>

                      <div>

                        <p className="font-semibold">

                          {note.author?.name ??
                            "Unknown User"}

                        </p>

                        <p className="text-sm text-slate-500">

                          {new Date(
                            note.createdAt
                          ).toLocaleString()}

                        </p>

                      </div>

                    </div>

                    <div className="mt-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-5 leading-7">

                      {note.content}

                    </div>

                  </div>

                  <div className="flex flex-col gap-2">

                    <Link
                      href={`/jobs/${job.id}/notes/${note.id}`}
                      className="
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-center
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      View
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/notes/${note.id}/edit`}
                      className="
                      rounded-lg
                      border
                      px-4
                      py-2
                      text-center
                      text-sm
                      hover:bg-slate-100
                      "
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/jobs/${job.id}/notes/${note.id}/delete`}
                      className="
                      rounded-lg
                      border
                      border-red-300
                      px-4
                      py-2
                      text-center
                      text-sm
                      text-red-600
                      hover:bg-red-50
                      "
                    >
                      Delete
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
            <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Job Summary
          </h2>

          <div className="mt-6 space-y-5">

            <div>

              <p className="text-sm text-slate-500">
                Job
              </p>

              <p className="font-semibold">
                {job.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Customer
              </p>

              <p className="font-semibold">
                {job.customer.firstName}{" "}
                {job.customer.lastName ?? ""}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Job Status
              </p>

              <p className="font-semibold capitalize">
                {job.status.replace("_", " ")}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-lg font-semibold">
            Notes Summary
          </h2>

          <div className="mt-6 space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Total Notes
              </span>

              <span className="font-semibold">
                {totalNotes}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Added Today
              </span>

              <span className="font-semibold text-green-600">
                {notesToday}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Latest Activity
              </span>

              <span className="font-semibold">

                {notes.length
                  ? new Date(
                      notes[0].createdAt
                    ).toLocaleDateString()
                  : "-"}

              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-lg font-semibold text-blue-900">
            Best Practices
          </h2>

          <div className="mt-5 space-y-4 text-sm text-blue-800">

            <p>

              Record important customer
              conversations immediately after
              they happen.

            </p>

            <p>

              Include material changes,
              scheduling updates, approvals,
              and field observations.

            </p>

            <p>

              Keep notes factual and concise so
              the entire team has a reliable job
              history.

            </p>

          </div>

        </div>

      </div>

    </div>

  )

}