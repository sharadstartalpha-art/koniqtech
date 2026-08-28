import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ReplyConversationPage({
  params,
}: PageProps) {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const { conversationId } =
    await params;

  const conversation =
    await prisma.conversation.findFirst({

      where: {
        id: conversationId,
        orgId,
      },

      include: {
        customer: true,
      },

    });

  if (!conversation) {
    notFound();
  }

  async function sendReply(
    formData: FormData,
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const body =
      formData.get("body") as string;

    if (!body.trim()) {
      return;
    }

    await prisma.message.create({

      data: {

        conversationId,

        senderId: session.user.id,

        body,

      },

    });

    redirect(
      `/messages/${conversationId}`,
    );

  }

  return (

    <div className="mx-auto max-w-4xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Reply
          </h1>

          <p className="mt-2 text-slate-600">

            {conversation.customer.companyName ||

              `${conversation.customer.firstName} ${conversation.customer.lastName ?? ""}`}

          </p>

        </div>

        <Link
          href={`/messages/${conversation.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={sendReply}
        className="space-y-8 rounded-3xl border bg-white p-8"
      >

                <div className="rounded-2xl border bg-slate-50 p-6">

          <h2 className="text-xl font-semibold">
            Conversation Details
          </h2>

          <dl className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <dt className="text-sm text-slate-500">
                Customer
              </dt>

              <dd className="mt-1 font-medium">

                {conversation.customer.companyName ||

                  `${conversation.customer.firstName} ${conversation.customer.lastName ?? ""}`}

              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Channel
              </dt>

              <dd className="mt-1">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    conversation.channel === "sms"
                      ? "bg-blue-100 text-blue-700"
                      : conversation.channel === "email"
                      ? "bg-green-100 text-green-700"
                      : conversation.channel === "whatsapp"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {conversation.channel.charAt(0).toUpperCase() +
                    conversation.channel.slice(1)}
                </span>

              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Conversation Started
              </dt>

              <dd className="mt-1 font-medium">
                {conversation.createdAt.toLocaleString()}
              </dd>

            </div>

            <div>

              <dt className="text-sm text-slate-500">
                Conversation ID
              </dt>

              <dd className="mt-1 font-mono text-sm">
                {conversation.id}
              </dd>

            </div>

          </dl>

        </div>

        <div>

          <label
            htmlFor="body"
            className="mb-2 block text-sm font-medium"
          >
            Reply Message
          </label>

          <textarea
            id="body"
            name="body"
            rows={10}
            required
            placeholder="Type your reply..."
            className="w-full rounded-xl border px-4 py-3"
          />

          <p className="mt-2 text-sm text-slate-500">
            Your reply will be added to this conversation and attributed to
            your user account.
          </p>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/messages/${conversation.id}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Send Reply
          </button>

        </div>
              </form>

    </div>

  );

}