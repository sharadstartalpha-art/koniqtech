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

export default async function DeleteJobPhotoPage({
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

  async function deletePhoto() {

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

    await prisma.userJobPhoto.delete({

      where: {
        id: photo.id,
      },

    })

    redirect(
      `/jobs/${job.id}/photos`
    )

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div>

        <Link
          href={`/jobs/${job.id}/photos/${photo.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Photo
        </Link>

        <h1 className="mt-3 text-4xl font-bold text-red-600">
          Delete Photo
        </h1>

        <p className="mt-2 text-slate-500">
          This action permanently removes the
          selected photo from this job.
        </p>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <img
          src={photo.imageUrl}
          alt={photo.title ?? "Job Photo"}
          className="w-full max-h-[500px] object-cover"
        />

        <div className="p-8">

          <h2 className="text-2xl font-semibold">
            {photo.title ?? "Untitled Photo"}
          </h2>

          {photo.description && (

            <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">

              {photo.description}

            </p>

          )}

          <dl className="mt-8 space-y-4">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Uploaded By
              </dt>

              <dd className="font-medium">

                {photo.uploadedBy.name}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Category
              </dt>

              <dd className="capitalize">

                {photo.category ?? "-"}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Uploaded
              </dt>

              <dd>

                {new Date(
                  photo.createdAt
                ).toLocaleString()}

              </dd>

            </div>

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Primary Photo
              </dt>

              <dd>

                {photo.isPrimary
                  ? "Yes"
                  : "No"}

              </dd>

            </div>

          </dl>

        </div>

      </div>
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />

            </svg>

          </div>

          <div>

            <h2 className="text-xl font-semibold text-red-700">
              Permanent Deletion
            </h2>

            <p className="mt-3 text-red-700 leading-7">

              This photo will be permanently removed
              from the job history.

            </p>

            <ul className="mt-5 list-disc space-y-2 pl-6 text-red-700">

              <li>
                The photo cannot be recovered.
              </li>

              <li>
                It will no longer appear in the
                job gallery.
              </li>

              <li>
                Any reports or documentation
                referencing this image may become
                incomplete.
              </li>

              <li>
                This action is irreversible.
              </li>

            </ul>

          </div>

        </div>

      </div>

      <form
        action={deletePhoto}
        className="flex justify-end gap-4 border-t pt-8"
      >

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
          bg-red-600
          px-6
          py-3
          font-medium
          text-white
          transition
          hover:bg-red-700
          "
        >
          Permanently Delete Photo
        </button>

      </form>

    </div>

  )

}