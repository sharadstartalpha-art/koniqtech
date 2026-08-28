import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JobReportPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    totalJobs,

    scheduledJobs,

    inProgressJobs,

    completedJobs,

    cancelledJobs,

    jobs,

  ] = await Promise.all([

    prisma.job.count({

      where: {

        orgId,

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "scheduled",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "in_progress",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "completed",

      },

    }),

    prisma.job.count({

      where: {

        orgId,

        status: "cancelled",

      },

    }),

    prisma.job.findMany({

      where: {

        orgId,

      },

      include: {

        customer: {

          select: {

            companyName: true,

            firstName: true,

            lastName: true,

          },

        },

      },

      orderBy: {

        createdAt: "desc",

      },

    }),

  ]);

  const completionRate =

    totalJobs === 0

      ? 0

      : (completedJobs / totalJobs) * 100;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Job Report
          </h1>

          <p className="mt-2 text-slate-600">
            Job performance, completion statistics and operational overview.
          </p>

        </div>

        <Link
          href="/reports"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Total Jobs
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Completed
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {completedJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            In Progress
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {inProgressJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Completion Rate
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {completionRate.toFixed(1)}%
          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Job Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Jobs</dt>

              <dd className="font-semibold">
                {totalJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Scheduled</dt>

              <dd className="font-semibold text-orange-600">
                {scheduledJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>In Progress</dt>

              <dd className="font-semibold text-blue-600">
                {inProgressJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Completed</dt>

              <dd className="font-semibold text-green-600">
                {completedJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Cancelled</dt>

              <dd className="font-semibold text-red-600">
                {cancelledJobs}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Performance Metrics
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Completion Rate</dt>

              <dd className="font-semibold text-green-600">
                {completionRate.toFixed(1)}%
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Active Jobs</dt>

              <dd className="font-semibold">
                {scheduledJobs + inProgressJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Finished Jobs</dt>

              <dd className="font-semibold">
                {completedJobs + cancelledJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Open Jobs</dt>

              <dd className="font-semibold text-orange-600">
                {totalJobs - completedJobs - cancelledJobs}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Recent Jobs
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Job
              </th>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                        {jobs.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No jobs found.
                </td>

              </tr>

            )}

            {jobs.map((job) => (

              <tr
                key={job.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/jobs/${job.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {job.title}
                  </Link>

                </td>

                <td className="px-6 py-4">

                  {job.customer.companyName ||

                    `${job.customer.firstName} ${job.customer.lastName ?? ""}`}

                </td>

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                    ${
                      job.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : job.status === "scheduled"
                        ? "bg-orange-100 text-orange-700"
                        : job.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {job.status
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-end">

                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}