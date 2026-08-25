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

export default async function EditJobDocumentPage({
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

    })

  if (!document) {
    notFound()
  }

  async function updateDocument(
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

    const title =
      String(
        formData.get("title") ?? ""
      ).trim()

    const description =
      String(
        formData.get("description") ?? ""
      ).trim()

    const fileName =
      String(
        formData.get("fileName") ?? ""
      ).trim()

    const fileUrl =
      String(
        formData.get("fileUrl") ?? ""
      ).trim()

    const mimeType =
      String(
        formData.get("mimeType") ?? ""
      ).trim()

    const fileSize =
      Number(
        formData.get("fileSize") ?? 0
      )

    const category =
      String(
        formData.get("category") ?? ""
      ).trim()

    const expiresAt =
      String(
        formData.get("expiresAt") ?? ""
      )

    const sortOrder =
      Number(
        formData.get("sortOrder") ?? 0
      )

    if (!title) {
      throw new Error(
        "Title is required."
      )
    }

    await prisma.userJobDocument.update({

      where: {
        id: document.id,
      },

      data: {

        title,

        description:
          description || null,

        fileName,

        fileUrl,

        mimeType,

        fileSize,

        category:
          category || null,

        expiresAt:
          expiresAt
            ? new Date(expiresAt)
            : null,

        sortOrder,

      },

    })

    redirect(
      `/jobs/${job.id}/documents/${document.id}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/documents/${document.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Document
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Document
        </h1>

        <p className="mt-2 text-slate-500">
          Update the document information.
        </p>

      </div>

      <form
        action={updateDocument}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Title
              </label>

              <input
                name="title"
                required
                defaultValue={document.title}
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

            <div>

              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category"
                defaultValue={document.category ?? "other"}
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
              >

                <option value="contract">Contract</option>
                <option value="invoice">Invoice</option>
                <option value="quote">Quote</option>
                <option value="receipt">Receipt</option>
                <option value="permit">Permit</option>
                <option value="inspection">Inspection</option>
                <option value="report">Report</option>
                <option value="warranty">Warranty</option>
                <option value="manual">Manual</option>
                <option value="drawing">Drawing</option>
                <option value="certificate">Certificate</option>
                <option value="compliance">Compliance</option>
                <option value="other">Other</option>

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={6}
                defaultValue={document.description ?? ""}
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

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                File URL
              </label>

              <input
                type="url"
                name="fileUrl"
                required
                defaultValue={document.fileUrl}
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

            <div>

              <label className="mb-2 block font-medium">
                File Name
              </label>

              <input
                name="fileName"
                required
                defaultValue={document.fileName}
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

            <div>

              <label className="mb-2 block font-medium">
                MIME Type
              </label>

              <input
                name="mimeType"
                required
                defaultValue={document.mimeType}
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

            <div className="grid gap-6 md:grid-cols-3">

              <div>

                <label className="mb-2 block font-medium">
                  File Size
                </label>

                <input
                  type="number"
                  name="fileSize"
                  min={0}
                  required
                  defaultValue={document.fileSize}
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

              <div>

                <label className="mb-2 block font-medium">
                  Expiration
                </label>

                <input
                  type="date"
                  name="expiresAt"
                  defaultValue={
                    document.expiresAt
                      ? new Date(document.expiresAt)
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
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

              <div>

                <label className="mb-2 block font-medium">
                  Sort Order
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  min={0}
                  defaultValue={document.sortOrder}
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

        </div>
                <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Document Information
            </h2>

            <dl className="mt-8 space-y-5">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Created
                </dt>

                <dd>

                  {new Date(
                    document.createdAt
                  ).toLocaleString()}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Last Updated
                </dt>

                <dd>

                  {new Date(
                    document.updatedAt
                  ).toLocaleString()}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Size
                </dt>

                <dd>

                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Category
                </dt>

                <dd className="capitalize">

                  {document.category ?? "-"}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

            <h2 className="text-xl font-semibold text-blue-900">
              Editing Guidelines
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

              <p>

                Keep document titles concise and
                descriptive so they can be easily
                identified from the job record.

              </p>

              <p>

                Verify that the file URL remains
                accessible before saving any
                changes.

              </p>

              <p>

                Update expiration dates whenever
                permits, warranties or compliance
                documents are renewed.

              </p>

              <p>

                Changes are saved immediately after
                submitting this form.

              </p>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

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