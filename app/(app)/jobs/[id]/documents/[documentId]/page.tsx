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
    documentId: string
  }>
}

export default async function JobDocumentPage({
  params,
}: PageProps) {

  const {
    id,
    documentId,
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

  const document =
    await prisma.userJobDocument.findFirst({

      where: {
        id: documentId,
        jobId: job.id,
        orgId,
      },

      include: {
        uploadedBy: true,
      },

    })

  if (!document) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/documents`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Documents
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {document.title}

          </h1>

          <p className="mt-2 text-slate-500">

            View document details and metadata.

          </p>

        </div>

        <div className="flex gap-3">

          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
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
            Open Document
          </a>

          <Link
            href={`/jobs/${job.id}/documents/${document.id}/edit`}
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
            href={`/jobs/${job.id}/documents/${document.id}/delete`}
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

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
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

                <h2 className="text-2xl font-semibold">

                  {document.fileName}

                </h2>

                <p className="mt-1 text-slate-500">

                  {document.mimeType}

                </p>

              </div>

            </div>

            {document.description && (

              <div className="mt-8 border-t pt-8">

                <h3 className="text-lg font-semibold">
                  Description
                </h3>

                <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-700">

                  {document.description}

                </p>

              </div>

            )}

                        <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <h3 className="text-lg font-semibold">
                  File Details
                </h3>

                <dl className="mt-5 space-y-4">

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      Category
                    </dt>

                    <dd className="capitalize font-medium">

                      {document.category ?? "-"}

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      File Size
                    </dt>

                    <dd className="font-medium">

                      {(document.fileSize / 1024 / 1024).toFixed(2)} MB

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      MIME Type
                    </dt>

                    <dd className="text-right font-medium break-all">

                      {document.mimeType}

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      File Name
                    </dt>

                    <dd className="max-w-[220px] break-all text-right font-medium">

                      {document.fileName}

                    </dd>

                  </div>

                </dl>

              </div>

              <div>

                <h3 className="text-lg font-semibold">
                  Upload Information
                </h3>

                <dl className="mt-5 space-y-4">

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      Uploaded By
                    </dt>

                    <dd className="font-medium">

                      {document.uploadedBy.name}

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      Email
                    </dt>

                    <dd className="max-w-[220px] break-all text-right">

                      {document.uploadedBy.email}

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      Uploaded
                    </dt>

                    <dd className="text-right">

                      {new Date(
                        document.createdAt
                      ).toLocaleString()}

                    </dd>

                  </div>

                  <div className="flex justify-between">

                    <dt className="text-slate-500">
                      Last Updated
                    </dt>

                    <dd className="text-right">

                      {new Date(
                        document.updatedAt
                      ).toLocaleString()}

                    </dd>

                  </div>

                </dl>

              </div>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Expiration Status
            </h2>

            {document.expiresAt ? (

              <div className="mt-6">

                <p className="text-sm text-slate-500">
                  Expiration Date
                </p>

                <p className="mt-2 text-xl font-semibold">

                  {new Date(
                    document.expiresAt
                  ).toLocaleDateString()}

                </p>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <p className="text-sm text-amber-700">

                    Review this document before its
                    expiration date if renewal is
                    required.

                  </p>

                </div>

              </div>

            ) : (

              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

                <p className="text-sm text-green-700">

                  This document has no expiration
                  date.

                </p>

              </div>

            )}

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">

              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                flex
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
                "
              >
                Open Document
              </a>

              <a
                href={document.fileUrl}
                download
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
                Download
              </a>
                            <Link
                href={`/jobs/${job.id}/documents/${document.id}/edit`}
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
                Edit Document
              </Link>

              <Link
                href={`/jobs/${job.id}/documents/${document.id}/delete`}
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
                Delete Document
              </Link>

              <Link
                href={`/jobs/${job.id}/documents`}
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
                Back to Documents
              </Link>

            </div>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-lg font-semibold text-blue-900">
              Document Information
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                This document is stored as part of
                the permanent job record.

              </p>

              <p>

                Authorized members of your
                organization can access this
                document based on their
                permissions.

              </p>

              <p>

                Keep document titles and
                categories consistent to make
                searching and reporting easier.

              </p>

              <p>

                Review documents with expiration
                dates regularly to ensure permits,
                warranties and compliance records
                remain valid.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}