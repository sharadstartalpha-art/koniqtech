import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || !session.projectId) {
    return NextResponse.json(
      { error: "Unauthorized or no project selected" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ Generate starter lead
  await prisma.lead.createMany({
    data: [
      {
        userId: user.id,
        projectId: session.projectId, // ✅ FIXED
        name: "Sample Lead",
        contactEmail: "lead@example.com",
        company: "Demo Inc",
      },
    ],
  });

  return NextResponse.json({ success: true });
}