import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {

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

    const body =
      await req.json();

    const {
      clientName,
      clientEmail,
      amount,
    } = body;

    if (
      !clientEmail ||
      !amount
    ) {

      return NextResponse.json(
        {
          error:
            "Missing fields",
        },
        {
          status: 400,
        }
      );
    }

    const product =
      await prisma.product.findFirst(
        {
          where: {
            slug:
              "invoice-recovery",
          },
        }
      );

    if (!product) {

      return NextResponse.json(
        {
          error:
            "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    const invoice =
      await prisma.invoice.create(
        {
          data: {
            userId:
              user.id,

            productId:
              product.id,

            clientName,

            clientEmail,

            amount:
              Number(amount),

            dueDate:
              new Date(),

            status:
              "UNPAID",

            mode:
              "manual",
          },
        }
      );

    await prisma.onboardingProgress.upsert(
      {
        where: {
          userId:
            user.id,
        },

        update: {
          createdInvoice:
            true,
        },

        create: {
          userId:
            user.id,

          createdInvoice:
            true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      invoice,
    });

  } catch (err) {

    console.error(
      "CREATE INVOICE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to create invoice",
      },
      {
        status: 500,
      }
    );
  }
}