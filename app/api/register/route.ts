import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    /* =========================
       📥 INPUT
    ========================= */
    const body = await req.json();

    const {
      name,
      email,
      password,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    /* =========================
       🔍 EXISTING USER
    ========================= */
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    /* =========================
       🔒 HASH PASSWORD
    ========================= */
    const hashed = await bcrypt.hash(password, 10);

    /* =========================
       👤 CREATE USER
    ========================= */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    /* =========================
       🎁 ASSIGN FREE PLAN
    ========================= */
    const product = await prisma.product.findUnique({
      where: {
        slug: "invoice-recovery",
      },
    });

    const freePlan = await prisma.plan.findFirst({
      where: {
        name: "Free",
        productId: product?.id,
      },
    });

    if (product && freePlan) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          productId: product.id,
          planId: freePlan.id,

          status: "ACTIVE",

          currentPeriodEnd: new Date(
            Date.now() +
              1000 * 60 * 60 * 24 * 365
          ),
        },
      });
    }

    /* =========================
       ✅ RESPONSE
    ========================= */
    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}