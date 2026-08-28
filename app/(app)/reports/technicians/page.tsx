import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TechnicianReportPage() {

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    totalTechnicians,

    dispatchJobs,

    completedJobs,

    technicians,

  ] = await Promise.all([

    prisma.user.count({

    where:{

        orgId,

        employee:{
            role:{
                name:"Technician"
            }
        }

    }

}),

    prisma.dispatchJob.count({

      where: {

        dispatchBoard: {

          orgId,

        },

      },

    }),

    prisma.dispatchJob.count({

      where: {

        dispatchBoard: {

          orgId,

        },

        status: "completed",

      },

    }),

    prisma.user.findMany({
  where: {
    orgId,

    employee: {
      role: {
        name: "Technician",
      },
    },
  },

  include: {

    employee: {
      include: {
        role: true,
      },
    },

    dispatchJobs: {
      include: {
        job: true,
      },
    },

  },

  orderBy: {
    name: "asc",
  },

}),

  ]);

  const activeDispatches =

    dispatchJobs -
    completedJobs;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Technician Report
          </h1>

          <p className="mt-2 text-slate-600">
            Technician workload, assignments and field performance.
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
            Technicians
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalTechnicians}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Assigned Jobs
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {dispatchJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Completed Jobs
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {completedJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Active Dispatches
          </p>

          <h2 className="mt-3 text-4xl font-bold text-orange-600">
            {activeDispatches}
          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Technician Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Technicians</dt>

              <dd className="font-semibold">
                {totalTechnicians}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Assigned Jobs</dt>

              <dd className="font-semibold text-blue-600">
                {dispatchJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Completed Jobs</dt>

              <dd className="font-semibold text-green-600">
                {completedJobs}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Active Dispatches</dt>

              <dd className="font-semibold text-orange-600">
                {activeDispatches}
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

              <dt>Average Jobs / Technician</dt>

              <dd className="font-semibold">
                {totalTechnicians === 0
                  ? "0"
                  : (
                      dispatchJobs /
                      totalTechnicians
                    ).toFixed(1)}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Completion Rate</dt>

              <dd className="font-semibold text-green-600">

                {dispatchJobs === 0
                  ? "0%"
                  : `${(
                      (completedJobs /
                        dispatchJobs) *
                      100
                    ).toFixed(1)}%`}

              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Open Assignments</dt>

              <dd className="font-semibold text-orange-600">
                {activeDispatches}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Technician Performance
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Technician
              </th>

              <th className="px-6 py-4 text-right">
                Assigned Jobs
              </th>

              <th className="px-6 py-4 text-right">
                Completed
              </th>

              <th className="px-6 py-4 text-right">
                Active
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                        {technicians.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No technicians found.
                </td>

              </tr>

            )}

            {technicians.map((technician) => {

              const assignedJobs =
                technician.dispatchJobs.length;

              const completed =
                technician.dispatchJobs.filter(
                  (dispatchJob) =>
                    dispatchJob.status === "completed",
                ).length;

              const active =
                assignedJobs - completed;

              return (

                <tr
                  key={technician.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">

                    <Link
                      href={`/users/${technician.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {technician.name}
                    </Link>

                  </td>

                  <td className="px-6 py-4 text-right">
                    {assignedJobs}
                  </td>

                  <td className="px-6 py-4 text-right text-green-600 font-semibold">
                    {completed}
                  </td>

                  <td className="px-6 py-4 text-right text-orange-600 font-semibold">
                    {active}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-end">

                      <Link
                        href={`/users/${technician.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View
                      </Link>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}