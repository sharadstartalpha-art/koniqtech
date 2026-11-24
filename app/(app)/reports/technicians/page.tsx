
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TechnicianReportPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const technicians = await prisma.user.findMany({
    where: {
      orgId,
      employee: {
        role: {
          name: "Technician",
        },
      },
    },
    select: {
      id: true,
      name: true,
      employee: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
      dispatchJobs: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Calculate assignments from technician records
  const technicianStats = technicians.map((technician) => {
    const assignedJobs = technician.dispatchJobs.length;

    const completed = technician.dispatchJobs.filter(
      (dispatch) => dispatch.status === "completed"
    ).length;

    const notCompleted = assignedJobs - completed;

    return {
      ...technician,
      assignedJobs,
      completed,
      notCompleted,
    };
  });

  // Organization technician metrics
  const totalTechnicians = technicianStats.length;

  const dispatchJobs = technicianStats.reduce(
    (sum, technician) => sum + technician.assignedJobs,
    0
  );

  const completedJobs = technicianStats.reduce(
    (sum, technician) => sum + technician.completed,
    0
  );

  const notCompletedJobs = dispatchJobs - completedJobs;

  const averageJobs =
    totalTechnicians === 0
      ? 0
      : dispatchJobs / totalTechnicians;

  const completionRate =
    dispatchJobs === 0
      ? 0
      : (completedJobs / dispatchJobs) * 100;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
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

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-500">
            Total Technicians
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
            Not Completed
          </p>

          <h2 className="mt-3 text-4xl font-bold text-orange-600">
            {notCompletedJobs}
          </h2>
        </div>

      </div>

      {/* Summary */}
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
              <dt>Not Completed</dt>
              <dd className="font-semibold text-orange-600">
                {notCompletedJobs}
              </dd>
            </div>

          </dl>

        </div>

        {/* Performance Metrics */}
        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Performance Metrics
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">
              <dt>Average Jobs / Technician</dt>
              <dd className="font-semibold">
                {averageJobs.toFixed(1)}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Completion Rate</dt>
              <dd className="font-semibold text-green-600">
                {completionRate.toFixed(1)}%
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Completed Assignments</dt>
              <dd className="font-semibold text-green-600">
                {completedJobs}
              </dd>
            </div>

            <div className="flex items-center justify-between">
              <dt>Remaining Assignments</dt>
              <dd className="font-semibold text-orange-600">
                {notCompletedJobs}
              </dd>
            </div>

          </dl>

        </div>

      </div>

      {/* Technician Performance Table */}
      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 md:px-8 py-6">

          <h2 className="text-2xl font-bold">
            Technician Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Individual technician assignment and completion statistics.
          </p>

        </div>

        <div className="overflow-x-auto">

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
                  Not Completed
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {technicianStats.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No technicians found.
                  </td>
                </tr>
              )}

              {technicianStats.map((technician) => (

                <tr
                  key={technician.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">

                    <Link
                      href={`/users/${technician.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {technician.name || "Unnamed Technician"}
                    </Link>

                  </td>

                  <td className="px-6 py-4 text-right">
                    {technician.assignedJobs}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-green-600">
                    {technician.completed}
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-orange-600">
                    {technician.notCompleted}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/users/${technician.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
