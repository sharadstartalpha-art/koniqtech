import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
      active: true, // ✅ important
    },
  });

  if (!product) return notFound();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="mt-2 text-gray-500">
        {product.description || "SaaS tool"}
      </p>

      <p className="mt-4 font-semibold">
        Price: ${product.price}
      </p>
    </div>
  );
}