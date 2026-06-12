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
        customer: true
      },

      orderBy: {
        createdAt: "desc"
      }

    })

  const columns = [

    {
      key: "scheduled",
      label: "Scheduled"
    },

    {
      key: "in_progress",
      label: "In Progress"
    },

    {
      key: "completed",
      label: "Completed"
    },

    {
      key: "cancelled",
      label: "Cancelled"
    }

  ]

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <h1 className="text-5xl font-bold">
          Job Board
        </h1>

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

      <div className="grid grid-cols-4 gap-6">

        {columns.map(column => {

          const columnJobs =
            jobs.filter(
              job => job.status === column.key
            )

          return (

            <div
              key={column.key}
              className="
              bg-white
              border
              rounded-3xl
              p-5
              "
            >

              <div className="flex items-center justify-between mb-5">

                <h2 className="font-bold text-lg">
                  {column.label}
                </h2>

                <span
                  className="
                  bg-slate-100
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  "
                >
                  {columnJobs.length}
                </span>

              </div>

              <div className="space-y-3">

                {columnJobs.length === 0 && (

                  <div
                    className="
                    border
                    border-dashed
                    rounded-xl
                    p-4
                    text-center
                    text-slate-400
                    "
                  >
                    No jobs
                  </div>

                )}

                {columnJobs.map(job => (

                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="
                    block
                    border
                    rounded-xl
                    p-4
                    hover:bg-slate-50
                    "
                  >

                    <div className="font-medium">
                      {job.title}
                    </div>

                    <div
                      className="
                      text-sm
                      text-slate-500
                      mt-1
                      "
                    >
                      {job.customer.firstName}
                      {" "}
                      {job.customer.lastName}
                    </div>

                    {job.scheduledDate && (

                      <div
                        className="
                        text-xs
                        text-slate-400
                        mt-2
                        "
                      >
                        {new Date(
                          job.scheduledDate
                        ).toLocaleDateString()}
                      </div>

                    )}

                  </Link>

                ))}

              </div>

            </div>

          )

        })}

      </div>

    </div>

  )

}