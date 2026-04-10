import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // ✅ FIX null issue
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

  // ✅ SAFE PLAN QUERY
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

  // 🚨 FIX: no compound key → use delete + create OR updateMany

  await prisma.subscription.deleteMany({
    where: { userId: user.id },
  });

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

  return NextResponse.redirect("/dashboard");
}