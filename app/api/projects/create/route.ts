import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const { name } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  const product = await prisma.product.findFirst();

  const project = await prisma.project.create({
    data: {
      name,
      userId: user!.id,
      productId: product!.id,
    },
  });

  return Response.json(project);
}