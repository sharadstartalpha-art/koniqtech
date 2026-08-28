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
    conversationId: string;
  }>;
}

export default async function DeleteConversationPage({
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

        messages: true,

      },

    });

  if (!conversation) {
    notFound();
  }

  async function deleteConversation() {

    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    await prisma.conversation.delete({

      where: {
        id: conversationId,
      },

    });

    redirect("/messages");

  }

  return (

    <div className="mx-auto max-w-3xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold text-red-600">
          Delete Conversation
        </h1>

        <p className="mt-2 text-slate-600">
          This action cannot be undone.
        </p>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-2xl font-semibold">
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
              Messages
            </dt>

            <dd className="mt-1 font-medium">
              {conversation.messages.length}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Created
            </dt>

            <dd className="mt-1 font-medium">
              {conversation.createdAt.toLocaleString()}
            </dd>

          </div>

        </dl>

        <div className="mt-8 rounded-xl border border-red-300 bg-white p-6">

          <p className="text-red-700 font-medium">
            Deleting this conversation will permanently remove:
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">

            <li>
              The conversation record
            </li>

            <li>
              All messages in this conversation
            </li>

            <li>
              Associated conversation history
            </li>

          </ul>

        </div>

      </div>

      <form
        action={deleteConversation}
        className="flex justify-end gap-4"
      >

        <Link
          href={`/messages/${conversation.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
        >
          Delete Conversation
        </button>
              </form>

    </div>

  );

}