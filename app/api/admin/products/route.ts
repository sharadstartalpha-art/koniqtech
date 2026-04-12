import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  await requireAdmin();

  const { name, slug, price, description } = await req.json();

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
      description,
      active: true,
    },
  });

  return Response.json(product);
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
  });

  return Response.json(products);
}