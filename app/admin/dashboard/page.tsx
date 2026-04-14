import {prisma} from "@/lib/prisma";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count({
    where: { role: "USER" },
  });

  const totalLeads = await prisma.lead.count();

  const revenueData = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const totalRevenue = revenueData._sum.amount || 0;

  return (
    <div className="space-y-6 p-6">

      <h1 className="text-2xl font-bold">Admin Dashboard 👑</h1>

      {/* ✅ CLIENT PART */}
      <DashboardClient />

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <Link href="/admin/users">
          <div className="p-6 border rounded-xl hover:shadow cursor-pointer">
            <p className="text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </div>
        </Link>

        <Link href="/admin/reports">
          <div className="p-6 border rounded-xl hover:shadow cursor-pointer">
            <p className="text-gray-500">Total Leads</p>
            <p className="text-3xl font-bold">{totalLeads}</p>
          </div>
        </Link>

        <Link href="/admin/revenue">
          <div className="p-6 border rounded-xl hover:shadow cursor-pointer">
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue}</p>
          </div>
        </Link>

      </div>
    </div>
  );
}