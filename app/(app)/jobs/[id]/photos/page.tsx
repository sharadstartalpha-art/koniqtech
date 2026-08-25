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

export default async function JobPhotosPage({
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

  const photos =
    await prisma.userJobPhoto.findMany({

      where: {
        jobId: job.id,
      },

      include: {
        uploadedBy: true,
      },

      orderBy: {
        createdAt: "desc",
      },

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
            Job Photos
          </h1>

          <p className="mt-2 text-slate-500">
            Manage photos captured during the
            lifecycle of this job.
          </p>

        </div>

        <Link
          href={`/jobs/${job.id}/photos/upload`}
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
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Photos
          </p>

          <p className="mt-2 text-4xl font-bold">
            {photos.length}
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

      {photos.length === 0 ? (

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
                d="M3 7h4l2-2h6l2 2h4v12H3V7zm4 5a5 5 0 1010 0 5 5 0 00-10 0z"
              />

            </svg>

          </div>

          <h2 className="mt-6 text-2xl font-semibold">

            No Photos Uploaded

          </h2>

          <p className="mt-3 text-slate-500">

            Upload job photos to document
            installation progress and completed work.

          </p>

          <Link
            href={`/jobs/${job.id}/photos/upload`}
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
            Upload First Photo
          </Link>

        </div>

      ) : (
 <>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                      {photos.map((photo) => (

            <div
              key={photo.id}
              className="
              overflow-hidden
              rounded-3xl
              border
              bg-white
              shadow-sm
              transition
              hover:shadow-lg
              "
            >

              <div className="aspect-[4/3] bg-slate-100">

                {photo.imageUrl ? (

                  <img
                    src={photo.imageUrl}
                    alt={photo.title ?? "Job Photo"}
                    className="
                    h-full
                    w-full
                    object-cover
                    "
                  />

                ) : (

                  <div className="flex h-full items-center justify-center">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-14 w-14 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7h4l2-2h6l2 2h4v12H3V7zm4 5a5 5 0 1010 0 5 5 0 00-10 0z"
                      />

                    </svg>

                  </div>

                )}

              </div>

              <div className="space-y-5 p-6">

                <div>

                  <h3 className="text-lg font-semibold">

                    {photo.title ?? "Untitled Photo"}

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Uploaded{" "}

                    {new Date(
                      photo.createdAt
                    ).toLocaleString()}

                  </p>

                </div>

                <dl className="space-y-4">

                  <div className="flex justify-between gap-6">

                    <dt className="text-slate-500">
                      Uploaded By
                    </dt>

                    <dd className="text-right font-medium">

                      {photo.uploadedBy?.name ??
                        "Unknown User"}

                    </dd>

                  </div>

                 

                  <div className="flex justify-between gap-6">

  <dt className="text-slate-500">
    Category
  </dt>

  <dd className="capitalize">

    {photo.category ?? "-"}

  </dd>

</div>

                </dl>

                <div className="flex gap-2 pt-2">

                  <Link
                    href={`/jobs/${job.id}/photos/${photo.id}`}
                    className="
                    flex-1
                    rounded-xl
                    border
                    px-4
                    py-2
                    text-center
                    text-sm
                    hover:bg-slate-100
                    "
                  >
                    View
                  </Link>

                  <Link
                    href={`/jobs/${job.id}/photos/${photo.id}/edit`}
                    className="
                    flex-1
                    rounded-xl
                    border
                    px-4
                    py-2
                    text-center
                    text-sm
                    hover:bg-slate-100
                    "
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/jobs/${job.id}/photos/${photo.id}/delete`}
                    className="
                    flex-1
                    rounded-xl
                    border
                    border-red-300
                    px-4
                    py-2
                    text-center
                    text-sm
                    text-red-600
                    hover:bg-red-50
                    "
                  >
                    Delete
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>
              <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="text-xl font-semibold">
            Gallery Information
          </h2>

          <dl className="mt-8 space-y-5">

            <div className="flex justify-between">

              <dt className="text-slate-500">
                Total Photos
              </dt>

              <dd className="font-semibold">
                {photos.length}
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
            Photo Guidelines
          </h2>

          <div className="mt-6 space-y-4 text-sm text-blue-800">

            <p>

              Capture clear before, during,
              and after photos to document
              work completed.

            </p>

            <p>

              Use meaningful captions so
              technicians and office staff
              can quickly identify images.

            </p>

            <p>

              Avoid uploading duplicate
              photos or images unrelated
              to the current job.

            </p>

            <p>

              Photos become part of the
              permanent job history and
              should accurately represent
              the work performed.

            </p>

          </div>

        </div>

      </div>
</>
    )}

    </div>

  )

}