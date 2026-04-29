import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    // 🔐 GET TOKEN
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 VERIFY JWT
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    // ✅ FETCH USER INVOICES
    const invoices = await prisma.invoice.findMany({
      where: { userId },
    });

    const recovered = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.amount, 0);

    const pending = invoices
      .filter((i) => i.status === "unpaid")
      .reduce((sum, i) => sum + i.amount, 0);

    const count = invoices.length;

    // 🤖 AI INSIGHTS
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
      insights,
    });
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}