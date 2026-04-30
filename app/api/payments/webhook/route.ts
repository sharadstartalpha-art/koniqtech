import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 PAYPAL WEBHOOK:", body.event_type);

    /* =======================================================
       🔥 1. SUBSCRIPTION ACTIVATED
    ======================================================= */
    if (body.event_type === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const sub = body.resource;

      const userId = sub.custom_id;
      const subscriptionId = sub.id;

      if (!userId) {
        console.error("❌ Missing custom_id");
        return NextResponse.json(
          { error: "Missing user mapping" },
          { status: 400 }
        );
      }

      // ✅ Get product
      const product = await prisma.product.findUnique({
        where: { slug: "invoice-recovery" },
        include: { plans: true },
      });

      if (!product) {
        console.error("❌ Product not found");
        return NextResponse.json({ error: "Product missing" }, { status: 400 });
      }

      // 🔥 Pick plan (you can improve this later)
      const plan = product.plans[0];

      if (!plan) {
        console.error("❌ No plan found");
        return NextResponse.json({ error: "Plan missing" }, { status: 400 });
      }

      // ✅ Prevent duplicate
      const existing = await prisma.subscription.findFirst({
        where: {
          paypalSubscriptionId: subscriptionId,
        },
      });

      if (!existing) {
        await prisma.subscription.create({
          data: {
            userId,
            productId: product.id, // ✅ FIX
            planId: plan.id,       // ✅ REQUIRED
            paypalSubscriptionId: subscriptionId,
            status: "ACTIVE",      // ✅ consistent
          },
        });

        console.log("✅ Subscription created:", subscriptionId);
      }
    }

    /* =======================================================
       💰 2. CHECKOUT PAYMENT (ORDER APPROVED)
    ======================================================= */
    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const invoiceId =
        body.resource?.purchase_units?.[0]?.custom_id;

      if (!invoiceId) {
        console.warn("⚠️ No invoice ID in checkout");
        return NextResponse.json({ ok: true });
      }

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      console.log("💰 Invoice paid (checkout):", invoiceId);
    }

    /* =======================================================
       💰 3. PAYMENT COMPLETED (fallback)
    ======================================================= */
    if (body.event_type === "PAYMENT.SALE.COMPLETED") {
      const resource = body.resource;

      const invoiceId =
        resource?.custom ||
        resource?.invoice_id ||
        resource?.note;

      if (!invoiceId) {
        console.warn("⚠️ No invoice ID in sale");
        return NextResponse.json({ ok: true });
      }

      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      console.log("💰 Invoice paid (sale):", invoiceId);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}