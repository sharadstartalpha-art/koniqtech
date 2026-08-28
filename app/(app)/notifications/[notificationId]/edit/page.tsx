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

export default async function EditNotificationPage({
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
const notificationRecordId  = notification.id;
  const users =
    await prisma.user.findMany({

      where: {
        orgId,
      },

      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        email: true,
      },

    });

  async function updateNotification(
    formData: FormData,
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const title =
      (formData.get("title") as string).trim();

    const message =
      (formData.get("message") as string).trim();

    const type =
      (formData.get("type") as string).trim();

    const userId =
      (formData.get("userId") as string) || null;

    const read =
      formData.get("read") === "on";

    if (
      !title ||
      !message ||
      !type
    ) {
      return;
    }

  await prisma.notification.update({
  where: {
    id: notificationRecordId,
  },
  data: {
    title,
    message,
    type,
    userId,
    read,
  },
});

redirect(`/notifications/${notificationId}`);
  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Notification
          </h1>

          <p className="mt-2 text-slate-600">
            Update notification details.
          </p>

        </div>

        <Link
          href={`/notifications/${notification.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={updateNotification}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >
                <div>

          <label
            htmlFor="userId"
            className="mb-2 block text-sm font-medium"
          >
            Recipient
          </label>

          <select
            id="userId"
            name="userId"
            defaultValue={notification.userId ?? ""}
            className="w-full rounded-xl border px-4 py-3"
          >

            <option value="">
              Entire Organization
            </option>

            {users.map((user) => (

              <option
                key={user.id}
                value={user.id}
              >
                {user.name} ({user.email})
              </option>

            ))}

          </select>

        </div>

        <div>

          <label
            htmlFor="type"
            className="mb-2 block text-sm font-medium"
          >
            Notification Type
          </label>

          <select
            id="type"
            name="type"
            required
            defaultValue={notification.type}
            className="w-full rounded-xl border px-4 py-3"
          >

            <option value="System">
              System
            </option>

            <option value="Alert">
              Alert
            </option>

            <option value="Reminder">
              Reminder
            </option>

            <option value="Job">
              Job
            </option>

            <option value="Invoice">
              Invoice
            </option>

            <option value="Payment">
              Payment
            </option>

            <option value="Dispatch">
              Dispatch
            </option>

            <option value="Customer">
              Customer
            </option>

          </select>

        </div>

        <div>

          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={notification.title}
            className="w-full rounded-xl border px-4 py-3"
          />

        </div>

        <div>

          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium"
          >
            Message
          </label>

          <textarea
            id="message"
            name="message"
            rows={8}
            required
            defaultValue={notification.message}
            className="w-full rounded-xl border px-4 py-3"
          />

        </div>

        <div className="flex items-center gap-3">

          <input
            id="read"
            name="read"
            type="checkbox"
            defaultChecked={notification.read}
            className="h-5 w-5 rounded border"
          />

          <label
            htmlFor="read"
            className="text-sm font-medium"
          >
            Mark this notification as read
          </label>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/notifications/${notification.id}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>
              </form>

    </div>

  );

}