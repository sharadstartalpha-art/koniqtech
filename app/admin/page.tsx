import { prisma } from "@/lib/prisma";
import AdminChart from "@/components/admin/AdminChart";

export default async function AdminPage() {
  const users = await prisma.user.count();
  const payments = await prisma.payment.findMany();

  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const data = payments.map((p) => ({
    date: new Date(p.createdAt).toLocaleDateString(),
    amount: p.amount,
  }));

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard 🛠</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-xl border">
          <p>Users</p>
          <p className="text-3xl font-bold">{users}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p>Revenue</p>
          <p className="text-3xl font-bold">${revenue}</p>
        </div>

      </div>

      {/* CHART */}
      <AdminChart data={data} />

    </div>
  );
}