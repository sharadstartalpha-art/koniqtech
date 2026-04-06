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
      return NextResponse.json(
        { error: "No credits left" },
        { status: 400 }
      );
    }

    // ✅ FIX: GET PROJECT PROPERLY
    const project = user.projects[0];

    if (!project) {
      return NextResponse.json(
        { error: "No project found" },
        { status: 400 }
      );
    }

    // ✅ CREATE LEAD
    const lead = await prisma.lead.create({
      data: {
        userId: user.id,
        projectId: project.id, // 🔥 FIXED

        name: "Generated Lead",
        email: `lead${Date.now()}@test.com`,
        contactEmail: `lead${Date.now()}@test.com`,
        company: "Test Company",
      },
    });

    // ✅ DEDUCT CREDIT
    await prisma.userBalance.update({
      where: { userId: user.id },
      data: {
        balance: {
          decrement: 1,
        },
      },
    });

    console.log("✅ LEAD:", lead);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}