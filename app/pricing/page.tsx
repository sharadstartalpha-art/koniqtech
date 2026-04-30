import { prisma } from "@/lib/prisma";

export default async function PricingPage() {
  const products = await prisma.product.findMany({
    include: {
      plans: true,
    },
  });

  return (
    <div>
      <h1>Pricing</h1>

      {products.map((product: any) => (
        <div key={product.id}>
          <h2>{product.name}</h2>

          {product.plans.map((plan: any) => (
            <div key={plan.id}>
              <h3>{plan.name}</h3>
              <p>${plan.price}</p>

              <form action="/api/paypal/create-subscription" method="POST">
                <input type="hidden" name="planId" value={plan.id} />
                <button>Subscribe</button>
              </form>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}