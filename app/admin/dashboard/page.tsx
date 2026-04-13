import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const totalLeads = await prisma.lead.count();

  const revenueData = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const totalRevenue = revenueData._sum.amount || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>

      <div className="grid grid-cols-3 gap-4">

        {/* USERS */}
        <Link href="/admin/users">
          <div className="p-6 border rounded-xl cursor-pointer hover:shadow">
            <p className="text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </Link>

        {/* LEADS */}
        <Link href="/admin/reports">
          <div className="p-6 border rounded-xl cursor-pointer hover:shadow">
            <p className="text-gray-500">Total Leads</p>
            <p className="text-3xl font-bold">{totalLeads}</p>
          </div>
        </Link>

        {/* REVENUE */}
        <Link href="/admin/revenue">
          <div className="p-6 border rounded-xl cursor-pointer hover:shadow">
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue}</p>
          </div>
        </Link>

      </div>
    </div>
  );
}