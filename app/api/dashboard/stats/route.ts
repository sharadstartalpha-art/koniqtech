import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    /* =========================
       🔐 AUTH
    ========================= */
    const cookieStore = await cookies(); // ✅ FIX
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    /* =========================
       📦 FETCH INVOICES
    ========================= */
    const invoices = await prisma.invoice.findMany({
      where: { userId },
    });

    /* =========================
       💰 CALCULATIONS
    ========================= */
    let recovered = 0;
    let pending = 0;

    invoices.forEach((inv) => {
      const amount = Number(inv.amount || 0);

      if (inv.status?.toLowerCase() === "paid") {
        recovered += amount;
      } else {
        pending += amount;
      }
    });

    const count = invoices.length;

    /* =========================
       🤖 AI INSIGHTS
    ========================= */
    let insights = "No insights yet";

    if (pending === 0 && recovered > 0) {
      insights = "🎉 All invoices are paid. Excellent work!";
    } else if (pending > recovered) {
      insights =
        "⚠️ You have more pending than recovered. Send reminders.";
    } else if (recovered > 0) {
      insights =
        "✅ Good recovery rate. Keep following up.";
    }

    /* =========================
       🚀 RESPONSE
    ========================= */
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