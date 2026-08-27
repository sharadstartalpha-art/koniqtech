import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    dispatchId: string;
  }>;
}

export default async function DispatchDetailsPage({
  params,
}: PageProps) {

  const { dispatchId } =
    await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const dispatchBoard =
    await prisma.dispatchBoard.findFirst({

      where: {
        id: dispatchId,
        orgId,
      },

      include: {

        createdBy: {

          select: {
            id: true,
            name: true,
            email: true,
          },

        },

        jobs: {

          include: {

            job: {

              include: {

                customer: {

                  select: {
                    id: true,
                    companyName: true,
                    firstName: true,
                    lastName: true,
                  },

                },

              },

            },

            technician: {

              select: {
                id: true,
                name: true,
                email: true,
              },

            },

            vehicle: {

              select: {
                id: true,
                name: true,
              },

            },

          },

          orderBy: {

            priority: "asc",

          },

        },

      },

    });

  if (!dispatchBoard) {
    notFound();
  }

  const totalJobs =
    dispatchBoard.jobs.length;

  const completedJobs =
    dispatchBoard.jobs.filter(
      (j) =>
        j.status.toLowerCase() ===
        "completed"
    ).length;

  const assignedJobs =
    dispatchBoard.jobs.filter(
      (j) => j.technicianId
    ).length;

  const unassignedJobs =
    totalJobs - assignedJobs;

      return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            {dispatchBoard.title}

          </h1>

          <p className="mt-2 text-slate-600">

            Dispatch Board Details

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href="/dispatch"
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            href={`/dispatch/${dispatchBoard.id}/edit`}
            className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600"
          >
            Edit
          </Link>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">

            Total Jobs

          </p>

          <h2 className="mt-3 text-5xl font-bold">

            {totalJobs}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">

            Assigned

          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">

            {assignedJobs}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">

            Completed

          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">

            {completedJobs}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">

            Unassigned

          </p>

          <h2 className="mt-3 text-5xl font-bold text-red-600">

            {unassignedJobs}

          </h2>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-8 lg:col-span-2">

          <h2 className="mb-6 text-2xl font-semibold">

            Dispatch Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">

                Title

              </p>

              <p className="mt-1 font-semibold">

                {dispatchBoard.title}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Dispatch Date

              </p>

              <p className="mt-1 font-semibold">

                {dispatchBoard.dispatchDate.toLocaleDateString()}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Created By

              </p>

              <p className="mt-1 font-semibold">

                {dispatchBoard.createdBy.name}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Email

              </p>

              <p className="mt-1">

                {dispatchBoard.createdBy.email}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Created

              </p>

              <p className="mt-1">

                {dispatchBoard.createdAt.toLocaleDateString()}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Last Updated

              </p>

              <p className="mt-1">

                {dispatchBoard.updatedAt.toLocaleDateString()}

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">

            Summary

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-500">

                Jobs

              </span>

              <span className="font-semibold">

                {totalJobs}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">

                Assigned

              </span>

              <span className="font-semibold">

                {assignedJobs}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">

                Completed

              </span>

              <span className="font-semibold">

                {completedJobs}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">

                Completion

              </span>

              <span className="font-semibold">

                {totalJobs === 0
                  ? 0
                  : Math.round(
                      (completedJobs / totalJobs) *
                        100
                    )}
                %
              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 py-5">

          <h2 className="text-2xl font-semibold">

            Assigned Jobs

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
                Technician
              </th>

              <th className="px-6 py-4 text-left">
                Vehicle
              </th>

              <th className="px-6 py-4 text-left">
                Priority
              </th>

              <th className="px-6 py-4 text-left">
                ETA
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

                      {dispatchBoard.jobs.length === 0 && (

            <tr>

              <td
                colSpan={7}
                className="px-6 py-12 text-center text-slate-500"
              >
                No jobs assigned to this dispatch board.
              </td>

            </tr>

          )}

          {dispatchBoard.jobs.map((dispatchJob) => (

            <tr
              key={dispatchJob.id}
              className="border-b last:border-b-0 hover:bg-slate-50"
            >

              <td className="px-6 py-4">

                <Link
                  href={`/jobs/${dispatchJob.job.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {dispatchJob.job.title}
                </Link>

              </td>

              <td className="px-6 py-4">

                {dispatchJob.job.customer.companyName ??
                  `${dispatchJob.job.customer.firstName} ${dispatchJob.job.customer.lastName ?? ""}`}

              </td>

              <td className="px-6 py-4">

                {dispatchJob.technician?.name ??
                  "Unassigned"}

              </td>

              <td className="px-6 py-4">

                {dispatchJob.vehicle?.name ??
                  "-"}

              </td>

              <td className="px-6 py-4">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                  ${
                    dispatchJob.priority === "Emergency"
                      ? "bg-red-100 text-red-700"
                      : dispatchJob.priority === "High"
                      ? "bg-orange-100 text-orange-700"
                      : dispatchJob.priority === "Normal"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {dispatchJob.priority}
                </span>

              </td>

              <td className="px-6 py-4">

                {dispatchJob.estimatedArrival
                  ? dispatchJob.estimatedArrival.toLocaleString()
                  : "-"}

              </td>

              <td className="px-6 py-4">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                  ${
                    dispatchJob.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : dispatchJob.status === "En Route"
                      ? "bg-blue-100 text-blue-700"
                      : dispatchJob.status === "Assigned"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {dispatchJob.status}
                </span>

              </td>

            </tr>

          ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}