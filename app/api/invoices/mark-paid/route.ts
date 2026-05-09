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
       VALUES
    ========================= */

    const currentPaid =
      Number(invoice.paidAmount || 0);

    const totalAmount =
      Number(invoice.amount);

    let paymentToAdd = 0;

    /* =========================
       PARTIAL / FULL PAYMENT
    ========================= */

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
      paymentToAdd =
        totalAmount -
        currentPaid;
    }

    /* =========================
       CALCULATE
    ========================= */

    const updatedPaid =
      currentPaid +
      paymentToAdd;

    const cappedPaid =
      Math.min(
        updatedPaid,
        totalAmount
      );

    const balance =
      totalAmount -
      cappedPaid;

    const status =
      balance <= 0
        ? "paid"
        : "unpaid";

    /* =========================
       TRANSACTION
    ========================= */

    const updatedInvoice =
      await prisma.$transaction(
        async (tx) => {

          /* UPDATE INVOICE */

          const invoiceUpdated =
            await tx.invoice.update({
              where: {
                id,
              },

              data: {
                paidAmount:
                  cappedPaid,

                status,

                paidAt:
                  status === "paid"
                    ? new Date()
                    : null,
              },
            });

          /* CREATE PAYMENT HISTORY */

          await tx.payment.create({
            data: {
              userId:
                invoice.userId,

              productId:
                invoice.productId,

              invoiceId:
                invoice.id,

              amount:
                paymentToAdd,

              status: "paid",
            },
          });

          return invoiceUpdated;
        }
      );

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