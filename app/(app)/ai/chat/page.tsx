import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AiChatPage() {

  const session = await auth();

  if (!session?.user?.orgId || !session.user.id) {
    redirect("/login");
  }

  const orgId = session.user.orgId;
  const userId = session.user.id;

  const recentLogs =
    await prisma.aiLog.findMany({

      where: {
        orgId,
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 20,

    });

  async function sendPrompt(
    formData: FormData,
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId || !session.user.id) {
      redirect("/login");
    }

    const prompt =
      (formData.get("prompt") as string).trim();

    if (!prompt) {
      return;
    }

    /**
     * Replace this section with your
     * OpenAI / Anthropic / Gemini call.
     */

    const aiResponse =
      `AI response for:\n\n${prompt}`;

    const estimatedTokens =
      Math.ceil(
        (prompt.length + aiResponse.length) / 4,
      );

    await prisma.aiLog.create({

      data: {

        orgId: session.user.orgId,

        userId: session.user.id,

        prompt,

        response: aiResponse,

        tokens: estimatedTokens,

      },

    });

    redirect("/ai/chat");

  }

  return (

    <div className="mx-auto max-w-7xl">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            AI Assistant
          </h1>

          <p className="mt-2 text-slate-600">
            Ask questions, generate content, and save every interaction.
          </p>

        </div>

        <Link
          href="/ai"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          AI Dashboard
        </Link>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">

          <div className="rounded-3xl border bg-white p-8">

            <h2 className="mb-6 text-2xl font-bold">
              Ask AI
            </h2>

            <form
              action={sendPrompt}
              className="space-y-6"
            >

              <div>

                <label
                  htmlFor="prompt"
                  className="mb-2 block text-sm font-medium"
                >
                  Prompt
                </label>

                <textarea
                  id="prompt"
                  name="prompt"
                  rows={8}
                  required
                  placeholder="Ask anything..."
                  className="w-full rounded-2xl border px-4 py-4 focus:border-blue-500 focus:outline-none"
                />

              </div>

              <div className="flex justify-end">

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Send to AI
                </button>

              </div>

            </form>

          </div>

          {recentLogs.length > 0 && (

            <div className="mt-8 rounded-3xl border bg-white p-8">

              <h2 className="mb-6 text-2xl font-bold">
                Latest Response
              </h2>

              <div className="space-y-6">

                <div>

                  <h3 className="mb-2 font-semibold">
                    Prompt
                  </h3>

                  <div className="rounded-xl bg-slate-100 p-4 whitespace-pre-wrap">
                    {recentLogs[0].prompt}
                  </div>

                </div>

                <div>

                  <h3 className="mb-2 font-semibold">
                    AI Response
                  </h3>

                  <div className="rounded-xl bg-blue-50 p-4 whitespace-pre-wrap">
                    {recentLogs[0].response}
                  </div>

                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">

                  <span>
                    Tokens Used: {recentLogs[0].tokens ?? 0}
                  </span>

                  <span>
                    {recentLogs[0].createdAt.toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

          )}

        </div>

        <div>

          <div className="rounded-3xl border bg-white">

            <div className="border-b px-6 py-5">

              <h2 className="text-xl font-bold">
                Recent History
              </h2>

            </div>

            <div className="max-h-[700px] overflow-y-auto">
                              {recentLogs.length === 0 && (

                <div className="p-6 text-center text-slate-500">
                  No conversations yet.
                </div>

              )}

              {recentLogs.map((log) => (

                <div
                  key={log.id}
                  className="border-b p-5 hover:bg-slate-50"
                >

                  <Link
                    href={`/ai/${log.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {log.prompt.length > 70
                      ? `${log.prompt.slice(0, 70)}...`
                      : log.prompt}
                  </Link>

                  <p className="mt-2 text-sm text-slate-600">
                    {log.response.length > 100
                      ? `${log.response.slice(0, 100)}...`
                      : log.response}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">

                    <span>
                      {(log.tokens ?? 0).toLocaleString()} tokens
                    </span>

                    <span>
                      {log.createdAt.toLocaleString()}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}