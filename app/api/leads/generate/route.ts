import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    include: { balance: true },
  });

  console.log("API USER ID:", user?.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.balance || user.balance.balance <= 0) {
    return NextResponse.json({ error: "No credits" }, { status: 400 });
  }

  // ✅ CREATE LEAD
  await prisma.lead.create({
    data: {
      name: "Generated Lead",
      email: `lead${Date.now()}@test.com`,
      userId: user.id,
    },
  });

  // ✅ DEDUCT CREDIT
  await prisma.balance.update({
    where: { userId: user.id },
    data: {
      balance: {
        decrement: 1,
      },
    },
  });

  return NextResponse.json({ success: true });
}