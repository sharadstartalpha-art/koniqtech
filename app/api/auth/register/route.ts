import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import { sendEmail } from "@/lib/email";

import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    /* =========================
       INPUT
    ========================= */

    const {
      name,
      email,
      password,
      acceptedTerms,
    } = await req.json();

    /* =========================
       CLEAN INPUT
    ========================= */

    const cleanName =
      name?.trim();

    const cleanEmail = email
      ?.trim()
      ?.toLowerCase();

    /* =========================
       REQUIRED
    ========================= */

    if (
      !cleanName ||
      !cleanEmail ||
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
       TERMS
    ========================= */

    if (!acceptedTerms) {
      return NextResponse.json(
        {
          error:
            "Please accept terms",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       EMAIL VALIDATION
    ========================= */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(cleanEmail)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid email address",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       PASSWORD VALIDATION
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
            "Weak password",
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
          email: cleanEmail,
        },
      });

    /* =========================
       ALREADY REGISTERED
    ========================= */

    if (
      existingUser?.isVerified
    ) {
      return NextResponse.json(
        {
          error:
            "User already registered",
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
       GENERATE OTP
    ========================= */

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    const expiry = new Date(
      Date.now() +
        1000 * 60 * 5
    );

    /* =========================
       CREATE / UPDATE USER
    ========================= */

    let user;

    if (existingUser) {
      /* UPDATE UNVERIFIED USER */

      user =
        await prisma.user.update({
          where: {
            email: cleanEmail,
          },

          data: {
            name: cleanName,

            password: hashed,

            otp,

            otpExpiry: expiry,

            acceptedTerms: true,

            acceptedAt:
              new Date(),
          },
        });

    } else {
      /* CREATE NEW USER */

      user =
        await prisma.user.create({
          data: {
            name: cleanName,

            email: cleanEmail,

            password: hashed,

            role: "USER",

            isVerified: false,

            otp,

            otpExpiry: expiry,

            acceptedTerms: true,

            acceptedAt:
              new Date(),
          },
        });
    }

    /* =========================
       ASSIGN FREE PLAN
    ========================= */

    const product =
      await prisma.product.findUnique(
        {
          where: {
            slug:
              "invoice-recovery",
          },
        }
      );

    if (product) {
      const freePlan =
        await prisma.plan.findFirst(
          {
            where: {
              productId:
                product.id,

              name: "Free",
            },
          }
        );

      if (freePlan) {
        const existingSub =
          await prisma.subscription.findFirst(
            {
              where: {
                userId:
                  user.id,

                productId:
                  product.id,
              },
            }
          );

        if (!existingSub) {
          await prisma.subscription.create(
            {
              data: {
                userId:
                  user.id,

                productId:
                  product.id,

                planId:
                  freePlan.id,

                status:
                  "ACTIVE",

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
            }
          );
        }
      }
    }

    /* =========================
       EMAIL TEMPLATE
    ========================= */

    const html = `
      <div style="font-family: Arial; max-width:500px; margin:auto; padding:20px;">

        <h2 style="color:#f97316;">
          KoniqTech Verification
        </h2>

        <p>
          Hi ${cleanName},
        </p>

        <p>
          Use the OTP below to verify your account:
        </p>

        <div
          style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            margin:30px 0;
            color:#111827;
          "
        >
          ${otp}
        </div>

        <p>
          This OTP will expire in 5 minutes.
        </p>

        <p style="margin-top:30px;">
          — KoniqTech Team
        </p>

      </div>
    `;

    const text = `
      Hi ${cleanName},

      Your OTP code is:

      ${otp}

      This OTP expires in 5 minutes.
    `;

    /* =========================
       SEND EMAIL
    ========================= */

    await sendEmail({
      to: cleanEmail,

      subject:
        "Verify Your KoniqTech Account",

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
        error:
          "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}