import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    dispatchId: string;
  }>;
}

export default async function DeleteDispatchPage({
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

          },

        },

        jobs: {

          include: {

            job: {

              include: {

                customer: {

                  select: {

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

  async function deleteDispatch() {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    await prisma.$transaction(

      async (tx) => {

        await tx.dispatchJob.deleteMany({

          where: {

            dispatchBoardId:
              dispatchId,

          },

        });

        await tx.dispatchBoard.delete({

          where: {

            id: dispatchId,

            orgId,

          },

        });

      }

    );

    redirect("/dispatch");

  }

  const completedJobs =
    dispatchBoard.jobs.filter(
      (job) =>
        job.status === "Completed"
    ).length;

  const assignedJobs =
    dispatchBoard.jobs.filter(
      (job) => job.technicianId
    ).length;

      return (

    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Dispatch Board
          </h1>

          <p className="mt-2 text-slate-600">
            This action permanently removes the dispatch board and all
            assigned dispatch records.
          </p>

        </div>

        <Link
          href={`/dispatch/${dispatchBoard.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Warning
        </h2>

        <p className="mt-3 text-red-700">

          Deleting this dispatch board will permanently remove every
          dispatch assignment associated with it.

        </p>

        <p className="mt-2 text-red-700">

          This operation cannot be undone.

        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Total Jobs
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Assigned
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {assignedJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Completed
          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">
            {completedJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Dispatch Date
          </p>

          <h2 className="mt-3 text-xl font-bold">
            {dispatchBoard.dispatchDate.toLocaleDateString()}
          </h2>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

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
              Created By
            </p>

            <p className="mt-1 font-semibold">
              {dispatchBoard.createdBy.name}
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

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-6 py-5">

          <h2 className="text-2xl font-semibold">
            Jobs To Be Deleted
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="bg-slate-50">

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
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {dispatchBoard.jobs.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No dispatch jobs found.
                </td>

              </tr>

            )}

            {dispatchBoard.jobs.map((dispatchJob) => (

              <tr
                key={dispatchJob.id}
                className="border-t"
              >

                                <td className="px-6 py-4 font-medium">

                  {dispatchJob.job.title}

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

      <form
        action={deleteDispatch}
        className="flex items-center justify-end gap-4"
      >

        <Link
          href={`/dispatch/${dispatchBoard.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Dispatch Board
        </button>

      </form>

    </div>

  );

}