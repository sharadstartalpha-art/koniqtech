import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  let user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    include: { projects: true },
  });

  // ✅ SAFETY: if no project → create
  if (!user?.projects?.length) {
    const product = await prisma.product.findFirst();

    const newProject = await prisma.project.create({
      data: {
        name: "My First Project",
        userId: user!.id,
        productId: product!.id,
      },
    });

    user.projects = [newProject];
  }

  return NextResponse.json(user.projects);
}