import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const planId = searchParams.get("planId") ?? "";

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      name: {
        equals: planId,
        mode: "insensitive",
      },
    },
  });

  if (!plan) {
    return NextResponse.redirect("/pricing");
  }

  // 🔁 reset old subscription
  await prisma.subscription.deleteMany({
    where: { userId: user.id },
  });

  // ✅ create new subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: plan.id,
      status: "ACTIVE",
    },
  });

  // 💰 add credits
  await prisma.balance.update({
    where: { userId: user.id },
    data: {
      amount: {
        increment: plan.credits,
      },
    },
  });

  // 💳 save payment (AFTER prisma generate)
  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: plan.price,
      status: "COMPLETED",
    },
  });

  return NextResponse.redirect("/dashboard");
}