import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, plan, workspaceId, planId } = body;

  const PLAN_DATA: any = {
    PRO: { credits: 5000, price: 29 },
    ENTERPRISE: { credits: 20000, price: 99 },
  };

  const selectedPlan = PLAN_DATA[plan];

  if (!selectedPlan) {
    return NextResponse.json({ error: "Invalid plan" });
  }

  // ✅ USER UPDATE
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      credits: {
        increment: selectedPlan.credits,
      },
    },
  });

  // ✅ PAYMENT RECORD
  await prisma.payment.create({
    data: {
      userId,
      amount: selectedPlan.price,
      status: "PAID",
    },
  });

  // ✅ TRANSACTION LOG
  await prisma.transaction.create({
    data: {
      userId,
      type: "PAYMENT",
      amount: selectedPlan.credits,
    },
  });

  // ✅ WORKSPACE CREDITS
  if (workspaceId) {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        credits: {
          increment: selectedPlan.credits,
        },
      },
    });
  }

  // ✅ SUBSCRIPTION
  await prisma.subscription.upsert({
    where: { userId },
    update: { status: "ACTIVE" },
    create: {
      user: { connect: { id: userId } },
      plan: { connect: { id: planId } },
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ success: true });
}