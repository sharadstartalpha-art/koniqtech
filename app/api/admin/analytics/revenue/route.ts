import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const data: any = {};

  payments.forEach((p) => {
    const date = new Date(p.createdAt).toLocaleDateString();

    if (!data[date]) data[date] = 0;

    data[date] += p.amount;
  });

  const formatted = Object.keys(data).map((date) => ({
    date,
    revenue: data[date],
  }));

  return NextResponse.json(formatted);
}