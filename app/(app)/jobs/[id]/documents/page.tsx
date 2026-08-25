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

export default async function JobDocumentsPage({
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

  const documents =
    await prisma.userJobDocument.findMany({

      where: {
        jobId: job.id,
        orgId,
      },

      include: {
        uploadedBy: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

    })

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Job
          </Link>

          <h1 className="mt-3 text-4xl font-bold">
            Job Documents
          </h1>

          <p className="mt-2 text-slate-500">
            Store contracts, invoices,
            permits, warranties and all
            supporting documents for this job.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/documents/upload`}
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
          Upload Document
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-4xl font-bold">
            {documents.length}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Job
          </p>

          <p className="mt-2 font-semibold">
            {job.title}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Customer
          </p>

          <p className="mt-2 font-semibold">
            {job.customer.firstName}{" "}
            {job.customer.lastName ?? ""}
          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <p className="mt-2 font-semibold capitalize">
            {job.status.replace("_", " ")}
          </p>

        </div>

      </div>

      {documents.length === 0 ? (

        <div className="rounded-3xl border bg-white py-24 text-center">

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
                d="M9 12h6m-6 4h6M7 3h7l5 5v13H7V3z"
              />

            </svg>

          </div>

          <h2 className="mt-6 text-2xl font-semibold">
            No Documents Yet
          </h2>

          <p className="mt-3 text-slate-500">
            Upload contracts, invoices,
            reports, manuals and other
            documents for this job.
          </p>

          <Link
            href={`/jobs/${job.id}/documents/upload`}
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
            Upload First Document
          </Link>

        </div>

      ) : (

        <div className="space-y-5">
                      {documents.map((document) => (

            <div
              key={document.id}
              className="
              rounded-3xl
              border
              bg-white
              p-6
              shadow-sm
              transition
              hover:shadow-md
              "
            >

              <div className="flex items-start justify-between gap-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6M7 3h7l5 5v13H7V3z"
                      />

                    </svg>

                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-semibold">

                        {document.title}

                      </h2>

                      {document.category && (

                        <span
                          className="
                          rounded-full
                          bg-blue-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          capitalize
                          text-blue-700
                          "
                        >
                          {document.category}
                        </span>

                      )}

                    </div>

                    {document.description && (

                      <p className="mt-3 text-slate-600">

                        {document.description}

                      </p>

                    )}

                  </div>

                </div>

                <div className="flex gap-2">

                  <Link
                    href={`/jobs/${job.id}/documents/${document.id}`}
                    className="
                    rounded-xl
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
                    href={`/jobs/${job.id}/documents/${document.id}/edit`}
                    className="
                    rounded-xl
                    border
                    px-4
                    py-2
                    text-sm
                    hover:bg-slate-100
                    "
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/jobs/${job.id}/documents/${document.id}/delete`}
                    className="
                    rounded-xl
                    border
                    border-red-300
                    px-4
                    py-2
                    text-sm
                    text-red-600
                    hover:bg-red-50
                    "
                  >
                    Delete
                  </Link>

                </div>

              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <div>

                  <p className="text-sm text-slate-500">
                    File Name
                  </p>

                  <p className="mt-1 break-all font-medium">

                    {document.fileName}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    File Size
                  </p>

                  <p className="mt-1 font-medium">

                    {(document.fileSize / 1024 / 1024).toFixed(2)} MB

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Uploaded By
                  </p>

                  <p className="mt-1 font-medium">

                    {document.uploadedBy.name}

                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Uploaded
                  </p>

                  <p className="mt-1 font-medium">

                    {new Date(
                      document.createdAt
                    ).toLocaleDateString()}

                  </p>

                </div>

              </div>

              {document.expiresAt && (

                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">

                  <span className="text-sm font-medium text-amber-700">

                    Expires on{" "}

                    {new Date(
                      document.expiresAt
                    ).toLocaleDateString()}

                  </span>

                </div>

              )}

            </div>

          ))}

                  <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Document Summary
            </h2>

            <dl className="mt-8 space-y-5">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Total Documents
                </dt>

                <dd className="font-semibold">
                  {documents.length}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Job
                </dt>

                <dd className="font-semibold text-right">
                  {job.title}
                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Customer
                </dt>

                <dd className="font-semibold text-right">

                  {job.customer.firstName}{" "}
                  {job.customer.lastName ?? ""}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Status
                </dt>

                <dd className="font-semibold capitalize">

                  {job.status.replace(
                    "_",
                    " "
                  )}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Document Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Upload only documents that are
                directly related to this job,
                including contracts, permits,
                inspection reports and invoices.

              </p>

              <p>

                Give every document a clear title
                and select the appropriate
                category so it can be found
                quickly.

              </p>

              <p>

                Expiration dates are useful for
                permits, warranties and compliance
                documents that require renewal.

              </p>

              <p>

                Documents become part of the
                permanent job record and may be
                viewed by authorized members of
                your organization.

              </p>

            </div>

          </div>

        </div>
 </div>
      )}

    </div>

  )

}