import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";

export default async function AnalyticsPage() {
  await requireAdmin();
  const users = await prisma.user.count();
const session = await getServerSession(authOptions);

if (session?.user?.role !== "ADMIN") {
  return <div>Unauthorized</div>;
}

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