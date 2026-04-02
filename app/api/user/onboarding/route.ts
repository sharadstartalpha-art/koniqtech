import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // 🔥 Generate starter leads automatically
  await prisma.lead.createMany({
    data: [
      {
        userId: user!.id,
        name: "Sample Lead",
        contactEmail: "lead@example.com",
        company: "Demo Inc",
        source: "onboarding",
      },
    ],
  });

  return NextResponse.json({ success: true });
}