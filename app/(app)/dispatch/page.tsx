import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { redirect } from "next/navigation";
import {
  canView,
  canCreate,
  canEdit,
  canDelete,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    date?: string;
  }>;
}

export default async function DispatchPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
    status = "",
    date = "",
  } = await searchParams;

  let startDate: Date | undefined;
let endDate: Date | undefined;

if (date) {
  startDate = new Date(date);

  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
}

 const session = await auth();

if (!session?.user) {
  redirect("/login");
}

const dbUser = await prisma.user.findUnique({
  where: {
    email: session.user.email!,
  },
  include: {
    organizationRole: {
      include: {
        permissions: true,
      },
    },
  },
});

if (!dbUser) {
  redirect("/login");
}

const permissions =
  dbUser.organizationRole?.permissions ?? [];

const isOwner =
  dbUser.organizationRole?.name === "Owner";

if (!canView(permissions, "Dispatch", isOwner)) {
  redirect("/unauthorized");
}

const orgId = dbUser.orgId;

if (!orgId) {
  redirect("/welcome");
}

 const where: Prisma.DispatchBoardWhereInput = {
  orgId,

  ...(search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            jobs: {
              some: {
                job: {
                  title: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          },
        ],
      }
    : {}),

    ...(status && {
    jobs: {
      some: {
        status,
      },
    },
  }),
  ...(date && {
    dispatchDate: {
      gte: startDate,
      lt: endDate,
    },
  }),
};

  const [

    dispatchBoards,

    totalBoards,

    totalJobs,

    completedJobs,

  ] = await Promise.all([

    prisma.dispatchBoard.findMany({

      where,

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

              select: {

                id: true,

                title: true,

                status: true,

              },

            },

            technician: {

              select: {

                id: true,

                name: true,

              },

            },

          },

        },

      },

      orderBy: {

        dispatchDate: "desc",

      },

    }),

    prisma.dispatchBoard.count({

      where,

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

  ]);
    return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Dispatch
          </h1>

          <p className="mt-2 text-slate-600">
            Manage daily dispatch boards and technician assignments.
          </p>

        </div>

       {canCreate(permissions, "Dispatch", isOwner) && (
  <Link
    href="/dispatch/create"
    className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
  >
    New Dispatch
  </Link>
)}

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Dispatch Boards
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalBoards}
          </h2>

        </div>

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
            Completed
          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">
            {completedJobs}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Completion Rate
          </p>

          <h2 className="mt-3 text-5xl font-bold">

            {totalJobs === 0
              ? 0
              : Math.round(
                  (completedJobs / totalJobs) *
                    100
                )}

            %

          </h2>

        </div>

      </div>

      <form className="grid gap-4 lg:grid-cols-4">

        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search dispatch..."
          className="rounded-xl border px-5 py-3"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border px-5 py-3"
        >

          <option value="">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="assigned">
            Assigned
          </option>

          <option value="enroute">
            En Route
          </option>

          <option value="onsite">
            On Site
          </option>

          <option value="completed">
            Completed
          </option>

        </select>

        <input
          type="date"
          name="date"
          defaultValue={date}
          className="rounded-xl border px-5 py-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-800"
        >
          Search
        </button>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Dispatch Date
              </th>

              <th className="px-6 py-4 text-left">
                Jobs
              </th>

              <th className="px-6 py-4 text-left">
                Created By
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {dispatchBoards.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No dispatch boards found.
                </td>

              </tr>

            )}

            {dispatchBoards.map((board) => (

              <tr
                key={board.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >
                                <td className="px-6 py-4">

                  <Link
                    href={`/dispatch/${board.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {board.title}
                  </Link>

                </td>

                <td className="px-6 py-4">

                  {board.dispatchDate.toLocaleDateString()}

                </td>

                <td className="px-6 py-4">

                  <div className="space-y-2">

                    {board.jobs.length === 0 ? (

                      <span className="text-slate-400">
                        No jobs
                      </span>

                    ) : (

                      board.jobs.slice(0, 3).map((dispatchJob) => (

                        <div
                          key={dispatchJob.id}
                          className="rounded-lg border bg-slate-50 p-2"
                        >

                          <div className="font-medium">

                            {dispatchJob.job.title}

                          </div>

                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                            <span>

                              {dispatchJob.technician?.name ??
                                "Unassigned"}

                            </span>

                            <span>•</span>

                            <span className="capitalize">

                              {dispatchJob.status}

                            </span>

                          </div>

                        </div>

                      ))

                    )}

                    {board.jobs.length > 3 && (

                      <div className="text-sm text-slate-500">

                        +{board.jobs.length - 3} more jobs

                      </div>

                    )}

                  </div>

                </td>

                <td className="px-6 py-4">

                  {board.createdBy.name}

                </td>

                <td className="px-6 py-4">

                  {board.createdAt.toLocaleDateString()}

                </td>

                <td className="px-6 py-4 text-right">

                 <div className="flex items-center justify-end gap-4">

  <Link
    href={`/dispatch/${board.id}`}
    className="font-medium text-blue-600 hover:underline"
  >
    View
  </Link>

  {canEdit(permissions, "Dispatch", isOwner) && (
    <Link
      href={`/dispatch/${board.id}/edit`}
      className="font-medium text-orange-600 hover:underline"
    >
      Edit
    </Link>
  )}

  {canDelete(permissions, "Dispatch", isOwner) && (
    <Link
      href={`/dispatch/${board.id}/delete`}
      className="font-medium text-red-600 hover:underline"
    >
      Delete
    </Link>
  )}

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