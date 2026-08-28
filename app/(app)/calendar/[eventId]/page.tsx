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

export default async function CalendarEventPage({
  params,
}: PageProps) {

  const { eventId } =
    await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const event =
    await prisma.event.findFirst({

      where: {

        id: eventId,

        orgId,

      },

      include: {

        user: {

          select: {

            id: true,

            name: true,

            email: true,

          },

        },

        job: {

          select: {

            id: true,

            title: true,

            status: true,

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

      },

    });

  if (!event) {
    notFound();
  }

  const durationHours =
    (
      (event.endTime.getTime() -
        event.startTime.getTime()) /
      1000 /
      60 /
      60
    ).toFixed(1);

  const isUpcoming =
    event.startTime >
    new Date();

  const isInProgress =

    new Date() >= event.startTime &&

    new Date() <= event.endTime;

  const isCompleted =
    event.endTime <
    new Date();

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            {event.title}

          </h1>

          <p className="mt-2 text-slate-600">

            Calendar event details.

          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/calendar/${event.id}/edit`}
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Edit
          </Link>

          <Link
            href={`/calendar/${event.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>
            <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Duration
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {durationHours} hrs
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Assigned User
          </p>

          <h2 className="mt-3 text-2xl font-bold">

            {event.user?.name ?? "Unassigned"}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Related Job
          </p>

          <h2 className="mt-3 text-2xl font-bold">

            {event.job?.title ?? "None"}

          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Status
          </p>

          <span
            className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-medium
            ${
              isUpcoming
                ? "bg-blue-100 text-blue-700"
                : isInProgress
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isUpcoming
              ? "Upcoming"
              : isInProgress
              ? "In Progress"
              : "Completed"}
          </span>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Event Details
          </h2>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-slate-500">
                Title
              </p>

              <p className="mt-1 font-semibold">
                {event.title}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Start Time
              </p>

              <p className="mt-1">
                {event.startTime.toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                End Time
              </p>

              <p className="mt-1">
                {event.endTime.toLocaleString()}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Assignment
          </h2>

          <div className="space-y-5">

            <div>

              <p className="text-sm text-slate-500">
                Assigned User
              </p>

              <p className="mt-1 font-semibold">

                {event.user?.name ?? "Unassigned"}

              </p>

              <p className="text-sm text-slate-500">

                {event.user?.email ?? ""}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Related Job
              </p>

              {event.job ? (

                <Link
                  href={`/jobs/${event.job.id}`}
                  className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                >
                  {event.job.title}
                </Link>

              ) : (

                <p className="mt-1">
                  None
                </p>

              )}

            </div>

            {event.job && (

              <div>

                <p className="text-sm text-slate-500">
                  Customer
                </p>

                <p className="mt-1">

                  {event.job.customer.companyName ??

                    `${event.job.customer.firstName} ${event.job.customer.lastName ?? ""}`}

                </p>

              </div>

            )}

          </div>

        </div>

      </div>
            <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            href="/calendar"
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Back to Calendar
          </Link>

          <Link
            href={`/calendar/${event.id}/edit`}
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Edit Event
          </Link>

          <Link
            href={`/calendar/${event.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Event
          </Link>

          {event.job && (

            <Link
              href={`/jobs/${event.job.id}`}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              View Job
            </Link>

          )}

        </div>

      </div>

    </div>

  );

}