import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AiDashboardPage() {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const aiLogs =
    await prisma.aiLog.findMany({

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

  const totalRequests =
    aiLogs.length;

  const totalTokens =
    aiLogs.reduce(
      (sum, log) => sum + (log.tokens ?? 0),
      0,
    );

  const averageTokens =
    totalRequests === 0
      ? 0
      : Math.round(
          totalTokens / totalRequests,
        );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const todayRequests =
    aiLogs.filter(
      (log) =>
        log.createdAt >= today,
    ).length;

  const activeUsers =
    new Set(
      aiLogs.map(
        (log) => log.userId,
      ),
    ).size;

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            AI Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Review AI usage, prompts, responses, and token consumption.
          </p>

        </div>

        <Link
          href="/ai/chat"
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Open AI Chat
        </Link>

      </div>

      <div className="grid gap-6 lg:grid-cols-5">

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Requests
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {totalRequests}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Tokens
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {totalTokens.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Today
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {todayRequests}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Avg Tokens
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {averageTokens}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <p className="text-slate-500">
            Active Users
          </p>

          <h2 className="mt-3 text-4xl font-bold text-amber-600">
            {activeUsers}
          </h2>

        </div>

      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            AI Usage Summary
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Total Requests</dt>

              <dd className="font-semibold">
                {totalRequests}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Tokens</dt>

              <dd className="font-semibold text-blue-600">
                {totalTokens.toLocaleString()}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Today's Requests</dt>

              <dd className="font-semibold text-green-600">
                {todayRequests}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Average Tokens</dt>

              <dd className="font-semibold text-purple-600">
                {averageTokens}
              </dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Active Users</dt>

              <dd className="font-semibold text-amber-600">
                {activeUsers}
              </dd>

            </div>

          </dl>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Token Analytics
          </h2>

          <dl className="space-y-5">

            <div className="flex items-center justify-between">

              <dt>Average Tokens / Request</dt>

              <dd>{averageTokens}</dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Total Token Usage</dt>

              <dd>{totalTokens.toLocaleString()}</dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Today's Activity</dt>

              <dd>{todayRequests}</dd>

            </div>

            <div className="flex items-center justify-between">

              <dt>Unique Users</dt>

              <dd>{activeUsers}</dd>

            </div>

          </dl>

        </div>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <div className="border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            AI History
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Prompt
              </th>

              <th className="px-6 py-4 text-left">
                Response
              </th>

              <th className="px-6 py-4 text-left">
                User
              </th>

              <th className="px-6 py-4 text-center">
                Tokens
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
                        {aiLogs.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No AI requests found.
                </td>

              </tr>

            )}

            {aiLogs.map((log) => (

              <tr
                key={log.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="max-w-sm px-6 py-4">

                  <Link
                    href={`/ai/${log.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {log.prompt.length > 80
                      ? `${log.prompt.slice(0, 80)}...`
                      : log.prompt}
                  </Link>

                </td>

                <td className="max-w-md px-6 py-4 text-slate-600">

                  {log.response.length > 100
                    ? `${log.response.slice(0, 100)}...`
                    : log.response}

                </td>

                <td className="px-6 py-4">

                  <div>

                    <p className="font-medium">
                      {log.user.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {log.user.email}
                    </p>

                  </div>

                </td>

                <td className="px-6 py-4 text-center font-medium">

                  {(log.tokens ?? 0).toLocaleString()}

                </td>

                <td className="px-6 py-4 text-sm text-slate-500">

                  {log.createdAt.toLocaleString()}

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-3">

                    <Link
                      href={`/ai/${log.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/ai/${log.id}/delete`}
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