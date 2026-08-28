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
    eventId: string;
  }>;
}

export default async function EditCalendarEventPage({
  params,
}: PageProps) {

  const { eventId } =
    await params;

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    event,

    users,

    jobs,

  ] = await Promise.all([

    prisma.event.findFirst({

      where: {

        id: eventId,

        orgId,

      },

    }),

    prisma.user.findMany({

      where: {

        orgId,

        status: "active",

      },

      orderBy: {

        name: "asc",

      },

      select: {

        id: true,

        name: true,

      },

    }),

    prisma.job.findMany({

      where: {

        orgId,

      },

      orderBy: {

        title: "asc",

      },

      select: {

        id: true,

        title: true,

      },

    }),

  ]);

  if (!event) {
    notFound();
  }
const currentEvent = event;

  async function updateEvent(
    formData: FormData,
  ) {
    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const orgId =
      session.user.orgId;

    const title =
      formData.get("title")?.toString().trim() ?? "";

    const startTime =
      formData.get("startTime")?.toString() ?? "";

    const endTime =
      formData.get("endTime")?.toString() ?? "";

    const userId =
      formData.get("userId")?.toString().trim() || null;

    const jobId =
      formData.get("jobId")?.toString().trim() || null;

    if (!title) {
      throw new Error(
        "Title is required."
      );
    }

    const start =
      new Date(startTime);

    const end =
      new Date(endTime);

    if (
      isNaN(start.getTime()) ||
      isNaN(end.getTime())
    ) {
      throw new Error(
        "Invalid date/time."
      );
    }

    if (end <= start) {
      throw new Error(
        "End time must be after start time."
      );
    }
        if (userId) {

      const user = await prisma.user.findFirst({

        where: {

          id: userId,

          orgId,

        },

        select: {

          id: true,

        },

      });

      if (!user) {
        throw new Error(
          "Selected user not found."
        );
      }

    }

    if (jobId) {

      const job = await prisma.job.findFirst({

        where: {

          id: jobId,

          orgId,

        },

        select: {

          id: true,

        },

      });

      if (!job) {
        throw new Error(
          "Selected job not found."
        );
      }

    }

    await prisma.event.update({

      where: {

        id: currentEvent.id,

      },

      data: {

        title,

        startTime: start,

        endTime: end,

        userId,

        jobId,

      },

    });

    redirect(`/calendar/${currentEvent.id}`);

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Event
          </h1>

          <p className="mt-2 text-slate-600">
            Update calendar event details.
          </p>

        </div>

        <Link
          href={`/calendar/${event.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={updateEvent}
        className="rounded-3xl border bg-white p-8"
      >

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Title *
            </label>

            <input
              name="title"
              required
              defaultValue={event.title}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Assigned User
            </label>

            <select
              name="userId"
              defaultValue={event.userId ?? ""}
              className="w-full rounded-xl border px-4 py-3"
            >

              <option value="">
                Unassigned
              </option>

              {users.map((user) => (

                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>

              ))}

            </select>

          </div>
                    <div>

            <label className="mb-2 block text-sm font-medium">
              Related Job
            </label>

            <select
              name="jobId"
              defaultValue={event.jobId ?? ""}
              className="w-full rounded-xl border px-4 py-3"
            >

              <option value="">
                None
              </option>

              {jobs.map((job) => (

                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Start Time *
            </label>

            <input
              type="datetime-local"
              name="startTime"
              required
              defaultValue={event.startTime
                .toISOString()
                .slice(0, 16)}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              End Time *
            </label>

            <input
              type="datetime-local"
              name="endTime"
              required
              defaultValue={event.endTime
                .toISOString()
                .slice(0, 16)}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div className="mt-8 flex items-center gap-4">

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Save Changes
          </button>

          <Link
            href={`/calendar/${event.id}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>

  );

}