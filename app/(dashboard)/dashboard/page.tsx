import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const leadsCount = await prisma.lead.count();

  const emailsSent = await prisma.emailLog.count({
    where: { status: "SENT" },
  });

  const payments = await prisma.payment.findMany();

  const revenue = payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      <h1 className="text-2xl font-bold">Dashboard 📊</h1>

      <div className="grid md:grid-cols-3 gap-4">

        {/* LEADS */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Leads Generated</p>
          <p className="text-3xl font-bold">{leadsCount}</p>
        </div>

        {/* EMAILS */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Emails Sent</p>
          <p className="text-3xl font-bold">{emailsSent}</p>
        </div>

        {/* REVENUE */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-gray-500">Revenue</p>
          <p className="text-3xl font-bold">${revenue}</p>
        </div>

      </div>

    </div>
  );
}