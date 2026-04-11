import { prisma } from "@/lib/prisma";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Payments 💳</h1>

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="border p-4 rounded-xl">
            <p>${p.amount}</p>
            <p className="text-sm text-gray-500">
              {new Date(p.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}