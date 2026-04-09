import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const projectId = session.user.projectId; // ✅ FIXED

  if (!projectId) {
    return NextResponse.json(
      { error: "No project selected" },
      { status: 400 }
    );
  }

  await prisma.lead.create({
    data: {
      name: "Generated Lead",
      email: `lead${Date.now()}@test.com`,
      userId: user.id,
      projectId,
    },
  });

  return NextResponse.json({ success: true });
}