import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.count();
  const subs = await prisma.subscription.count({
    where: { status: "active" },
  });

  const paid = await prisma.invoice.count({
    where: { status: "paid" },
  });

  const revenue = await prisma.invoice.aggregate({
    _sum: { amount: true },
    where: { status: "paid" },
  });

  return NextResponse.json({
    users,
    subs,
    paid,
    revenue: revenue._sum.amount || 0,
  });
}