import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    /* =========================
       📥 INPUT
    ========================= */
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    /* =========================
       🔐 HASH PASSWORD
    ========================= */
    const hashed = await bcrypt.hash(password, 10);

    /* =========================
       🔢 GENERATE OTP
    ========================= */
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiry = new Date(
      Date.now() + 1000 * 60 * 5
    ); // 5 mins

    /* =========================
       👤 UPSERT USER
    ========================= */
    const user = await prisma.user.upsert({
      where: { email },

      update: {
        password: hashed,
        isVerified: false,
        otp,
        otpExpiry: expiry,
      },

      create: {
        email,
        password: hashed,
        isVerified: false,
        otp,
        otpExpiry: expiry,
      },
    });

    /* =========================
       🎁 ASSIGN FREE PLAN
       (ONLY IF NOT EXISTS)
    ========================= */
    const product = await prisma.product.findUnique({
      where: {
        slug: "invoice-recovery",
      },
    });

    if (product) {
      const freePlan = await prisma.plan.findFirst({
        where: {
          productId: product.id,
          name: "Free",
        },
      });

      if (freePlan) {
        // check existing subscription
        const existingSub =
          await prisma.subscription.findFirst({
            where: {
              userId: user.id,
              productId: product.id,
            },
          });

        // create only once
        if (!existingSub) {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              productId: product.id,
              planId: freePlan.id,

              status: "ACTIVE",

              // ✅ 7 DAY FREE TRIAL
              currentPeriodEnd: new Date(
                Date.now() +
                  1000 * 60 * 60 * 24 * 7
              ),
            },
          });
        }
      }
    }

    /* =========================
       📧 EMAIL CONTENT
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
       📤 SEND EMAIL
    ========================= */
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html,
      text,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

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