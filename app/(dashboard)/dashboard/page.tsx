import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
  const session = await getServerSession();

  const userId = session?.user?.id;

  const leadsCount = await prisma.lead.count({
    where: { userId },
  });

  const emailsSent = await prisma.emailLog.count({
    where: { userId },
  });

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Your Leads</p>
        <p className="text-3xl font-bold">{leadsCount}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p className="text-gray-500">Emails Sent</p>
        <p className="text-3xl font-bold">{emailsSent}</p>
      </div>

    </div>
  );
}