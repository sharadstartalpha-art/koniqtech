import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session.projectId || !session.teamId) {
    return NextResponse.json(
      { error: "Unauthorized or missing team/project" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // ✅ CREATE SAMPLE LEAD
  await prisma.lead.createMany({
    data: [
      {
        email: "lead@example.com", // ✅ FIXED
        name: "Sample Lead",
        company: "Demo Inc",
        title: "Founder",

        userId: user.id,
        projectId: session.projectId,
        teamId: session.teamId, // ✅ REQUIRED FIX

        source: "onboarding",
      },
    ],
  });

  return NextResponse.json({ success: true });
}