import { prisma } from "@/lib/prisma"

export default async function TransactionsPage() {
  const tx = await prisma.transaction.findMany({
    include: { user: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      {tx.map((t) => (
        <div key={t.id} className="bg-white p-4 mb-2 rounded shadow">
          <p>{t.user.email}</p>
          <p>₹ {t.amount}</p>
          <p>{t.type}</p>
        </div>
      ))}
    </div>
  )
}