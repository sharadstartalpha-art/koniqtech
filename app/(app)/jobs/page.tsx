import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  const jobs =
    await prisma.job.findMany({

      where: {
        orgId
      },

      include: {
        customer: true,
        technician: true
      },

      orderBy: {
        createdAt: "desc"
      }

    })

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-semibold">
            Jobs
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all jobs
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href="/jobs/board"
            className="
            border
            px-5
            py-3
            rounded-xl
            "
          >
            Job Board
          </Link>

          <Link
            href="/jobs/create"
            className="
            bg-green-600
            text-white
            px-5
            py-3
            rounded-xl
            "
          >
            New Job
          </Link>

        </div>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">
                Job
              </th>

              <th className="text-left">
                Customer
              </th>

              <th className="text-left">
                Technician
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Created
              </th>

            </tr>

          </thead>

          <tbody>

            {jobs.map(job => (

              <tr
                key={job.id}
                className="border-t"
              >

                <td className="p-4">

                  <Link
                    href={`/jobs/${job.id}`}
                    className="
                    text-blue-600
                    hover:underline
                    "
                  >
                    {job.title}
                  </Link>

                </td>

                <td>
                  {job.customer.firstName}
                </td>

                <td>
                  {job.technician?.name ||
                    "Unassigned"}
                </td>

                <td>

                  <span
                    className="
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    bg-slate-100
                    "
                  >
                    {job.status}
                  </span>

                </td>

                <td>

                  {
                    new Date(
                      job.createdAt
                    ).toLocaleDateString()
                  }

                </td>

              </tr>

            ))}

            {jobs.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                  p-10
                  text-center
                  text-slate-500
                  "
                >
                  No jobs found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )
}