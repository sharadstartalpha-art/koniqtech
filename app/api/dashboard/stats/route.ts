import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany();

  const recovered = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  const pending = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((sum, i) => sum + i.amount, 0);

  const count = invoices.length;

  // 🔥 AI INSIGHTS LOGIC
  let insights = "No insights yet";

  if (pending > recovered) {
    insights =
      "You have more pending payments than recovered. Consider sending reminders.";
  } else if (recovered > 0) {
    insights =
      "Great job! Your recovery rate is healthy. Keep it up.";
  }

  return NextResponse.json({
    recovered,
    pending,
    count,
    insights, // ✅ ALWAYS INCLUDED
  });
}