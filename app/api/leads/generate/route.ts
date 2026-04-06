import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 get user balance
    const balance = await prisma.userBalance.findUnique({
      where: { userId: session.user.id },
    });

    if (!balance || balance.balance <= 0) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 400 }
      );
    }

    // 🔥 create fake lead (example)
    const lead = await prisma.lead.create({
      data: {
        userId: session.user.id,
        name: "New Lead",
        email: `lead${Date.now()}@test.com`,
      },
    });

    // 🔥 deduct credit
    await prisma.userBalance.update({
      where: { userId: session.user.id },
      data: {
        balance: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error("GENERATE LEAD ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}