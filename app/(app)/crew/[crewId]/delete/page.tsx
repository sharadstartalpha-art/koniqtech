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
    crewId: string;
  }>;
}

export default async function DeleteCrewPage({
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

  const currentCrewId =
    crew.id;

  const assignedJobs =
    crew.assignments.length;

  async function deleteCrew() {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const existing =
      await prisma.crewMember.findFirst({

        where: {

          id: currentCrewId,

          orgId,

        },

        include: {

          assignments: true,

        },

      });

    if (!existing) {
      notFound();
    }

    if (
      existing.assignments.length > 0
    ) {

      throw new Error(
        "Cannot delete a crew member that is assigned to jobs."
      );

    }

    await prisma.crewMember.delete({

      where: {

        id: currentCrewId,

      },

    });

    redirect("/crew");

  }
    return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Crew Member
          </h1>

          <p className="mt-2 text-slate-600">
            This action cannot be undone.
          </p>

        </div>

        <Link
          href={`/crew/${crew.id}`}
          className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-xl font-semibold text-red-700">
          Warning
        </h2>

        <p className="mt-3 text-red-700">

          Deleting this crew member permanently removes the
          record from your organization.

        </p>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-xl font-semibold">
          Crew Member Details
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <p className="text-sm text-slate-500">
              Name
            </p>

            <p className="mt-1 font-semibold">
              {crew.name}
            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">
              Role
            </p>

            <p className="mt-1 font-semibold">
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
              Status
            </p>

            <span
              className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
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

          <div>

            <p className="text-sm text-slate-500">
              Assigned Jobs
            </p>

            <p className="mt-1 font-semibold">
              {assignedJobs}
            </p>

          </div>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-xl font-semibold">
          Job Assignments
        </h2>

        {crew.assignments.length === 0 ? (

          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-700">

            This crew member is not assigned to any jobs and
            can be safely deleted.

          </div>

        ) : (

          <div className="overflow-hidden rounded-2xl border">

            <table className="min-w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="px-5 py-3 text-left">
                    Job
                  </th>

                  <th className="px-5 py-3 text-left">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left">
                    Assigned
                  </th>

                </tr>

              </thead>

              <tbody>

                {crew.assignments.map((assignment) => (

                  <tr
                    key={assignment.id}
                    className="border-t"
                  >

                    <td className="px-5 py-4">
                      {assignment.job.title}
                    </td>

                    <td className="px-5 py-4 capitalize">
                      {assignment.job.status}
                    </td>

                    <td className="px-5 py-4">
                      {assignment.assignedAt.toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
            <form
        action={deleteCrew}
        className="flex items-center justify-end gap-4"
      >

        <Link
          href={`/crew/${crew.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

        {assignedJobs > 0 ? (

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-300 px-6 py-3 font-medium text-white"
          >
            Cannot Delete
          </button>

        ) : (

          <button
            type="submit"
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Crew Member
          </button>

        )}

      </form>

      {assignedJobs > 0 && (

        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">

          <h3 className="font-semibold text-amber-800">
            Deletion Blocked
          </h3>

          <p className="mt-2 text-sm text-amber-700">

            This crew member is currently assigned to one or more
            jobs.

          </p>

          <p className="mt-2 text-sm text-amber-700">

            Remove all job assignments before deleting this crew
            member.

          </p>

        </div>

      )}

    </div>

  );

}