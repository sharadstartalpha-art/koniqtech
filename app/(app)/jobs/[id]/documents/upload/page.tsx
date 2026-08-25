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

export default async function UploadJobDocumentPage({
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

  async function uploadDocument(
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

    if (!fileUrl) {
      throw new Error(
        "File URL is required."
      )
    }

    await prisma.userJobDocument.create({

      data: {

        orgId,

        jobId: job.id,

        uploadedById: userId,

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
      `/jobs/${job.id}/documents`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/documents`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Documents
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Upload Document
        </h1>

        <p className="mt-2 text-slate-500">
          Add a new document to this job.
        </p>

      </div>

      <form
        action={uploadDocument}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              name="title"
              required
              placeholder="Signed Contract"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Category
            </label>

            <select
              name="category"
              defaultValue="contract"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            >

              <option value="contract">
                Contract
              </option>

              <option value="invoice">
                Invoice
              </option>

              <option value="quote">
                Quote
              </option>

              <option value="receipt">
                Receipt
              </option>

              <option value="permit">
                Permit
              </option>

              <option value="inspection">
                Inspection
              </option>

              <option value="report">
                Report
              </option>

              <option value="warranty">
                Warranty
              </option>

              <option value="manual">
                Manual
              </option>

              <option value="drawing">
                Drawing
              </option>

              <option value="certificate">
                Certificate
              </option>

              <option value="compliance">
                Compliance
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            placeholder="Optional description..."
            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            outline-none
            focus:border-blue-500
            "
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            File URL
          </label>

          <input
            name="fileUrl"
            type="url"
            required
            placeholder="https://..."
            className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            outline-none
            focus:border-blue-500
            "
          />

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              File Name
            </label>

            <input
              name="fileName"
              required
              placeholder="contract.pdf"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
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
              placeholder="application/pdf"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            />

          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          <div>

            <label className="mb-2 block font-medium">
              File Size (bytes)
            </label>

            <input
              type="number"
              name="fileSize"
              required
              min={0}
              defaultValue={0}
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Expiration Date
            </label>

            <input
              type="date"
              name="expiresAt"
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
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
              defaultValue={0}
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
            />

          </div>

        </div>
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Upload Guidelines
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>
              Upload documents that are directly
              related to this job, such as contracts,
              permits, invoices, reports and manuals.
            </p>

            <p>
              Use descriptive titles and choose the
              correct category so documents are easy
              to locate later.
            </p>

            <p>
              Ensure the stored file URL is accessible
              by authorized users of your organization.
            </p>

            <p>
              Set an expiration date for warranties,
              permits or compliance documents that
              require future renewal.
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/documents`}
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
            Upload Document
          </button>

        </div>

      </form>

    </div>

  )

}