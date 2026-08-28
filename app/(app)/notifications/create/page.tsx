import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateNotificationPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const users = await prisma.user.findMany({

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

  async function createNotification(
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

    const userId =
      (formData.get("userId") as string) || null;

    const title =
      (formData.get("title") as string).trim();

    const message =
      (formData.get("message") as string).trim();

    const type =
      (formData.get("type") as string).trim();

    if (
      !title ||
      !message ||
      !type
    ) {
      return;
    }

    await prisma.notification.create({

      data: {

        orgId,

        userId,

        title,

        message,

        type,

      },

    });

    redirect("/notifications");

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            New Notification
          </h1>

          <p className="mt-2 text-slate-600">
            Create a notification for a specific user or your entire organization.
          </p>

        </div>

        <Link
          href="/notifications"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={createNotification}
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
            className="w-full rounded-xl border px-4 py-3"
            defaultValue=""
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

          <p className="mt-2 text-sm text-slate-500">
            Leave empty to send this notification to the entire organization.
          </p>

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
            defaultValue="System"
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
            maxLength={150}
            placeholder="Notification title"
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
            placeholder="Enter the notification message..."
            className="w-full rounded-xl border px-4 py-3"
          />

          <p className="mt-2 text-sm text-slate-500">
            This message will appear in the recipient's notification center.
          </p>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href="/notifications"
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Notification
          </button>

        </div>
              </form>

    </div>

  );

}