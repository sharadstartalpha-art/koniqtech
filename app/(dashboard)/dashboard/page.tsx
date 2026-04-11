import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const users = await prisma.user.count();
  const leads = await prisma.lead.count();
  const payments = await prisma.payment.findMany();

  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded-xl border">
        <p>Users</p>
        <h2 className="text-2xl font-bold">{users}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p>Leads</p>
        <h2 className="text-2xl font-bold">{leads}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <p>Revenue</p>
        <h2 className="text-2xl font-bold">${revenue}</h2>
      </div>

    </div>
  );
}