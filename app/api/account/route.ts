import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    /* =========================
       AUTH
    ========================= */

    const user =
      await getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================
       GET ACTIVE SUBSCRIPTION
    ========================= */

    const subscription =
      await prisma.subscription.findFirst(
        {
          where: {
            userId: user.id,

            status: "active",
          },

          include: {
            plan: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        }
      );

    /* =========================
       DEFAULT VALUES
    ========================= */

    let plan = "Free";

    let invoiceLimit:
      | number
      | null = 10;

    let expiresAt:
      | Date
      | null = null;

    /* =========================
       SAFE PLAN ACCESS
    ========================= */

    if (
      subscription &&
      subscription.plan
    ) {
      plan =
        subscription.plan.name;

      invoiceLimit =
        subscription.plan
          .invoiceLimit ?? null;

      expiresAt =
        subscription.expiresAt;
    }

    /* =========================
       USED INVOICES
    ========================= */

    const used =
      await prisma.invoice.count(
        {
          where: {
            userId: user.id,
          },
        }
      );

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      plan,

      invoiceLimit,

      expiresAt,

      used,
    });

  } catch (error) {
    console.error(
      "ACCOUNT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load account",
      },
      {
        status: 500,
      }
    );
  }
}