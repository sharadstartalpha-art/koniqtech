import { prisma } from "@/lib/prisma"

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: {
      status: true,
    },
  })

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">CRM Pipeline</h1>

      {leads.map((lead: any) => (
        <div key={lead.id} className="bg-white p-4 mb-2 rounded shadow">
          <p>{lead.name}</p>

          {/* ✅ fallback */}
          <p>{lead.contactEmail || lead.email}</p>

          {/* ✅ safe */}
          <p>Status: {lead.status?.status || "NEW"}</p>
        </div>
      ))}
    </div>
  )
}