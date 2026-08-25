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

export default async function DeleteJobNotePage({
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

  async function deleteNote() {

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

    const note =
      await prisma.jobNote.findFirst({

        where: {
          id: noteId,
          jobId: job.id,
        },

      })

    if (!note) {
      notFound()
    }

    await prisma.jobNote.delete({

      where: {
        id: note.id,
      },

    })

    redirect(
      `/jobs/${job.id}/notes`
    )

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/notes/${note.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Note
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Note
        </h1>

        <p className="mt-2 text-slate-500">
          Review the information below before
          permanently deleting this note.
        </p>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-xl font-semibold">
          Note Details
        </h2>

        <dl className="mt-8 space-y-5">

          <div className="flex justify-between gap-8">

            <dt className="text-slate-500">
              Job
            </dt>

            <dd className="text-right font-medium">
              {job.title}
            </dd>

          </div>

          <div className="flex justify-between gap-8">

            <dt className="text-slate-500">
              Customer
            </dt>

            <dd className="text-right font-medium">
              {job.customer.firstName}{" "}
              {job.customer.lastName ?? ""}
            </dd>

          </div>

          <div className="flex justify-between gap-8">

            <dt className="text-slate-500">
              Author
            </dt>

            <dd className="text-right font-medium">
              {note.author?.name ??
                "Unknown User"}
            </dd>

          </div>

          <div className="flex justify-between gap-8">

            <dt className="text-slate-500">
              Created
            </dt>

            <dd className="text-right">
              {new Date(
                note.createdAt
              ).toLocaleString()}
            </dd>

          </div>

        </dl>

        <div className="mt-8 rounded-2xl bg-slate-50 p-5 whitespace-pre-wrap leading-7">

          {note.content}

        </div>

      </div>
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />

            </svg>

          </div>

          <div>

            <h2 className="text-xl font-semibold text-red-700">
              Permanent Deletion
            </h2>

            <p className="mt-3 text-red-700 leading-7">

              You are about to permanently delete
              this job note.

            </p>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-red-700">

              <li>
                The note cannot be recovered.
              </li>

              <li>
                All recorded information will be
                permanently removed.
              </li>

              <li>
                Team members will no longer be
                able to view this note.
              </li>

              <li>
                This action is irreversible.
              </li>

            </ul>

          </div>

        </div>

      </div>

      <form
        action={deleteNote}
        className="flex justify-end gap-4 border-t pt-8"
      >

        <Link
          href={`/jobs/${job.id}/notes/${note.id}`}
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
          Permanently Delete Note
        </button>

      </form>

    </div>

  )

}