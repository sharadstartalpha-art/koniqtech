import { prisma } from "@/lib/prisma"

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: {
      status: true, // ✅ works only after db push
    },
  })

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">CRM Pipeline</h1>

      {leads.map((lead) => (
        <div key={lead.id} className="bg-white p-4 mb-2 rounded shadow">
          <p>{lead.name}</p>

          {/* ✅ SAFE FALLBACK */}
          <p>{lead.contactEmail || lead.email}</p>

          {/* ✅ SAFE STATUS */}
          <p>Status: {lead.status?.status || "NEW"}</p>
        </div>
      ))}
    </div>
  )
}