import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    /* =========================
       INPUT
    ========================= */

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email & password required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       CHECK EXISTING USER
    ========================= */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    /* =========================
       ALREADY REGISTERED
    ========================= */

    if (existingUser?.isVerified) {
      return NextResponse.json(
        {
          error: "User already registered",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashed = await bcrypt.hash(
      password,
      10
    );

    /* =========================
       GENERATE OTP
    ========================= */

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiry = new Date(
      Date.now() + 1000 * 60 * 5
    );

    /* =========================
       CREATE / UPDATE USER
    ========================= */

    let user;

    if (existingUser) {
      /* UPDATE UNVERIFIED USER */

      user = await prisma.user.update({
        where: {
          email,
        },

        data: {
          password: hashed,
          otp,
          otpExpiry: expiry,
        },
      });

    } else {
      /* CREATE NEW USER */

      user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          isVerified: false,
          otp,
          otpExpiry: expiry,
        },
      });
    }

    /* =========================
       ASSIGN FREE PLAN
    ========================= */

    const product =
      await prisma.product.findUnique({
        where: {
          slug: "invoice-recovery",
        },
      });

    if (product) {
      const freePlan =
        await prisma.plan.findFirst({
          where: {
            productId: product.id,
            name: "Free",
          },
        });

      if (freePlan) {
        const existingSub =
          await prisma.subscription.findFirst({
            where: {
              userId: user.id,
              productId: product.id,
            },
          });

        if (!existingSub) {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              productId: product.id,
              planId: freePlan.id,

              status: "ACTIVE",

              currentPeriodEnd:
                new Date(
                  Date.now() +
                    1000 *
                      60 *
                      60 *
                      24 *
                      7
                ),
            },
          });
        }
      }
    }

    /* =========================
       EMAIL TEMPLATE
    ========================= */

    const html = `
      <div style="font-family: Arial;">
        <h2>Your OTP Code</h2>

        <p>
          Use this OTP to verify your account:
        </p>

        <h1 style="letter-spacing:4px;">
          ${otp}
        </h1>

        <p>
          This OTP will expire in 5 minutes.
        </p>
      </div>
    `;

    const text = `Your OTP is: ${otp}`;

    /* =========================
       SEND EMAIL
    ========================= */

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html,
      text,
    });

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "REGISTER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error: "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}