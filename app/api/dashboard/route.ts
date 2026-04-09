import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
    include: { balance: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const leadsCount = await prisma.lead.count({
    where: { userId: user.id },
  });

  return NextResponse.json({
    leadsCount,
    credits: user.balance?.amount || 0,
  });
}