import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const token = searchParams.get("token");

  if (!planId || !token) {
    throw new Error("Invalid request");
  }

  // Capture payment
  await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
          ).toString("base64"),
      },
    }
  );

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) throw new Error("Plan not found");

  // ✅ Subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId: plan.id,
      status: "ACTIVE",
    },
    create: {
      userId,
      planId: plan.id,
      status: "ACTIVE",
    },
  });

  // ✅ Credits
  await prisma.balance.update({
    where: { userId },
    data: {
      amount: {
        increment: plan.credits,
      },
    },
  });

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
  );
}