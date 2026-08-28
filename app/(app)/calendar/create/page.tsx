import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreateCalendarEventPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const [users, jobs] = await Promise.all([
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

  async function createEvent(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const orgId = session.user.orgId;

    const title = formData.get("title")?.toString().trim() ?? "";

    const startTime = formData.get("startTime")?.toString() ?? "";

    const endTime = formData.get("endTime")?.toString() ?? "";

    const userId =
      formData.get("userId")?.toString().trim() || null;

    const jobId =
      formData.get("jobId")?.toString().trim() || null;

    if (!title) {
      throw new Error("Title is required.");
    }

    if (!startTime) {
      throw new Error("Start time is required.");
    }

    if (!endTime) {
      throw new Error("End time is required.");
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date/time.");
    }

    if (end <= start) {
      throw new Error("End time must be after start time.");
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
        throw new Error("Selected user not found.");
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
        throw new Error("Selected job not found.");
      }
    }

    await prisma.event.create({
      data: {
        orgId,
        title,
        startTime: start,
        endTime: end,
        userId,
        jobId,
      },
    });

    redirect("/calendar");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Create Calendar Event
          </h1>

          <p className="text-muted-foreground">
            Schedule a new calendar event.
          </p>
        </div>

        <Link
          href="/calendar"
          className="rounded-lg border px-4 py-2 hover:bg-muted"
        >
          Back
        </Link>
      </div>

      <form
        action={createEvent}
        className="space-y-6 rounded-xl border bg-background p-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title *
            </label>

            <input
              name="title"
              required
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Event title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assigned User
            </label>

            <select
              name="userId"
              className="w-full rounded-lg border px-3 py-2"
              defaultValue=""
            >
              <option value="">
                None
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Related Job
            </label>

            <select
              name="jobId"
              className="w-full rounded-lg border px-3 py-2"
              defaultValue=""
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

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Start Time *
            </label>

            <input
              type="datetime-local"
              name="startTime"
              required
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              End Time *
            </label>

            <input
              type="datetime-local"
              name="endTime"
              required
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
          >
            Create Event
          </button>

          <Link
            href="/calendar"
            className="rounded-lg border px-5 py-2 hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}