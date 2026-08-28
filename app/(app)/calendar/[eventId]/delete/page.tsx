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

export default async function DeleteCalendarEventPage({
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

          },

        },

        job: {

          select: {

            id: true,

            title: true,

          },

        },

      },

    });

  if (!event) {
    notFound();
  }

  const currentEvent =
    event;

  async function deleteEvent() {
    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const orgId =
      session.user.orgId;

    const existing =
      await prisma.event.findFirst({

        where: {

          id: currentEvent.id,

          orgId,

        },

        select: {

          id: true,

        },

      });

    if (!existing) {
      notFound();
    }
        await prisma.event.delete({

      where: {

        id: existing.id,

      },

    });

    redirect("/calendar");

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Event
          </h1>

          <p className="mt-2 text-slate-600">
            This action cannot be undone.
          </p>

        </div>

        <Link
          href={`/calendar/${currentEvent.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="mb-6 text-2xl font-bold text-red-700">
          Are you sure you want to delete this event?
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

          <div>

            <dt className="text-sm text-slate-500">
              Title
            </dt>

            <dd className="mt-1 font-semibold">
              {currentEvent.title}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Assigned User
            </dt>

            <dd className="mt-1 font-semibold">
              {currentEvent.user?.name ?? "-"}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Related Job
            </dt>

            <dd className="mt-1 font-semibold">
              {currentEvent.job?.title ?? "-"}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Start Time
            </dt>

            <dd className="mt-1">
              {currentEvent.startTime.toLocaleString()}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              End Time
            </dt>

            <dd className="mt-1">
              {currentEvent.endTime.toLocaleString()}
            </dd>

          </div>

        </dl>

        <div className="mt-8">
                      <form action={deleteEvent}>

            <div className="flex flex-wrap gap-4">

              <button
                type="submit"
                className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
              >
                Delete Event
              </button>

              <Link
                href={`/calendar/${currentEvent.id}`}
                className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>

  );

}