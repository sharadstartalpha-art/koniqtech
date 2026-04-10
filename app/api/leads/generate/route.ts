import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { balance: true },
  });

  // ✅ SAFE CHECK
  if (!user || !user.balance || user.balance.amount <= 0) {
    return new Response("Upgrade plan to continue", { status: 403 });
  }

  // 🚨 FIX: REMOVE projectId from session
  const project = await prisma.project.findFirst({
    where: { userId: user.id },
  });

  if (!project) {
    return NextResponse.json(
      { error: "No project found" },
      { status: 400 }
    );
  }

  // ✅ create lead
  await prisma.lead.create({
    data: {
      name: "Generated Lead",
      email: `lead${Date.now()}@test.com`,
      userId: user.id,
      projectId: project.id,
    },
  });

  // 💰 deduct credit
  await prisma.balance.update({
    where: { userId: user.id },
    data: {
      amount: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json({ success: true });
}