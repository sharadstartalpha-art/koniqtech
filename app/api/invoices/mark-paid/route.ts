import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       INPUT
    ========================= */

    const {
      id,
      paidAmount,
    } = await req.json();

    if (
      !id ||
      !paidAmount ||
      Number(paidAmount) <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid payment amount",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FIND INVOICE
    ========================= */

    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id,
        },
      });

    if (!invoice) {
      return NextResponse.json(
        {
          error:
            "Invoice not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       CURRENT VALUES
    ========================= */

    const currentPaid =
      Number(invoice.paidAmount || 0);

    const totalAmount =
      Number(invoice.amount);

    /* =========================
       NEW VALUES
    ========================= */

    const updatedPaid =
      currentPaid +
      Number(paidAmount);

    const balance =
      totalAmount - updatedPaid;

    const status =
      updatedPaid >= totalAmount
        ? "paid"
        : "unpaid";

    /* =========================
       UPDATE
    ========================= */

    const updatedInvoice =
      await prisma.invoice.update({
        where: {
          id,
        },

        data: {
          paidAmount: updatedPaid,

          status,

          paidAt:
            status === "paid"
              ? new Date()
              : null,
        },
      });

    return NextResponse.json(
      updatedInvoice
    );

  } catch (err) {
    console.error(
      "MARK PAID ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to update payment",
      },
      {
        status: 500,
      }
    );
  }
}