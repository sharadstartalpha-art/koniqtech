import { prisma } from "@/lib/prisma";

export default async function RevenuePage() {
  const payments = await prisma.payment.findMany();
  const users = await prisma.user.findMany();

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const mrr = payments
    .filter((p) => p.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((sum, p) => sum + p.amount, 0);

  const ltv = users.length ? (totalRevenue / users.length).toFixed(2) : 0;

  const churn = 5; // placeholder %

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">

      <h1 className="text-2xl font-bold">Revenue Dashboard 💰</h1>

      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white p-6 rounded-xl border">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">${totalRevenue}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p>MRR</p>
          <h2 className="text-2xl font-bold">${mrr}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p>LTV</p>
          <h2 className="text-2xl font-bold">${ltv}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p>Churn</p>
          <h2 className="text-2xl font-bold">{churn}%</h2>
        </div>

      </div>

    </div>
  );
}