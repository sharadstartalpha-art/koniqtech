import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const userId = session.user.id;

  const notifications =
    await prisma.notification.findMany({

      where: {
        orgId,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });

  const totalNotifications =
    notifications.length;

  const unreadNotifications =
    notifications.filter(
      (notification) => !notification.read,
    ).length;

  const readNotifications =
    notifications.filter(
      (notification) => notification.read,
    ).length;

  const personalNotifications =
    notifications.filter(
      (notification) =>
        notification.userId === userId,
    ).length;

  const organizationNotifications =
    notifications.filter(
      (notification) =>
        notification.userId === null,
    ).length;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage organization and personal notifications.
          </p>

        </div>

        <Link
          href="/notifications/create"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          New Notification
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Total
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalNotifications}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Unread
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-600">
            {unreadNotifications}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Read
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {readNotifications}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Personal
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {personalNotifications}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Organization
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {organizationNotifications}
          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Notification Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Notifications</dt>

              <dd className="font-semibold">
                {totalNotifications}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Unread</dt>

              <dd className="font-semibold text-red-600">
                {unreadNotifications}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Read</dt>

              <dd className="font-semibold text-green-600">
                {readNotifications}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Personal</dt>

              <dd className="font-semibold text-blue-600">
                {personalNotifications}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Organization</dt>

              <dd className="font-semibold text-purple-600">
                {organizationNotifications}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Read Status
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Unread Notifications</dt>

              <dd>

                {totalNotifications === 0
                  ? "0%"
                  : `${((unreadNotifications / totalNotifications) * 100).toFixed(1)}%`}

              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Read Notifications</dt>

              <dd>

                {totalNotifications === 0
                  ? "0%"
                  : `${((readNotifications / totalNotifications) * 100).toFixed(1)}%`}

              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Personal Notifications</dt>

              <dd>

                {totalNotifications === 0
                  ? "0%"
                  : `${((personalNotifications / totalNotifications) * 100).toFixed(1)}%`}

              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Organization Notifications</dt>

              <dd>

                {totalNotifications === 0
                  ? "0%"
                  : `${((organizationNotifications / totalNotifications) * 100).toFixed(1)}%`}

              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Notifications
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="px-6 py-4 text-left">
                Type
              </th>

              <th className="px-6 py-4 text-left">
                Recipient
              </th>

              <th className="px-6 py-4 text-center">
                Status
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
                        {notifications.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No notifications found.
                </td>

              </tr>

            )}

            {notifications.map((notification) => (

              <tr
                key={notification.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div>

                    <Link
                      href={`/notifications/${notification.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {notification.title}
                    </Link>

                    <p className="mt-1 max-w-lg truncate text-sm text-slate-500">
                      {notification.message}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-4">

                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">
                    {notification.type}
                  </span>

                </td>

                <td className="px-6 py-4">

                  {notification.user
                    ? notification.user.name
                    : "Organization"}

                </td>

                <td className="px-6 py-4 text-center">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      notification.read
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {notification.read ? "Read" : "Unread"}
                  </span>

                </td>

                <td className="px-6 py-4 text-sm text-slate-500">

                  {notification.createdAt.toLocaleDateString()}

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-3">

                    <Link
                      href={`/notifications/${notification.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/notifications/${notification.id}/edit`}
                      className="text-amber-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/notifications/${notification.id}/delete`}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </Link>

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