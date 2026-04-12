import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // ⚠️ In real PayPal → verify webhook signature

  const userId = body.userId;
  const plan = body.plan;
  // 🔥 extract from webhook / metadata
const workspaceId = body.workspaceId;
const planId = body.planId;

// mock fallback (for now)
const planCredits = 5000;

  // plan config
  const PLAN_DATA: any = {
    PRO: { credits: 5000, price: 29 },
    ENTERPRISE: { credits: 20000, price: 99 },
  };

  const selectedPlan = PLAN_DATA[plan];

  if (!selectedPlan) {
    return NextResponse.json({ error: "Invalid plan" });
  }

  // ✅ 1. UPDATE USER PLAN
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      credits: selectedPlan.credits,
    },
  });

  // ✅ 2. CREATE PAYMENT (INVOICE)
  await prisma.payment.create({
    data: {
      userId,
      amount: selectedPlan.price,
      status: "PAID",
    },
  });


await prisma.workspace.update({
  where: { id: workspaceId },
  data: {
    credits: {
      increment: planCredits, // 1000 / 5000 / etc
    },
  },
});

  await prisma.user.update({
  where: { id: userId },
  data: {
    plan: "PRO",
    credits: 5000,
  },
});

  // ✅ 3. CREATE / UPDATE SUBSCRIPTION
  await prisma.subscription.upsert({
  where: { userId },
  update: {
    status: "ACTIVE",
  },
  create: {
    user: {
      connect: { id: userId },
    },
    plan: {
      connect: { id: planId },
    },
    status: "ACTIVE",
  },
});

   
  return NextResponse.json({ success: true });
}