import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const conversations =
    await prisma.conversation.findMany({

      where: {
        orgId,
      },

      include: {

        customer: true,

        messages: {

          include: {
            sender: true,
          },

          orderBy: {
            createdAt: "desc",
          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

    });

  const totalConversations =
    conversations.length;

  const smsCount =
    conversations.filter(
      (conversation) =>
        conversation.channel === "sms",
    ).length;

  const emailCount =
    conversations.filter(
      (conversation) =>
        conversation.channel === "email",
    ).length;

  const whatsappCount =
    conversations.filter(
      (conversation) =>
        conversation.channel === "whatsapp",
    ).length;

  const internalCount =
    conversations.filter(
      (conversation) =>
        conversation.channel === "internal",
    ).length;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Customer Messages
          </h1>

          <p className="mt-2 text-slate-600">
            SMS, Email, WhatsApp and Internal conversations.
          </p>

        </div>

        <Link
          href="/messages/create"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          New Conversation
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Conversations
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalConversations}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            SMS
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {smsCount}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Email
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {emailCount}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            WhatsApp
          </p>

          <h2 className="mt-3 text-4xl font-bold text-emerald-600">
            {whatsappCount}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Internal
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {internalCount}
          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Conversation Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Conversations</dt>

              <dd className="font-semibold">
                {totalConversations}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>SMS</dt>

              <dd className="font-semibold text-blue-600">
                {smsCount}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Email</dt>

              <dd className="font-semibold text-green-600">
                {emailCount}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>WhatsApp</dt>

              <dd className="font-semibold text-emerald-600">
                {whatsappCount}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Internal</dt>

              <dd className="font-semibold text-purple-600">
                {internalCount}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Channel Distribution
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>SMS</dt>

              <dd>
                {totalConversations === 0
                  ? "0%"
                  : `${((smsCount / totalConversations) * 100).toFixed(1)}%`}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Email</dt>

              <dd>
                {totalConversations === 0
                  ? "0%"
                  : `${((emailCount / totalConversations) * 100).toFixed(1)}%`}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>WhatsApp</dt>

              <dd>
                {totalConversations === 0
                  ? "0%"
                  : `${((whatsappCount / totalConversations) * 100).toFixed(1)}%`}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Internal</dt>

              <dd>
                {totalConversations === 0
                  ? "0%"
                  : `${((internalCount / totalConversations) * 100).toFixed(1)}%`}
              </dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Inbox
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Channel
              </th>

              <th className="px-6 py-4 text-left">
                Last Message
              </th>

              <th className="px-6 py-4 text-center">
                Messages
              </th>

              <th className="px-6 py-4 text-left">
                Updated
              </th>

              <th className="px-6 py-4 text-right">
                Action
              </th>

            </tr>

          </thead>

          <tbody>
                        {conversations.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No conversations found.
                </td>

              </tr>

            )}

            {conversations.map((conversation) => {

              const lastMessage =
                conversation.messages[0];

              return (

                <tr
                  key={conversation.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">

                    <Link
                      href={`/messages/${conversation.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {conversation.customer.companyName ||
                        `${conversation.customer.firstName} ${conversation.customer.lastName ?? ""}`}
                    </Link>

                  </td>

                  <td className="px-6 py-4">

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

                  </td>

                  <td className="px-6 py-4">

                    {lastMessage ? (

                      <div>

                        <p className="max-w-md truncate">
                          {lastMessage.body}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">

                          {lastMessage.sender?.name ??
                            "System"}

                        </p>

                      </div>

                    ) : (

                      <span className="text-slate-400">
                        No messages
                      </span>

                    )}

                  </td>

                  <td className="px-6 py-4 text-center font-semibold">

                    {conversation.messages.length}

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">

                    {conversation.createdAt.toLocaleDateString()}

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-end">

                      <Link
                        href={`/messages/${conversation.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Open
                      </Link>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}