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
    photoId: string
  }>
}

export default async function EditJobPhotoPage({
  params,
}: PageProps) {

  const {
    id,
    photoId,
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

  const photo =
    await prisma.userJobPhoto.findFirst({

      where: {
        id: photoId,
        jobId: job.id,
        orgId,
      },

    })

  if (!photo) {
    notFound()
  }

  async function updatePhoto(
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

    const photo =
      await prisma.userJobPhoto.findFirst({

        where: {
          id: photoId,
          jobId: job.id,
          orgId,
        },

      })

    if (!photo) {
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

    await prisma.userJobPhoto.update({

      where: {
        id: photo.id,
      },

      data: {

        title: title || null,

        description:
          description || null,

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
      `/jobs/${job.id}/photos/${photo.id}`
    )

  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/photos/${photo.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Photo
        </Link>

        <h1 className="mt-3 text-4xl font-bold">
          Edit Photo
        </h1>

        <p className="mt-2 text-slate-500">
          Update the photo information below.
        </p>

      </div>

      <form
        action={updatePhoto}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div className="grid gap-8 lg:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Current Photo
            </label>

            <div className="overflow-hidden rounded-2xl border bg-slate-100">

              <img
                src={photo.imageUrl}
                alt={photo.title ?? "Job Photo"}
                className="w-full object-cover"
              />

            </div>

          </div>

          <div className="space-y-6">

            <div>

              <label className="mb-2 block font-medium">
                Title
              </label>

              <input
                name="title"
                defaultValue={photo.title ?? ""}
                placeholder="Photo title"
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
                defaultValue={photo.category ?? "during"}
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

            <div>

              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                rows={6}
                defaultValue={photo.description ?? ""}
                placeholder="Describe this photo..."
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

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Taken Date
                </label>

                <input
                  type="datetime-local"
                  name="takenAt"
                  defaultValue={
                    photo.takenAt
                      ? new Date(photo.takenAt)
                          .toISOString()
                          .slice(0, 16)
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
                  defaultValue={photo.sortOrder}
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

            <div className="rounded-2xl border bg-slate-50 p-5">

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  name="isPrimary"
                  defaultChecked={photo.isPrimary}
                  className="h-5 w-5"
                />

                <span className="font-medium">

                  Primary Job Photo

                </span>

              </label>

              <p className="mt-2 text-sm text-slate-500">

                When enabled, this photo will
                become the default cover image
                for this job.

              </p>

            </div>

          </div>

        </div>
                <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="text-xl font-semibold">
              Photo Information
            </h2>

            <dl className="mt-8 space-y-5">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Uploaded
                </dt>

                <dd className="text-right">

                  {new Date(
                    photo.createdAt
                  ).toLocaleString()}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Image URL
                </dt>

                <dd className="max-w-[240px] truncate text-right">

                  {photo.imageUrl}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Current Status
                </dt>

                <dd>

                  {photo.isPrimary ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Primary Photo
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      Standard Photo
                    </span>
                  )}

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

                Keep titles short and descriptive so
                technicians can quickly identify each
                image.

              </p>

              <p>

                Use consistent categories such as
                Before, During and After to improve
                reporting and customer documentation.

              </p>

              <p>

                Only one photo should normally be
                marked as the primary job photo.

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
            href={`/jobs/${job.id}/photos/${photo.id}`}
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