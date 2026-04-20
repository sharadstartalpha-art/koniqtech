import { prisma } from "@/lib/prisma";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leads 📊</h1>

      <div className="space-y-2">
        {leads.map((lead) => (
          <div key={lead.id} className="border p-3 rounded">
            <p><b>{lead.name}</b></p>
            <p>{lead.email}</p>
            <p>{lead.company}</p>
            <p>{lead.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}