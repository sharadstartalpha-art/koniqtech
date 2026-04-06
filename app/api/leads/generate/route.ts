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

    // ✅ get project
    const project = await prisma.project.findFirst({
      where: { userId: session.user.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "No project found" },
        { status: 400 }
      );
    }

    // ✅ CREATE LEAD (ALL REQUIRED FIELDS)
    const lead = await prisma.lead.create({
      data: {
        userId: session.user.id,
        projectId: project.id,

        name: "Generated Lead",
        email: `lead${Date.now()}@test.com`,
        contactEmail: `lead${Date.now()}@test.com`, // 🔥 MUST
        company: "Test Company",
      },
    });

    console.log("✅ CREATED:", lead);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate lead" },
      { status: 500 }
    );
  }
}