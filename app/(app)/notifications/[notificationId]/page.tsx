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
    notificationId: string;
  }>;
}

export default async function NotificationPage({
  params,
}: PageProps) {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const { notificationId } =
    await params;

  const notification =
    await prisma.notification.findFirst({

      where: {
        id: notificationId,
        orgId,
      },

      include: {
        user: true,
      },

    });

  if (!notification) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            {notification.title}
          </h1>

          <p className="mt-2 text-slate-600">
            Notification Details
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/notifications/${notification.id}/edit`}
            className="rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600"
          >
            Edit
          </Link>

          <Link
            href={`/notifications/${notification.id}/delete`}
            className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

          <Link
            href="/notifications"
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Notification Information
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">
                      <div>

            <dt className="text-sm text-slate-500">
              Recipient
            </dt>

            <dd className="mt-1 font-medium">

              {notification.user
                ? notification.user.name
                : "Entire Organization"}

            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Notification Type
            </dt>

            <dd className="mt-1">

              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">
                {notification.type}
              </span>

            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Status
            </dt>

            <dd className="mt-1">

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  notification.read
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {notification.read
                  ? "Read"
                  : "Unread"}
              </span>

            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Created
            </dt>

            <dd className="mt-1 font-medium">
              {notification.createdAt.toLocaleString()}
            </dd>

          </div>

        </dl>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Message
        </h2>

        <div className="rounded-2xl border bg-slate-50 p-6">

          <p className="whitespace-pre-wrap leading-7 text-slate-700">
            {notification.message}
          </p>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Summary
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

          <div>

            <dt className="text-sm text-slate-500">
              Notification ID
            </dt>

            <dd className="mt-1 font-mono text-sm">
              {notification.id}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Organization Scope
            </dt>

            <dd className="mt-1 font-medium">
              {notification.user
                ? "Personal Notification"
                : "Organization-wide Notification"}
            </dd>

          </div>

        </dl>

      </div>
            </div>



  );

}