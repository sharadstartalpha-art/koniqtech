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

export default async function DeleteJobDocumentPage({
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

  async function deleteDocument() {

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

    const document =
      await prisma.userJobDocument.findFirst({

        where: {
          id: documentId,
          jobId: job.id,
          orgId,
        },

      })

    if (!document) {
      notFound()
    }

    await prisma.userJobDocument.delete({

      where: {
        id: document.id,
      },

    })

    redirect(
      `/jobs/${job.id}/documents`
    )

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/documents/${document.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Document
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Document
        </h1>

        <p className="mt-2 text-slate-500">
          This action permanently removes the
          document from this job.
        </p>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="text-2xl font-semibold">

          {document.title}

        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>

            <p className="text-sm text-slate-500">
              File Name
            </p>

            <p className="mt-1 font-medium break-all">
              {document.fileName}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Category
            </p>

            <p className="mt-1 font-medium capitalize">
              {document.category ?? "-"}
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
              MIME Type
            </p>

            <p className="mt-1 break-all font-medium">
              {document.mimeType}
            </p>

          </div>

        </div>
      </div>
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-2xl font-semibold text-red-700">
          Permanent Deletion Warning
        </h2>

        <div className="mt-6 space-y-4 text-red-700">

          <p>

            You are about to permanently delete
            this document.

          </p>

          <p>

            This action cannot be undone.

          </p>

          <p>

            After deletion, this document will
            no longer be available from this job
            or anywhere else in your organization.

          </p>

          {document.expiresAt && (

            <p>

              Expiration Date:
              {" "}
              <strong>

                {new Date(
                  document.expiresAt
                ).toLocaleDateString()}

              </strong>

            </p>

          )}

        </div>

      </div>

      <form
        action={deleteDocument}
        className="flex justify-end gap-4 border-t pt-8"
      >

        <Link
          href={`/jobs/${job.id}/documents/${document.id}`}
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
          Permanently Delete
        </button>

      </form>

    </div>

  )

}