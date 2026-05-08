import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       GET BODY
    ========================= */

    const {
      email,
      otp,
      password,
    } = await req.json();

    /* =========================
       VALIDATION
    ========================= */

    if (
      !email ||
      !otp ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       PASSWORD RULE
    ========================= */

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (
      !strongPassword.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Password must contain 8 chars, uppercase, lowercase & number",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FIND USER
    ========================= */

    const user =
      await prisma.user.findUnique(
        {
          where: {
            email: email
              .trim()
              .toLowerCase(),
          },
        }
      );

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       INVALID OTP
    ========================= */

    if (user.otp !== otp) {
      return NextResponse.json(
        {
          error:
            "Invalid OTP",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       OTP EXPIRED
    ========================= */

    if (
      !user.otpExpiry ||
      new Date() >
        new Date(
          user.otpExpiry
        )
    ) {
      return NextResponse.json(
        {
          error:
            "OTP expired",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashed =
      await bcrypt.hash(
        password,
        10
      );

    /* =========================
       UPDATE USER
    ========================= */

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        password: hashed,

        otp: null,

        otpExpiry: null,
      },
    });

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "RESET PASSWORD ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Reset failed",
      },
      {
        status: 500,
      }
    );
  }
}