import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession();

  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 Update user plan
  await prisma.userCredits.update({
    where: { userId },
    data: {
      credits: 2000,
      plan: "GROWTH",
    },
  });

  return NextResponse.json({ success: true });
}