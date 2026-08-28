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
    logId: string;
  }>;
}

export default async function AiLogPage({
  params,
}: PageProps) {

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  const { logId } =
    await params;

  const log =
    await prisma.aiLog.findFirst({

      where: {
        id: logId,
        orgId,
      },

      include: {
        user: true,
      },

    });

  if (!log) {
    notFound();
  }

  return (

    <div className="mx-auto max-w-6xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            AI Conversation
          </h1>

          <p className="mt-2 text-slate-600">
            Review a saved AI interaction.
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/ai/${log.id}/delete`}
            className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete
          </Link>

          <Link
            href="/ai"
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Conversation Details
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">
                      <div>

            <dt className="text-sm text-slate-500">
              User
            </dt>

            <dd className="mt-1 font-medium">
              {log.user.name}
            </dd>

            <p className="text-sm text-slate-500">
              {log.user.email}
            </p>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Tokens Used
            </dt>

            <dd className="mt-1 font-medium text-blue-600">
              {(log.tokens ?? 0).toLocaleString()}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Created
            </dt>

            <dd className="mt-1 font-medium">
              {log.createdAt.toLocaleString()}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              AI Log ID
            </dt>

            <dd className="mt-1 font-mono text-sm break-all">
              {log.id}
            </dd>

          </div>

        </dl>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Prompt
        </h2>

        <div className="rounded-2xl bg-slate-50 p-6">

          <pre className="whitespace-pre-wrap font-sans text-slate-700">
            {log.prompt}
          </pre>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          AI Response
        </h2>

        <div className="rounded-2xl bg-blue-50 p-6">

          <pre className="whitespace-pre-wrap font-sans text-slate-700">
            {log.response}
          </pre>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Summary
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

          <div>

            <dt className="text-sm text-slate-500">
              Prompt Length
            </dt>

            <dd className="mt-1 font-medium">
              {log.prompt.length.toLocaleString()} characters
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Response Length
            </dt>

            <dd className="mt-1 font-medium">
              {log.response.length.toLocaleString()} characters
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Estimated Tokens
            </dt>

            <dd className="mt-1 font-medium">
              {(log.tokens ?? 0).toLocaleString()}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Organization
            </dt>

            <dd className="mt-1 font-medium">
              {session.user.orgId}
            </dd>

          </div>

        </dl>

      </div>

            </div>

  

  );

}