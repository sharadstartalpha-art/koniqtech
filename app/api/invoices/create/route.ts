import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function POST(
  req: Request
) {
  try {

    /* =========================================
       BODY
    ========================================= */

    const body =
      await req.json();

    const {
      clientEmail,
      clientName,
      clientPhone,
      amount,
      dueDate,
      mode,
    } = body;

    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !clientEmail ||
      !amount ||
      !dueDate
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       AUTH
    ========================================= */

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    let userId = "";

    try {

      const { payload } =
        await jwtVerify(
          token,
          JWT_SECRET
        );

      userId =
        payload.id as string;

    } catch {

      return NextResponse.json(
        {
          error:
            "Invalid session",
        },
        {
          status: 401,
        }
      );
    }

    /* =========================================
       PRODUCT
    ========================================= */

    const product =
      await prisma.product.findUnique(
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

    /* =========================================
       ACTIVE SUBSCRIPTION
    ========================================= */

    const subscription =
      await prisma.subscription.findFirst(
        {
          where: {
            userId,

            productId:
              product.id,

            status: {
              equals:
                "ACTIVE",

              mode:
                "insensitive",
            },
          },

          include: {
            plan: true,
          },

          orderBy: {
            createdAt:
              "desc",
          },
        }
      );

    if (!subscription) {

      return NextResponse.json(
        {
          error:
            "No active subscription",
        },
        {
          status: 403,
        }
      );
    }

    /* =========================================
       LIMIT CHECK
    ========================================= */

    const limit =
      subscription.plan
        ?.invoiceLimit;

    const totalInvoices =
      await prisma.invoice.count(
        {
          where: {
            userId,

            productId:
              product.id,
          },
        }
      );

    if (
      limit !== null &&
      limit !== -1 &&
      totalInvoices >= limit
    ) {

      return NextResponse.json(
        {
          error:
            "Invoice limit reached",
        },
        {
          status: 403,
        }
      );
    }

    /* =========================================
       CREATE INVOICE
    ========================================= */

    const invoice =
      await prisma.invoice.create(
        {
          data: {
            userId,

            productId:
              product.id,

            clientEmail,

            clientName:
              clientName ||
              null,

            clientPhone:
              clientPhone ||
              null,

            amount:
              Number(amount),

            dueDate:
              new Date(
                dueDate
              ),

            status:
              "UNPAID",

            mode:
              mode ||
              "manual",
          },
        }
      );

    /* =========================================
       PAYMENT LINK
    ========================================= */

    const paymentLink =
      `https://www.paypal.com/paypalme/koniqtech/${invoice.amount}?note=${invoice.id}`;

    const updatedInvoice =
      await prisma.invoice.update(
        {
          where: {
            id:
              invoice.id,
          },

          data: {
            paymentLink,
          },
        }
      );

    /* =========================================
       ONBOARDING UPDATE
    ========================================= */

    await prisma.userOnboarding.upsert(
      {
        where: {
          userId,
        },

        update: {
          firstInvoice:
            true,
        },

        create: {
          userId,

          firstInvoice:
            true,
        },
      }
    );

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,

      invoice:
        updatedInvoice,
    });

  } catch (error: any) {

    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create invoice",

        details:
          error?.message ||
          null,
      },
      {
        status: 500,
      }
    );
  }
}