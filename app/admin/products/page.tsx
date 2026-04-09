import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>

      {products.map((p) => (
        <div key={p.id} className="bg-white p-4 mb-2 rounded shadow">
          <p>{p.name}</p>
          <p>Slug: {p.slug}</p>
          <p>Price: ${p.price}</p>
        </div>
      ))}
    </div>
  );
}