import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    /* =========================
       AUTH
    ========================= */
    const cookieStore = await cookies();
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
       FETCH USER
    ========================= */
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { plan: true },
        },
        invoices: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const sub = user.subscriptions[0];
    const hasActive = !!sub;

    /* =========================
       RESPONSE LOGIC
    ========================= */
    let plan = "Free";
    let expiresAt: Date | null = null;
    let invoiceLimit: number | null = 0;

    if (hasActive) {
      plan = sub.plan.name;
      expiresAt = sub.expiresAt;
      invoiceLimit = sub.plan.invoiceLimit;
    }

    const used = user.invoices.length;

    return NextResponse.json({
      plan,
      expiresAt,
      invoiceLimit,
      used,
    });

  } catch (err) {
    console.error("ACCOUNT ERROR:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}