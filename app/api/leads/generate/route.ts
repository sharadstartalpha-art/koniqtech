import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ GET USER
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { balance: true, projects: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ❌ NO CREDITS
  if (!user.balance || user.balance.balance <= 0) {
    return NextResponse.json({ error: "No credits left" }, { status: 400 });
  }

  // ✅ GET PROJECT (IMPORTANT FIX)
  const project = user.projects[0];

  if (!project) {
    return NextResponse.json({ error: "No project found" }, { status: 400 });
  }

  // ✅ CREATE LEAD
  await prisma.lead.create({
    data: {
      userId: user.id,
      projectId: project.id, // 🔥 THIS WAS MISSING / BROKEN
      name: "Generated Lead",
      email: `lead${Date.now()}@test.com`,
      contactEmail: `lead${Date.now()}@test.com`,
    },
  });

  // ✅ DEDUCT CREDIT
  await prisma.userBalance.update({
    where: { userId: user.id },
    data: {
      balance: { decrement: 1 },
    },
  });

  return NextResponse.json({ success: true });
}