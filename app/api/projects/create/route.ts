import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const { name } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  // ✅ GET DEFAULT PRODUCT
  const product = await prisma.product.findFirst();

  if (!product) {
    return Response.json(
      { error: "No product found" },
      { status: 500 }
    );
  }

  const project = await prisma.project.create({
    data: {
      name,
      userId: user!.id,
      productId: product.id, // ✅ FIX
    },
  });

  return Response.json(project);
}