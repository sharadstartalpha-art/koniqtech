import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    /* =========================
       AUTH
    ========================= */

    const user = await getUser();

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
       GET INVOICES + PAYMENTS
    ========================= */

    const invoices =
      await prisma.invoice.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        include: {
          payments: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json(
      invoices
    );

  } catch (err) {

    console.error(
      "INVOICE LIST ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load invoices",
      },
      {
        status: 500,
      }
    );
  }
}