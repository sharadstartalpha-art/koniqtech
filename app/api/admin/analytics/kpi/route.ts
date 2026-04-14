import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const revenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const users = await prisma.user.count();

  const creditsUsed = await prisma.transaction.count({
    where: { type: "USAGE" },
  });

  const subs = await prisma.subscription.count({
    where: { status: "ACTIVE" },
  });

  return NextResponse.json({
    revenue: revenue._sum.amount || 0,
    users,
    creditsUsed,
    subs,
  });
}