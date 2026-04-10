import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token"); // PayPal order ID

  const session = await getServerSession();
  const userId = session?.user?.id;

  // Capture payment
  const res = await fetch(
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

  const data = await res.json();

  // 🔥 Determine plan
  const amount = data.purchase_units[0].payments.captures[0].amount.value;

  let planId = "starter";
  let credits = 1000;

  if (amount == "29") {
    planId = "pro";
    credits = 5000;
  }

  // ✅ Create / Update Subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId,
      status: "ACTIVE",
    },
    create: {
      userId,
      planId,
      status: "ACTIVE",
    },
  });

  // ✅ Add credits
  await prisma.balance.update({
    where: { userId },
    data: {
      amount: {
        increment: credits,
      },
    },
  });

  return Response.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
}