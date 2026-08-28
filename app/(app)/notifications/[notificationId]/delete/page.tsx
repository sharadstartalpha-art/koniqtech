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

export default async function DeleteNotificationPage({
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

  async function deleteNotification() {

    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    await prisma.notification.delete({

      where: {
        id: notificationId,
      },

    });

    redirect("/notifications");

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Notification
          </h1>

          <p className="mt-2 text-slate-600">
            This action cannot be undone.
          </p>

        </div>

        <Link
          href={`/notifications/${notification.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <div className="rounded-3xl border border-red-300 bg-red-50 p-8">

        <h2 className="text-2xl font-bold text-red-700">
          Confirm Deletion
        </h2>

        <p className="mt-3 text-red-600">
          You are about to permanently delete this notification.
        </p>

        <dl className="mt-8 grid gap-6 md:grid-cols-2">

                      <div>

            <dt className="text-sm text-slate-500">
              Title
            </dt>

            <dd className="mt-1 font-medium">
              {notification.title}
            </dd>

          </div>

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
              Type
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

        <div className="mt-8 rounded-2xl border bg-white p-6">

          <h3 className="text-lg font-semibold">
            Message
          </h3>

          <p className="mt-4 whitespace-pre-wrap text-slate-700">
            {notification.message}
          </p>

        </div>

        <div className="mt-8 rounded-2xl border border-red-300 bg-white p-6">

          <p className="font-medium text-red-700">
            Deleting this notification will permanently remove it from the system.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">

            <li>
              The notification cannot be recovered.
            </li>

            <li>
              Users will no longer be able to view it.
            </li>

            <li>
              This action is permanent.
            </li>

          </ul>

        </div>

      </div>

      <form
        action={deleteNotification}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/notifications/${notification.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Notification
        </button>
              </form>

    </div>

  );

}