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

export default async function UploadJobPhotoPage({
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

  async function uploadPhoto(
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

    const imageUrl =
      String(
        formData.get("imageUrl") ?? ""
      ).trim()

    const category =
      String(
        formData.get("category") ?? ""
      ).trim()

    const takenDate =
      String(
        formData.get("takenAt") ?? ""
      )

    const sortOrder =
      Number(
        formData.get("sortOrder") ?? 0
      )

    const isPrimary =
      formData.get("isPrimary") === "on"

    if (!imageUrl) {
      throw new Error(
        "Image URL is required."
      )
    }

    if (isPrimary) {

      await prisma.userJobPhoto.updateMany({

        where: {
          jobId: job.id,
          isPrimary: true,
        },

        data: {
          isPrimary: false,
        },

      })

    }

    await prisma.userJobPhoto.create({

      data: {

        orgId,

        jobId: job.id,

        uploadedById: userId,

        title: title || null,

        description:
          description || null,

        imageUrl,

        category:
          category || null,

        takenAt:
          takenDate
            ? new Date(takenDate)
            : null,

        sortOrder,

        isPrimary,

      },

    })

    redirect(
      `/jobs/${job.id}/photos`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/photos`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Photos
        </Link>

        <h1 className="mt-3 text-4xl font-bold">

          Upload Photo

        </h1>

        <p className="mt-2 text-slate-500">

          Add a new photo to this job's
          documentation.

        </p>

      </div>

      <form
        action={uploadPhoto}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              name="title"
              placeholder="Front entrance completed"
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
              className="
              w-full
              rounded-xl
              border
              px-4
              py-3
              outline-none
              focus:border-blue-500
              "
              defaultValue="during"
            >

              <option value="before">
                Before
              </option>

              <option value="during">
                During
              </option>

              <option value="after">
                After
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="damage">
                Damage
              </option>

              <option value="receipt">
                Receipt
              </option>

              <option value="equipment">
                Equipment
              </option>

              <option value="materials">
                Materials
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
            placeholder="Describe what this photo shows..."
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
            Image URL
          </label>

          <input
            name="imageUrl"
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

          <p className="mt-2 text-sm text-slate-500">
            Paste the public URL of the uploaded image.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Taken Date
            </label>

            <input
              type="datetime-local"
              name="takenAt"
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
              defaultValue={0}
              min={0}
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

        <div className="rounded-2xl border bg-slate-50 p-5">

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              name="isPrimary"
              className="h-5 w-5"
            />

            <span className="font-medium">
              Set as primary job photo
            </span>

          </label>

          <p className="mt-2 text-sm text-slate-500">

            If selected, this image will become the
            default cover photo for this job.

          </p>

        </div>
                <div className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h2 className="text-xl font-semibold text-blue-900">
            Photo Upload Guidelines
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-blue-800">

            <p>
              Upload clear, high-quality photos that
              accurately document the work performed.
            </p>

            <p>
              Use descriptive titles and categories so
              office staff and technicians can quickly
              identify each image.
            </p>

            <p>
              Mark only one image as the primary photo
              for the job. It will be used throughout
              the application as the cover image.
            </p>

            <p>
              Photos become part of the permanent job
              record and may be shared with customers,
              reports, and future technicians.
            </p>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t pt-8">

          <Link
            href={`/jobs/${job.id}/photos`}
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
            Upload Photo
          </button>

        </div>

      </form>

    </div>

  )

}