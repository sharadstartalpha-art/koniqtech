import { prisma } from "@/lib/prisma";

export default async function SubscribePage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      plans: true,
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>Choose a plan</h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {product.plans.map((plan) => (
          <div key={plan.id} style={{ border: "1px solid #ccc", padding: 20 }}>
            <h2>{plan.name}</h2>

            <h3>
              {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
            </h3>

            <p>
              {plan.invoiceLimit === -1
                ? "Unlimited invoices"
                : `${plan.invoiceLimit} invoices`}
            </p>

            {/* ✅ IMPORTANT: send correct planId */}
            <form action="/api/paypal/create-subscription" method="POST">
              <input type="hidden" name="planId" value={plan.id} />
              <button>Subscribe</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}