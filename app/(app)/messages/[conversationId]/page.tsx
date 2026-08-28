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

export default async function ConversationPage({
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

        messages: {

          include: {

            sender: true,

          },

          orderBy: {

            createdAt: "asc",

          },

        },

      },

    });

  if (!conversation) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">

            {conversation.customer.companyName ||

              `${conversation.customer.firstName} ${conversation.customer.lastName ?? ""}`}

          </h1>

          <div className="mt-3 flex items-center gap-3">

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
              {conversation.channel
                .charAt(0)
                .toUpperCase() +
                conversation.channel.slice(1)}
            </span>

            <span className="text-sm text-slate-500">

              Started{" "}

              {conversation.createdAt.toLocaleDateString()}

            </span>

          </div>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/messages/${conversation.id}/reply`}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Reply
          </Link>

          <Link
            href={`/messages/${conversation.id}/delete`}
            className="rounded-xl border border-red-300 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

          <Link
            href="/messages"
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Conversation
        </h2>

        <div className="space-y-6">

                      {conversation.messages.length === 0 && (

            <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">

              No messages in this conversation yet.

            </div>

          )}

          {conversation.messages.map((message) => (

            <div
              key={message.id}
              className="rounded-2xl border bg-slate-50 p-6"
            >

              <div className="mb-3 flex items-center justify-between">

                <div>

                  <p className="font-semibold">

                    {message.sender?.name ?? "System"}

                  </p>

                  <p className="text-sm text-slate-500">

                    {message.sender?.email ?? ""}

                  </p>

                </div>

                <div className="text-sm text-slate-500">

                  {message.createdAt.toLocaleString()}

                </div>

              </div>

              <div className="whitespace-pre-wrap text-slate-700">

                {message.body}

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-4 text-2xl font-bold">
          Conversation Details
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

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

            <dd className="mt-1 font-medium capitalize">
              {conversation.channel}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Total Messages
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

      </div>
      
            </div>

    

  );

}