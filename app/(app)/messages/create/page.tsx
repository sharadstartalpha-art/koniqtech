import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CreateConversationPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const customers =
    await prisma.customer.findMany({

      where: {
        orgId,
      },

      orderBy: {
        firstName: "asc",
      },

    });

  async function createConversation(
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

    const customerId =
      formData.get("customerId") as string;

    const channel =
      formData.get("channel") as
        | "sms"
        | "email"
        | "whatsapp"
        | "internal";

    const body =
      formData.get("body") as string;

    if (
      !customerId ||
      !channel ||
      !body.trim()
    ) {
      return;
    }

    const conversation =
      await prisma.conversation.create({

        data: {

          orgId,

          customerId,

          channel,

          messages: {

            create: {

              senderId:
                session.user.id,

              body,

            },

          },

        },

      });

    redirect(
      `/messages/${conversation.id}`,
    );

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            New Conversation
          </h1>

          <p className="mt-2 text-slate-600">
            Start a new customer conversation.
          </p>

        </div>

        <Link
          href="/messages"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={createConversation}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >

                <div>

          <label
            htmlFor="customerId"
            className="mb-2 block text-sm font-medium"
          >
            Customer
          </label>

          <select
            id="customerId"
            name="customerId"
            required
            className="w-full rounded-xl border px-4 py-3"
          >

            <option value="">
              Select a customer
            </option>

            {customers.map((customer) => (

              <option
                key={customer.id}
                value={customer.id}
              >

                {customer.companyName ||
                  `${customer.firstName} ${customer.lastName ?? ""}`}

              </option>

            ))}

          </select>

        </div>

        <div>

          <label
            htmlFor="channel"
            className="mb-2 block text-sm font-medium"
          >
            Communication Channel
          </label>

          <select
            id="channel"
            name="channel"
            required
            defaultValue="email"
            className="w-full rounded-xl border px-4 py-3"
          >

            <option value="email">
              Email
            </option>

            <option value="sms">
              SMS
            </option>

            <option value="whatsapp">
              WhatsApp
            </option>

            <option value="internal">
              Internal Note
            </option>

          </select>

        </div>

        <div>

          <label
            htmlFor="body"
            className="mb-2 block text-sm font-medium"
          >
            First Message
          </label>

          <textarea
            id="body"
            name="body"
            rows={8}
            required
            placeholder="Type your message..."
            className="w-full rounded-xl border px-4 py-3"
          />

          <p className="mt-2 text-sm text-slate-500">
            This message will become the first message in the
            conversation.
          </p>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href="/messages"
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Create Conversation
          </button>

        </div>
              </form>

    </div>

  );

}