import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json([]);
  }

  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { projects: true },
  });

  // ✅ SAFETY: create project if none
  if (user && user.projects.length === 0) {
    const product = await prisma.product.findFirst();

    if (product) {
      const newProject = await prisma.project.create({
        data: {
          name: "My First Project",
          userId: user.id,
          productId: product.id,
        },
      });

      return NextResponse.json([newProject]);
    }
  }

  return NextResponse.json(user?.projects || []);
}