import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, activeTeamId } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  // ✅ get user
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  // ✅ get product (or pass from frontend later)
  const product = await prisma.product.findFirst();

  if (!product) {
    return NextResponse.json({ error: "No product found" });
  }

  // 🔥 CREDIT CHECK + DEDUCTION
  if (activeTeamId) {
    const team = await prisma.team.findUnique({
      where: { id: activeTeamId },
    });

    if (!team || team.credits <= 0) {
      return NextResponse.json({ error: "Not enough team credits" });
    }

    await prisma.team.update({
      where: { id: activeTeamId },
      data: {
        credits: { decrement: 1 },
      },
    });
  } else {
    if (user.credits <= 0) {
      return NextResponse.json({ error: "Not enough credits" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { decrement: 1 },
      },
    });
  }

  // ✅ CREATE PROJECT
  const project = await prisma.project.create({
    data: {
      name,
      userId: user.id,
      productId: product.id,
    },
  });

  return NextResponse.json(project);
}