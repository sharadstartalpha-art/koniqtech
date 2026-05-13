import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

/* =========================================
   GET PAYMENT SETTINGS
========================================= */

export async function GET() {
  try {

    /* =====================================
       AUTH
    ===================================== */

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { payload } =
      await jwtVerify(
        token,
        secret
      );

    const userId =
      payload.id as string;

    /* =====================================
       USER
    ===================================== */

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          paypalMe: true,

          stripeLink: true,

          razorpayLink: true,

          customPaymentLink: true,

          bankName: true,

          accountName: true,

          accountNumber: true,

          ifscCode: true,

          upiId: true,
        },
      });

    return NextResponse.json(
      user || {}
    );

  } catch (error) {

    console.error(
      "GET PAYMENT SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load payment settings",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   UPDATE PAYMENT SETTINGS
========================================= */

export async function POST(
  req: Request
) {
  try {

    /* =====================================
       BODY
    ===================================== */

    const body =
      await req.json();

    const {
      paypalMe,
      stripeLink,
      razorpayLink,
      customPaymentLink,
      bankName,
      accountName,
      accountNumber,
      ifscCode,
      upiId,
    } = body;

    /* =====================================
       AUTH
    ===================================== */

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { payload } =
      await jwtVerify(
        token,
        secret
      );

    const userId =
      payload.id as string;

    /* =====================================
       UPDATE USER
    ===================================== */

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          paypalMe:
            paypalMe || null,

          stripeLink:
            stripeLink || null,

          razorpayLink:
            razorpayLink || null,

          customPaymentLink:
            customPaymentLink ||
            null,

          bankName:
            bankName || null,

          accountName:
            accountName || null,

          accountNumber:
            accountNumber || null,

          ifscCode:
            ifscCode || null,

          upiId:
            upiId || null,
        },
      });

    return NextResponse.json({
      success: true,

      user,
    });

  } catch (error) {

    console.error(
      "SAVE PAYMENT SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to save payment settings",
      },
      {
        status: 500,
      }
    );
  }
}