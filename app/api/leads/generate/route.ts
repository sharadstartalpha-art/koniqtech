import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 find user's project
    const project = await prisma.project.findFirst({
      where: { userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "No project found" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: "Test Lead",
        email: `lead${Date.now()}@test.com`,
        userId: session.user.id,
        projectId: project.id, // 🔥 IMPORTANT
      },
    });

    console.log("LEAD CREATED:", lead);

    return NextResponse.json({ success: true, lead });

  } catch (error) {
    console.error("GENERATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}