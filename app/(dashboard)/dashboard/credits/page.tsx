import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CreditsPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: {
      credits: true,
      transactions: true,
    },
  })

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Credits</h1>

      <div className="bg-white p-6 rounded shadow mb-6">
        <p>Balance</p>
        <h2 className="text-2xl font-bold">
          {user?.credits?.balance}
        </h2>
      </div>

      <h2 className="font-semibold mb-2">History</h2>

      {user?.transactions.map((t) => (
        <div key={t.id} className="bg-white p-3 mb-2 rounded">
          <p>{t.type}</p>
          <p>{t.credits} credits</p>
        </div>
      ))}
    </div>
  )
}