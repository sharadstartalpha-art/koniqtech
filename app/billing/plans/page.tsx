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

  const subscription = organization.subscriptions;

const currentPlan =
  subscription?.plan ??
  organization.plan;

const subscriptionExpired =
  !subscription ||
  subscription.status !== "active" ||
  (
    subscription.renewAt &&
    subscription.renewAt <= new Date()
  );

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

<div className="mt-6 rounded-2xl border bg-slate-50 p-5">

  <div className="grid gap-4 md:grid-cols-3">

    <div>
      <p className="text-sm text-slate-500">
        Current Plan
      </p>

      <p className="mt-1 text-lg font-semibold capitalize">
        {currentPlan}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Status
      </p>

      <p
        className={`mt-1 text-lg font-semibold ${
          subscriptionExpired
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {subscriptionExpired ? "Expired" : "Active"}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Renewal Date
      </p>

      <p className="mt-1 text-lg font-semibold">
        {subscription?.renewAt
          ? subscription.renewAt.toLocaleDateString()
          : "-"}
      </p>
    </div>


    {subscriptionExpired && (
  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
    <h3 className="text-xl font-bold text-red-700">
      Subscription Expired
    </h3>

    <p className="mt-2 text-red-600">
      Your CRM access has been suspended because your subscription has expired.
      Renew your current plan or upgrade to restore full access immediately.
    </p>
  </div>
)}

  </div>

</div>
      </div>

     <div
  className={`grid gap-8 ${
    visiblePlans.length === 1
      ? "mx-auto max-w-md"
      : "md:grid-cols-3"
  }`}
>

        {visiblePlans.map((plan) => {

          const isCurrent =
            plan.id === currentPlan;

          return (

            <div
              key={plan.id}
             className={`rounded-3xl border p-8 transition-all ${
  isCurrent
    ? "border-orange-500 bg-orange-50 shadow-xl scale-[1.02]"
    : "border-slate-200 bg-white shadow-sm hover:shadow-lg"
}`}
            >

             {isCurrent && (
  <div
    className={`mb-4 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
      subscriptionExpired
        ? "bg-red-100 text-red-600"
        : "bg-green-100 text-green-700"
    }`}
  >
    {subscriptionExpired
      ? "Plan Expired"
      : "Current Plan"}
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
  className="flex items-center gap-3 text-slate-700"
>
  <span className="text-green-600 font-bold">
    ✓
  </span>

  {feature}
</li>

                ))}

              </ul>

             <Link
  href={`/billing/plans/checkout?plan=${plan.id}`}
  className={`mt-10 block w-full rounded-xl py-4 text-lg font-semibold transition ${
    isCurrent && !subscriptionExpired
      ? "pointer-events-none bg-gray-300 text-gray-600"
      : "bg-orange-500 text-white hover:bg-orange-600"
  }`}
>
             {isCurrent
  ? (
      subscriptionExpired
        ? `Renew ${plan.title}`
        : "Current Plan"
    )
  : `Upgrade to ${plan.title}`}
              </Link>

            </div>




          );
        })}

      </div>


<div className="mt-16 rounded-3xl border bg-white p-8 shadow-sm">

  <h2 className="text-2xl font-bold">
    Need Help?
  </h2>

  <p className="mt-3 text-slate-600">
    Having trouble renewing your subscription or updating your billing
    information? Our support team is here to help.
  </p>

  <div className="mt-6 flex flex-wrap gap-4">

    <Link
      href="/contact"
      className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-50"
    >
      Contact Support
    </Link>

    <Link
      href="/billing/history"
      className="rounded-xl border px-5 py-3 font-medium hover:bg-slate-50"
    >
      Billing History
    </Link>

  </div>

</div>
    </main>
  );
}