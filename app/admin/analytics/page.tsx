import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const users = await prisma.user.count();
  const revenue = await prisma.transaction.aggregate({
    _sum: { amount: true },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <p>Total Users</p>
          <h2 className="text-2xl">{users}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Total Revenue</p>
          <h2 className="text-2xl">
            ${revenue._sum.amount ?? 0}
          </h2>
        </div>

      </div>
    </div>
  );
}