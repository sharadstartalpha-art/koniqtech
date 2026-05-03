import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

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

    const sub = user?.subscriptions[0];
const hasActive = !!sub;
    return NextResponse.json({
  plan: hasActive ? sub.plan.name : "Free",
  expiresAt: hasActive ? sub.expiresAt : null,
  invoiceLimit: hasActive ? sub.plan.invoiceLimit : 0,
  used: user?.invoices.length || 0,
});

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}