import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    crewId: string;
  }>;
}

export default async function CrewDetailsPage({
  params,
}: PageProps) {

  const { crewId } =
    await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const crew =
    await prisma.crewMember.findFirst({

      where: {

        id: crewId,

        orgId,

      },

      include: {

        assignments: {

          include: {

            job: {

              select: {

                id: true,

                title: true,

                status: true,

                scheduledDate: true,

              },

            },

          },

          orderBy: {

            assignedAt: "desc",

          },

        },

      },

    });

  if (!crew) {
    notFound();
  }

  const totalAssignments =
    crew.assignments.length;

  const scheduledJobs =
    crew.assignments.filter(

      (assignment) =>
        assignment.job.status ===
        "scheduled"

    ).length;

  const completedJobs =
    crew.assignments.filter(

      (assignment) =>
        assignment.job.status ===
        "completed"

    ).length;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            {crew.name}

          </h1>

          <p className="mt-2 text-slate-600">

            Crew Member Details

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/crew/${crew.id}/edit`}
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Edit
          </Link>

          <Link
            href={`/crew/${crew.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Jobs
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalAssignments}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Scheduled
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {scheduledJobs}
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
            Status
          </p>

          <div className="mt-4">

            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                crew.active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {crew.active
                ? "Active"
                : "Inactive"}
            </span>

          </div>

        </div>

      </div>
            <div className="grid gap-8 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Crew Information
          </h2>

          <div className="space-y-6">

            <div>

              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="mt-1 text-lg font-medium">
                {crew.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="mt-1">
                {crew.role}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1">
                {crew.email ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p className="mt-1">
                {crew.phone ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-1">
                {crew.createdAt.toLocaleDateString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Last Updated
              </p>

              <p className="mt-1">
                {crew.updatedAt.toLocaleDateString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                  crew.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {crew.active
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>

        </div>

        <div className="lg:col-span-2 rounded-3xl border bg-white">

          <div className="border-b p-6">

            <h2 className="text-2xl font-semibold">
              Assigned Jobs
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Job
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left">
                    Scheduled
                  </th>

                  <th className="px-6 py-4 text-left">
                    Assigned
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {crew.assignments.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No jobs assigned.
                    </td>

                  </tr>

                )}

                {crew.assignments.map((assignment) => (

                  <tr
                    key={assignment.id}
                    className="border-b last:border-b-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 font-medium">

                      {assignment.job.title}

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm capitalize"
                      >
                        {assignment.job.status}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      {assignment.job.scheduledDate
                        ? assignment.job.scheduledDate.toLocaleDateString()
                        : "-"}

                    </td>

                    <td className="px-6 py-4">

                      {assignment.assignedAt.toLocaleDateString()}

                    </td>

                    <td className="px-6 py-4 text-right">

                      <Link
                        href={`/jobs/${assignment.job.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View Job
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
            <div className="flex items-center justify-between rounded-3xl border bg-white p-8">

        <div>

          <h2 className="text-2xl font-semibold">
            Crew Actions
          </h2>

          <p className="mt-2 text-slate-600">
            Update this crew member or remove them from your organization.
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <Link
            href="/crew"
            className="rounded-xl border px-6 py-3 font-medium hover:bg-slate-50"
          >
            Back to Crew
          </Link>

          <Link
            href={`/crew/${crew.id}/edit`}
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Edit Crew Member
          </Link>

          <Link
            href={`/crew/${crew.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Crew Member
          </Link>

        </div>

      </div>

    </div>

  );

}