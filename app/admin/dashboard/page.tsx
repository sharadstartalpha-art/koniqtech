import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();

  const totalLeads = await prisma.lead.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>

      <div className="grid grid-cols-3 gap-4">

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold">{totalLeads}</p>
        </div>

        <div className="p-6 border rounded-xl">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">
            ${totalRevenue._sum.amount || 0}
          </p>
        </div>

      </div>
    </div>
  );
}