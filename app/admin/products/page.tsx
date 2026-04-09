import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";

export default async function ProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany();
const session = await getServerSession(authOptions);

if (session?.user?.role !== "ADMIN") {
  return <div>Unauthorized</div>;
}
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