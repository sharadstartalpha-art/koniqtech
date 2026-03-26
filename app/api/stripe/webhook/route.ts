import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  // 🔥 Handle payment success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // ⚠️ For now (simple)
    const userId = session.metadata?.userId;

    const amount = session.amount_total;

    let credits = 0;

    if (amount === 1900) credits = 500;
    if (amount === 4900) credits = 2000;
    if (amount === 9900) credits = 5000;

    if (userId && credits > 0) {
      await prisma.userCredits.update({
        where: { userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
    }
  }

  return new Response("OK");
}