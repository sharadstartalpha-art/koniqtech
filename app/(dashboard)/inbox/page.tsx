import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InboxPage() {
  const threads = await prisma.emailThread.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // latest message preview
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="grid grid-cols-3 h-full">
      
      {/* LEFT SIDEBAR */}
      <div className="border-r p-4">
        <h2 className="font-bold mb-4">Inbox</h2>

        {threads.map((t) => (
          <Link key={t.id} href={`/inbox/${t.id}`}>
            <div className="p-3 hover:bg-gray-100 rounded cursor-pointer">
              
              <p className="font-semibold">{t.subject}</p>

              <p className="text-sm text-gray-500">
                {t.messages[0]?.body?.slice(0, 40) || "No messages"}
              </p>

            </div>
          </Link>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="col-span-2 p-4">
        <p className="text-gray-500">Select a thread</p>
      </div>

    </div>
  );
}