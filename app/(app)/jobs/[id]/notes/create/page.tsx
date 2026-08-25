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

export default async function CreateJobNotePage({
  params,
}: PageProps) {

  const { id } = await params

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    (session.user as any).orgId

  const userId =
    session.user.id

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

  async function createNote(
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

    const userId =
      session.user.id

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

    const content =
      String(
        formData.get("content") ?? ""
      ).trim()

    if (!content) {
      throw new Error(
        "Note content is required."
      )
    }

    await prisma.jobNote.create({

      data: {

        jobId: job.id,

        authorId: userId,

        content,

      },

    })

    redirect(
      `/jobs/${job.id}/notes`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/notes`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Notes
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Create Job Note
        </h1>

        <p className="mt-2 text-slate-500">
          Add an internal note for your team.
        </p>

      </div>

      <form
        action={createNote}
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
                rows={10}
                placeholder="Enter internal job notes..."
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
              Job Summary
            </h2>

            <dl className="mt-8 space-y-5">

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
                  Customer
                </dt>

                <dd className="font-medium text-right">
                  {job.customer.firstName}{" "}
                  {job.customer.lastName ?? ""}
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

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Writing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm text-blue-800">

              <p>
                Record important customer
                conversations and decisions.
              </p>

              <p>
                Include scheduling changes,
                approvals, field observations,
                and issues encountered.
              </p>

              <p>
                Keep notes professional,
                factual, and easy for other
                team members to understand.
              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/notes`}
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
            Save Note
          </button>

        </div>

      </form>

    </div>

  )

}