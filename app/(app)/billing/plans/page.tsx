import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BillingPlansPage() {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: session.user.orgId,
    },
    include: {
      subscriptions: true,
    },
  });

  if (!organization) {
    redirect("/login");
  }

  const currentPlan =
    organization.subscriptions?.plan ??
    organization.plan;

  const plans = [
    {
      id: SubscriptionPlan.starter,
      title: "Starter",
      price: "$99/mo",
      features: [
        "Unlimited Leads",
        "Customers",
        "Jobs",
        "Invoices",
        "AI Assistant",
      ],
    },
    {
      id: SubscriptionPlan.professional,
      title: "Professional",
      price: "$199/mo",
      features: [
        "Everything in Starter",
        "Advanced AI",
        "Automation",
        "Reports",
        "Unlimited Users",
      ],
    },
    {
      id: SubscriptionPlan.enterprise,
      title: "Enterprise",
      price: "$499/mo",
      features: [
        "Everything in Professional",
        "Multi-location",
        "Priority Support",
        "Dedicated Success Manager",
        "Custom Integrations",
      ],
    },
  ];

  const order = {
    starter: 1,
    professional: 2,
    enterprise: 3,
  };

  const visiblePlans = plans.filter(
    (plan) =>
      order[plan.id] >= order[currentPlan]
  );

  return (
    <main className="mx-auto max-w-7xl p-10">

      <div className="mb-12">

        <h1 className="text-4xl font-bold">
          Manage Subscription
        </h1>

        <p className="mt-2 text-slate-600">
          Renew your current plan or upgrade anytime.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {visiblePlans.map((plan) => {

          const isCurrent =
            plan.id === currentPlan;

          return (

            <div
              key={plan.id}
              className={`rounded-3xl border p-8 shadow-sm ${
                isCurrent
                  ? "border-orange-500 ring-2 ring-orange-200"
                  : ""
              }`}
            >

              {isCurrent && (
                <div className="mb-4 inline-flex rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                  Current Plan
                </div>
              )}

              <h2 className="text-3xl font-bold">
                {plan.title}
              </h2>

              <p className="mt-4 text-4xl font-extrabold">
                {plan.price}
              </p>

              <ul className="mt-8 space-y-3">

                {plan.features.map((feature) => (

                  <li
                    key={feature}
                    className="text-slate-600"
                  >
                    ✓ {feature}
                  </li>

                ))}

              </ul>

              <Link
                href={`/billing/plans/checkout?plan=${plan.id}`}
                className="mt-10 block rounded-xl bg-orange-500 py-3 text-center font-medium text-white hover:bg-orange-600"
              >
                {isCurrent
                  ? "Renew Plan"
                  : "Upgrade Plan"}
              </Link>

            </div>

          );
        })}

      </div>

    </main>
  );
}