import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: { credits: true },
  })

  const products = await prisma.product.findMany({
    where: { isActive: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome 👋</h1>

      {/* Credits */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-500">Available Credits</p>
        <h2 className="text-3xl font-bold">
          {user?.credits?.balance || 0}
        </h2>
      </div>

      {/* Products */}
      <h2 className="text-lg font-semibold mb-4">Your Tools</h2>

      <div className="grid grid-cols-3 gap-6">
        {products.map((p) => (
          <a
            key={p.id}
            href={`/product/${p.slug}`}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-gray-500 text-sm">
              {p.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}