import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ balance: 0 });
  }

  const balance = await prisma.balance.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    balance: balance?.amount || 0, // ✅ FIXED
  });
}