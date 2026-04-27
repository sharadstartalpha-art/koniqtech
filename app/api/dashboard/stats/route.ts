import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany();

  const totalRecovered = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  return NextResponse.json({
    recovered: totalRecovered,
    pending: totalPending,
    count: invoices.length,
  });
}