import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, slug, price } = await req.json();

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
    },
  });

  return Response.json(product);
}