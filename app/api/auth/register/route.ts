import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";

import { sendEmail } from "@/lib/email";

import { NextResponse } from "next/server";

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
      name,
      email,
      password,
      acceptedTerms,
    } = body;

    /* =========================================
       CLEAN INPUT
    ========================================= */

    const cleanName =
      name?.trim();

    const cleanEmail =
      email
        ?.trim()
        ?.toLowerCase();

    /* =========================================
       VALIDATION
    ========================================= */

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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        cleanEmail
      )
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

    /* =========================================
       EXISTING USER
    ========================================= */

    const existingUser =
      await prisma.user.findUnique(
        {
          where: {
            email:
              cleanEmail,
          },
        }
      );

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

    /* =========================================
       HASH PASSWORD
    ========================================= */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    /* =========================================
       OTP
    ========================================= */

    const otp =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

    const otpExpiry =
      new Date(
        Date.now() +
          1000 *
            60 *
            5
      );

    /* =========================================
       CREATE / UPDATE USER
    ========================================= */

    let user;

    if (existingUser) {

      user =
        await prisma.user.update(
          {
            where: {
              email:
                cleanEmail,
            },

            data: {
              name:
                cleanName,

              password:
                hashedPassword,

              otp,

              otpExpiry,

              acceptedTerms:
                true,

              acceptedAt:
                new Date(),
            },
          }
        );

    } else {

      user =
        await prisma.user.create(
          {
            data: {
              name:
                cleanName,

              email:
                cleanEmail,

              password:
                hashedPassword,

              role:
                "USER",

              isVerified:
                false,

              otp,

              otpExpiry,

              acceptedTerms:
                true,

              acceptedAt:
                new Date(),
            },
          }
        );
    }

    /* =========================================
       FREE PLAN
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

    if (product) {

      const freePlan =
        await prisma.plan.findFirst(
          {
            where: {
              productId:
                product.id,

              name:
                "Free",
            },
          }
        );

      if (freePlan) {

        const existingSubscription =
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

        if (
          !existingSubscription
        ) {

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
                        30
                  ),
              },
            }
          );
        }
      }
    }

    /* =========================================
       ONBOARDING
    ========================================= */

    await prisma.userOnboarding.upsert(
      {
        where: {
          userId:
            user.id,
        },

        update: {},

        create: {
          userId:
            user.id,
        },
      }
    );

    /* =========================================
       EMAIL HTML
    ========================================= */

    const html = `
      <div style="font-family:Arial;padding:30px;max-width:500px;margin:auto;">

        <h1 style="color:#f97316;">
          Verify Your Account
        </h1>

        <p>
          Hi ${cleanName},
        </p>

        <p>
          Use the verification code below:
        </p>

        <div style="
          font-size:36px;
          font-weight:bold;
          letter-spacing:8px;
          margin:30px 0;
          color:#111827;
        ">
          ${otp}
        </div>

        <p>
          This code expires in 5 minutes.
        </p>

        <p style="margin-top:40px;">
          — KoniqTech
        </p>

      </div>
    `;

    /* =========================================
       SEND EMAIL
    ========================================= */

    await sendEmail({
      to:
        cleanEmail,

      subject:
        "Verify Your KoniqTech Account",

      html,
    });

    /* =========================================
       RESPONSE
    ========================================= */

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