import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json([]);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: true,
    },
  });

  if (!user) return NextResponse.json([]);

  // ✅ AUTO CREATE PROJECT
  if (user.projects.length === 0) {
    const product = await prisma.product.findFirst();

    if (!product) return NextResponse.json([]);

    const project = await prisma.project.create({
      data: {
        name: "My First Project",
        userId: user.id,
        productId: product.id,
      },
    });

    return NextResponse.json([project]);
  }

  return NextResponse.json(user.projects);
}