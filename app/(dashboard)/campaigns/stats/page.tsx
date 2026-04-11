import { prisma } from "@/lib/prisma";

export default async function CampaignStats() {
  const logs = await prisma.emailLog.findMany();

  return (
    <div className="max-w-5xl mx-auto py-10">

      <h1 className="text-xl font-bold">Campaign Stats 📊</h1>

      {logs.map((l) => (
        <div key={l.id} className="border p-3 mb-2">
          <p>{l.email}</p>
          <p>Opened: {l.opened ? "Yes" : "No"}</p>
          <p>Clicked: {l.clicked ? "Yes" : "No"}</p>
        </div>
      ))}

    </div>
  );
}