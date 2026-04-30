import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        price: "asc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        invoiceLimit: true,
        paypalPlanId: true,
        productId: true, // ✅ ADD THIS
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("PLANS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}