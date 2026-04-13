import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Transactions 💳</h1>

      <table className="w-full border rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.user.email}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}