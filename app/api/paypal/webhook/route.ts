import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
    const subscriptionId = body.resource.id;
    const paypalPlanId = body.resource.plan_id;

    const plan = await prisma.plan.findFirst({
      where: { paypalPlanId },
    });

    if (!plan) {
      return new Response("Plan not found", { status: 400 });
    }

    await prisma.subscription.create({
      data: {
        userId: "REPLACE_WITH_REAL_USER_ID",
        productId: plan.productId,
        planId: plan.id,
        paypalSubscriptionId: subscriptionId,
        status: "ACTIVE",
      },
    });
  }

  return new Response("OK");
}