import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       INPUT
    ========================= */

    const body = await req.json();

    const {
      id,
      paidAmount,
    } = body;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Invoice ID required",
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
      await prisma.invoice.findUnique(
        {
          where: {
            id,
          },
        }
      );

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
      Number(
        invoice.paidAmount || 0
      );

    const totalAmount =
      Number(invoice.amount);

    /* =========================
       PAYMENT LOGIC
    ========================= */

    let paymentToAdd = 0;

    // ✅ partial payment
    if (
      paidAmount !== undefined &&
      paidAmount !== null
    ) {
      paymentToAdd =
        Number(paidAmount);

      if (
        isNaN(paymentToAdd) ||
        paymentToAdd <= 0
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

    } else {
      // ✅ full remaining balance
      paymentToAdd =
        totalAmount -
        currentPaid;
    }

    /* =========================
       PREVENT OVERPAYMENT
    ========================= */

    const remainingBalance =
      totalAmount -
      currentPaid;

    if (
      paymentToAdd >
      remainingBalance
    ) {
      return NextResponse.json(
        {
          error:
            "Payment exceeds remaining balance",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FINAL VALUES
    ========================= */

    const updatedPaid =
      currentPaid +
      paymentToAdd;

    const balance =
      totalAmount -
      updatedPaid;

    const status =
      balance <= 0
        ? "paid"
        : "unpaid";

    /* =========================
       UPDATE INVOICE
    ========================= */

    const updatedInvoice =
      await prisma.invoice.update(
        {
          where: {
            id,
          },

          data: {
            paidAmount:
              updatedPaid,

            status,

            paidAt:
              status === "paid"
                ? new Date()
                : null,
          },
        }
      );

    /* =========================
       SAVE PAYMENT HISTORY
    ========================= */

    await prisma.payment.create(
      {
        data: {
          userId:
            invoice.userId,

          productId:
            invoice.productId,

          invoiceId:
            invoice.id,

          amount:
            paymentToAdd,

          status:
            "completed",
        },
      }
    );

    /* =========================
       RESPONSE
    ========================= */

    return NextResponse.json({
      success: true,

      invoice:
        updatedInvoice,

      payment: {
        added:
          paymentToAdd,

        totalPaid:
          updatedPaid,

        remaining:
          balance,
      },
    });

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