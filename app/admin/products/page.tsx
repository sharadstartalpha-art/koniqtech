import { prisma } from "@/lib/prisma"

export default async function ProductsPage() {
  const products = await prisma.product.findMany()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <a
        href="/admin/products/new"
        className="bg-black text-white px-4 py-2 rounded"
      >
        + New Product
      </a>

      <div className="mt-6 space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-500">{p.slug}</p>
          </div>
        ))}
      </div>
    </div>
  )
}