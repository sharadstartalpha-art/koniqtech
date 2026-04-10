import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const event = body.event_type;

  // 🔥 SUBSCRIPTION CREATED
  if (event === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const sub = body.resource;

    const email = sub.subscriber.email_address;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return new Response("User not found");

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: "mapped-plan-id", // map from PayPal plan
        status: "ACTIVE",
      },
    });
  }

  // 🔥 PAYMENT SUCCESS
  if (event === "PAYMENT.SALE.COMPLETED") {
    const sale = body.resource;

    const email = sale.billing_agreement_id;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return new Response("User not found");

    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: parseFloat(sale.amount.total),
        status: "COMPLETED",
      },
    });

    // 💰 add credits
    await prisma.balance.update({
      where: { userId: user.id },
      data: {
        amount: {
          increment: 1000, // map per plan
        },
      },
    });
  }

  return new Response("OK");
}