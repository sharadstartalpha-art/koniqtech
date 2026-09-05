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
    user?: string;
  }>;
}

export default async function CalendarPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
    user = "",
  } = await searchParams;

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

if (!canView(permissions, "Calendar", isOwner)) {
  redirect("/unauthorized");
}

const orgId = dbUser.orgId;

if (!orgId) {
  redirect("/welcome");
}

  const where: Prisma.EventWhereInput = {
  orgId,

  ...(search
    ? {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {}),

  ...(user
    ? {
        userId: user,
      }
    : {}),
};

  const [

    events,

    totalEvents,

    users,

  ] = await Promise.all([

    prisma.event.findMany({

      where,

      include: {

        user: {

          select: {

            id: true,

            name: true,

          },

        },

        job: {

          select: {

            id: true,

            title: true,

          },

        },

      },

      orderBy: {

        startTime: "asc",

      },

    }),

    prisma.event.count({

      where,

    }),

    prisma.user.findMany({

      where: {

        orgId,

      },

      select: {

        id: true,

        name: true,

      },

      orderBy: {

        name: "asc",

      },

    }),

  ]);

  const upcomingEvents =
    events.filter(
      (event) =>
        event.startTime >=
        new Date()
    ).length;

  const today = new Date();

  const todayEvents =
    events.filter((event) => {

      const d = event.startTime;

      return (

        d.getFullYear() ===
          today.getFullYear() &&

        d.getMonth() ===
          today.getMonth() &&

        d.getDate() ===
          today.getDate()

      );

    }).length;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Calendar
          </h1>

          <p className="mt-2 text-slate-600">
            Manage schedules, appointments and job events.
          </p>

        </div>

       {canCreate(permissions, "Calendar", isOwner) && (
  <Link
    href="/calendar/create"
    className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
  >
    New Event
  </Link>
)}

      </div>

            <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Events
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalEvents}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Today's Events
          </p>

          <h2 className="mt-3 text-5xl font-bold text-blue-600">
            {todayEvents}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Upcoming Events
          </p>

          <h2 className="mt-3 text-5xl font-bold text-green-600">
            {upcomingEvents}
          </h2>

        </div>

      </div>

      <form
        className="flex flex-col gap-4 lg:flex-row"
      >

        <input
          type="text"
          name="search"
          placeholder="Search event..."
          defaultValue={search}
          className="flex-1 rounded-xl border px-5 py-3"
        />

        <select
          name="user"
          defaultValue={user}
          className="rounded-xl border px-5 py-3"
        >

          <option value="">
            All Users
          </option>

          {users.map((u) => (

            <option
              key={u.id}
              value={u.id}
            >
              {u.name}
            </option>

          ))}

        </select>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Search
        </button>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Event
              </th>

              <th className="px-6 py-4 text-left">
                User
              </th>

              <th className="px-6 py-4 text-left">
                Job
              </th>

              <th className="px-6 py-4 text-left">
                Start
              </th>

              <th className="px-6 py-4 text-left">
                End
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                        {events.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No calendar events found.
                </td>

              </tr>

            )}

            {events.map((event) => (

              <tr
                key={event.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/calendar/${event.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {event.title}
                  </Link>

                </td>

                <td className="px-6 py-4">

                  {event.user?.name ?? "-"}

                </td>

                <td className="px-6 py-4">

                  {event.job ? (

                    <Link
                      href={`/jobs/${event.job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {event.job.title}
                    </Link>

                  ) : (

                    "-"

                  )}

                </td>

                <td className="px-6 py-4">

                  {event.startTime.toLocaleString()}

                </td>

                <td className="px-6 py-4">

                  {event.endTime.toLocaleString()}

                </td>

                <td className="px-6 py-4 text-right">

                  <div className="flex items-center justify-end gap-4">

  <Link
    href={`/calendar/${event.id}`}
    className="font-medium text-blue-600 hover:underline"
  >
    View
  </Link>

  {canEdit(permissions, "Calendar", isOwner) && (
    <Link
      href={`/calendar/${event.id}/edit`}
      className="font-medium text-orange-600 hover:underline"
    >
      Edit
    </Link>
  )}

  {canDelete(permissions, "Calendar", isOwner) && (
    <Link
      href={`/calendar/${event.id}/delete`}
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