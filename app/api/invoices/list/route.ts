import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    /* =========================
       GET LOGGED-IN USER
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
       GET USER INVOICES ONLY
    ========================= */

    const invoices =
      await prisma.invoice.findMany({
        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(invoices);

  } catch (err) {
    console.error(
      "INVOICE LIST ERROR:",
      err
    );

    return NextResponse.json(
      {
        error: "Failed to load invoices",
      },
      {
        status: 500,
      }
    );
  }
}