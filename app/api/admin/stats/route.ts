import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.count();

  const subs = await prisma.subscription.findMany({
    where: { status: "active" },
  });

  const mrr = subs.length * 29; // your pricing

  const revenue = await prisma.invoice.aggregate({
    _sum: { amount: true },
  });

  return NextResponse.json({
    users,
    mrr,
    revenue: revenue._sum.amount || 0,
  });
}