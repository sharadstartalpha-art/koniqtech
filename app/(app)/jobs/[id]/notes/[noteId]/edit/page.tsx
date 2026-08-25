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

export default async function EditJobNotePage({
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

  async function updateNote(
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

    const content =
      String(
        formData.get("content") ?? ""
      ).trim()

    if (!content) {

      throw new Error(
        "Note content is required."
      )

    }

    await prisma.jobNote.update({

      where: {
        id: note.id,
      },

      data: {
        content,
      },

    })

    redirect(
      `/jobs/${job.id}/notes/${note.id}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/notes/${note.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Note
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Job Note
        </h1>

        <p className="mt-2 text-slate-500">
          Update the note information below.
        </p>

      </div>

      <form
        action={updateNote}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-xl font-semibold">
            Note Details
          </h2>

          <div className="mt-8 space-y-6">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Job
              </label>

              <input
                disabled
                value={job.title}
                className="
                w-full
                rounded-xl
                border
                bg-slate-100
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Customer
              </label>

              <input
                disabled
                value={`${job.customer.firstName} ${job.customer.lastName ?? ""}`}
                className="
                w-full
                rounded-xl
                border
                bg-slate-100
                px-4
                py-3
                "
              />

            </div>

            <div>

              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium"
              >
                Note
              </label>

              <textarea
                id="content"
                name="content"
                required
                rows={12}
                defaultValue={note.content}
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

        </div>
                <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Note Information
            </h2>

            <dl className="mt-8 space-y-5">

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

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Editing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm text-blue-800">

              <p>

                Keep notes factual and easy for
                every technician to understand.

              </p>

              <p>

                Never remove important customer
                conversations or approval
                history.

              </p>

              <p>

                Document changes clearly so the
                job maintains a complete audit
                trail.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

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