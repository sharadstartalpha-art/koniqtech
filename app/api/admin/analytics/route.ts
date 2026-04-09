import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // ✅ USERS (group by date)
  const users = await prisma.user.findMany({
    select: { createdAt: true },
  });

  // ✅ PAYMENTS (revenue)
  const payments = await prisma.transaction.findMany({
  
    select: { createdAt: true, amount: true },
  });

  // ✅ LEADS
  const leads = await prisma.lead.findMany({
    select: { createdAt: true },
  });

  // 🔥 HELPER: group by date
  const groupByDate = (items: any[], field = "createdAt") => {
    const map: any = {};

    items.forEach((item) => {
      const date = new Date(item[field]).toLocaleDateString();

      if (!map[date]) {
        map[date] = { date, users: 0, revenue: 0, leads: 0 };
      }
    });

    return map;
  };

  const dataMap: any = groupByDate(users);

  // USERS COUNT
  users.forEach((u) => {
    const date = new Date(u.createdAt).toLocaleDateString();
    dataMap[date].users += 1;
  });

  // REVENUE SUM
  payments.forEach((p) => {
    const date = new Date(p.createdAt).toLocaleDateString();

    if (!dataMap[date]) {
      dataMap[date] = { date, users: 0, revenue: 0, leads: 0 };
    }

    dataMap[date].revenue += p.amount;
  });

  // LEADS COUNT
  leads.forEach((l) => {
    const date = new Date(l.createdAt).toLocaleDateString();

    if (!dataMap[date]) {
      dataMap[date] = { date, users: 0, revenue: 0, leads: 0 };
    }

    dataMap[date].leads += 1;
  });

  const chartData = Object.values(dataMap);

  return NextResponse.json(chartData);
}