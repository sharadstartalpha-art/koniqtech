import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
} as const

export default async function JobsPage() {
  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if (!orgId) {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({
    where: {
      orgId,
    },
    include: {
      customer: true,
      technician: true,
      quote: {
        select: {
          quoteNumber: true,
        },
      },
      invoices: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const stats = {
    total: jobs.length,
    scheduled: jobs.filter(j => j.status === "scheduled").length,
    inProgress: jobs.filter(j => j.status === "in_progress").length,
    completed: jobs.filter(j => j.status === "completed").length,
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Jobs
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all service jobs
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            href="/jobs/board"
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Job Board
          </Link>

          <Link
            href="/jobs/create"
            className="rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            New Job
          </Link>

        </div>

      </div>

      <div className="grid grid-cols-4 gap-5">

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">
            Total Jobs
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">
            Scheduled
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.scheduled}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">
            In Progress
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.inProgress}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.completed}
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

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
                Quote
              </th>

              <th className="text-left">
                Technician
              </th>

              <th className="text-left">
                Scheduled
              </th>

              <th className="text-left">
                Invoice
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Created
              </th>

              <th className="text-right pr-6">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {jobs.map(job => {

              const invoice =
                job.invoices[0]

              return (

                <tr
                  key={job.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4">

                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {job.title}
                    </Link>

                  </td>

                  <td>
                    {job.customer.firstName}{" "}
                    {job.customer.lastName}
                  </td>

                  <td>
                    {job.quote?.quoteNumber ?? "-"}
                  </td>

                  <td>
                    {job.technician?.name ??
                      "Unassigned"}
                  </td>

                  <td>

                    {job.scheduledDate
                      ? new Date(
                          job.scheduledDate
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  <td>

                    {invoice ? (

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        {invoice.status}
                      </span>

                    ) : (

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        None
                      </span>

                    )}

                  </td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        statusColors[
                          job.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {job.status.replace("_", " ")}
                    </span>

                  </td>

                  <td>

                    {new Date(
                      job.createdAt
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    <div className="flex justify-end gap-2 pr-4">

                      <Link
                        href={`/jobs/${job.id}`}
                        className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-100"
                      >
                        View
                      </Link>

                      <Link
                        href={`/jobs/${job.id}/edit`}
                        className="rounded-lg border px-3 py-1 text-sm hover:bg-slate-100"
                      >
                        Edit
                      </Link>

                    </div>

                  </td>

                </tr>

              )

            })}

            {jobs.length === 0 && (

              <tr>

                <td
                  colSpan={9}
                  className="p-16 text-center"
                >

                  <h3 className="text-xl font-semibold">
                    No jobs yet
                  </h3>

                  <p className="mt-2 text-slate-500">
                    Create your first service job.
                  </p>

                  <Link
                    href="/jobs/create"
                    className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                  >
                    Create Job
                  </Link>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}