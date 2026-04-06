import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const leads = await prisma.lead.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <div>
      <h1>Welcome back 🚀</h1>

      <p>Total Leads: {leads.length}</p>

      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            {lead.name} - {lead.email}
          </li>
        ))}
      </ul>
    </div>
  );
}