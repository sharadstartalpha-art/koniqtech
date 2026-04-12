import { prisma } from "@/lib/prisma";

export default async function RevenuePage() {
  const payments = await prisma.payment.findMany();

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Revenue 💰</h1>

      <div className="border p-6 rounded-xl">
        <p>Total Revenue</p>
        <h2 className="text-3xl font-bold">${total}</h2>
      </div>
    </div>
  );
}