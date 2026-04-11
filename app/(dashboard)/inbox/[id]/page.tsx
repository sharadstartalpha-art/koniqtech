import { prisma } from "@/lib/prisma";
import { ReplyBox } from "@/components/ReplyBox";

export default async function ThreadPage({
  params,
}: {
  params: { id: string };
}) {
  const thread = await prisma.emailThread.findUnique({
    where: { id: params.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread) return <div>Not found</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{thread.subject}</h1>

      {thread.messages.map((e: any) => (
        <div key={e.id} className="p-3 border rounded">
          <p className="text-sm text-gray-500">
            {e.from} → {e.to}
          </p>

          <div
            dangerouslySetInnerHTML={{ __html: e.body }}
          />
        </div>
      ))}

      <ReplyBox
  threadId={thread.id}
  to={thread.messages[0]?.from}
/>
    </div>
  );
}