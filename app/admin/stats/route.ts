import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // ✅ TOTAL USERS
  const users = await prisma.user.count();

  // ✅ TOTAL LEADS
  const leads = await prisma.lead.count();

  // ✅ TOTAL REVENUE (example from transactions)
  const transactions = await prisma.transaction.findMany();

  const revenue = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );

  // ✅ SIMPLE CHART DATA (can improve later)
  const chart = [
    { name: "Mon", users: 5, revenue: 20 },
    { name: "Tue", users: 8, revenue: 50 },
    { name: "Wed", users: 12, revenue: 80 },
    { name: "Thu", users: 15, revenue: 120 },
    { name: "Fri", users: 20, revenue: 200 },
  ];

  return NextResponse.json({
    stats: { users, revenue, leads },
    chart,
  });
}