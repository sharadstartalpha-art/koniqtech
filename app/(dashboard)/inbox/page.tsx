import { prisma } from "@/lib/prisma";

export default async function InboxPage() {
  const threads = await prisma.emailThread.findMany({
    include: { messages: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inbox 📬</h1>

      {threads.map((t) => (
        <div key={t.id} className="border p-4 mb-2 rounded">
          <p className="font-semibold">{t.subject}</p>

          {t.messages.map((m) => (
            <p key={m.id} className="text-sm text-gray-600">
              {m.body}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}