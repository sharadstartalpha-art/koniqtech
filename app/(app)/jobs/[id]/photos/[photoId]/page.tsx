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

export default async function JobPhotoPage({
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

      include: {
        uploadedBy: true,
      },

    })

  if (!photo) {
    notFound()
  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href={`/jobs/${job.id}/photos`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Photos
          </Link>

          <h1 className="mt-3 text-4xl font-bold">

            {photo.title ?? "Job Photo"}

          </h1>

          <p className="mt-2 text-slate-500">

            View photo details and metadata.

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/jobs/${job.id}/photos/${photo.id}/edit`}
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
            href={`/jobs/${job.id}/photos/${photo.id}/delete`}
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

          <div className="overflow-hidden rounded-3xl border bg-white">

            <img
              src={photo.imageUrl}
              alt={photo.title ?? "Job Photo"}
              className="
              w-full
              object-cover
              max-h-[700px]
              "
            />

          </div>

          {photo.description && (

            <div className="mt-6 rounded-3xl border bg-white p-8">

              <h2 className="text-xl font-semibold">
                Description
              </h2>

              <p className="mt-5 whitespace-pre-wrap leading-8 text-slate-700">

                {photo.description}

              </p>

            </div>

          )}

                  </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Photo Information
            </h2>

            <dl className="mt-6 space-y-5">

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Uploaded By
                </dt>

                <dd className="text-right font-medium">

                  {photo.uploadedBy.name}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Email
                </dt>

                <dd className="max-w-[180px] break-all text-right">

                  {photo.uploadedBy.email}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Category
                </dt>

                <dd className="capitalize font-medium">

                  {photo.category ?? "-"}

                </dd>

              </div>

              <div className="flex justify-between">

                <dt className="text-slate-500">
                  Taken
                </dt>

                <dd className="text-right">

                  {photo.takenAt
                    ? new Date(
                        photo.takenAt
                      ).toLocaleString()
                    : "-"}

                </dd>

              </div>

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
                  Sort Order
                </dt>

                <dd>

                  {photo.sortOrder}

                </dd>

              </div>

            </dl>

            {photo.isPrimary && (

              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">

                <span className="font-medium text-green-700">

                  ★ Primary Job Photo

                </span>

              </div>

            )}

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Job Information
            </h2>

            <dl className="mt-6 space-y-5">

              <div>

                <dt className="text-sm text-slate-500">
                  Job
                </dt>

                <dd className="mt-1 font-medium">

                  {job.title}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Customer
                </dt>

                <dd className="mt-1 font-medium">

                  {job.customer.firstName}{" "}
                  {job.customer.lastName ?? ""}

                </dd>

              </div>

              <div>

                <dt className="text-sm text-slate-500">
                  Status
                </dt>

                <dd className="mt-1 font-medium capitalize">

                  {job.status.replace(
                    "_",
                    " "
                  )}

                </dd>

              </div>

            </dl>

          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

            <h2 className="text-lg font-semibold text-blue-900">
              Photo Details
            </h2>

            <div className="mt-5 space-y-4 text-sm text-blue-800">

              <p>

                This image is stored as part of
                the permanent job history.

              </p>

              <p>

                Photos can be viewed by
                authorized members of your
                organization.

              </p>

              <p>

                Use descriptive titles and
                categories to make photos easy
                to find later.

              </p>

            </div>

          </div>

                    <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-3">

              <Link
                href={`/jobs/${job.id}/photos/${photo.id}/edit`}
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
                Edit Photo
              </Link>

              <Link
                href={`/jobs/${job.id}/photos/${photo.id}/delete`}
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
                Delete Photo
              </Link>

              <Link
                href={`/jobs/${job.id}/photos`}
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
                Back to Gallery
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}