
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BillingPlansPage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.orgId) {
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

  const currentPlan = subscription?.plan ?? organization.plan;
  const now = new Date();

  const isTrial =
    subscription?.status === SubscriptionStatus.trial;

  const isCancelled =
    subscription?.status === SubscriptionStatus.cancelled;

  const trialEnd = subscription
    ? subscription.trialEnd ?? organization.trialEndsAt
    : organization.trialEndsAt;

  const trialExpired =
    isTrial && (!trialEnd || trialEnd <= now);

  const paidSubscriptionExpired =
    subscription?.status === SubscriptionStatus.active &&
    Boolean(subscription.renewAt && subscription.renewAt <= now);

  const isExpired =
    !subscription ||
    trialExpired ||
    paidSubscriptionExpired ||
    subscription?.status === SubscriptionStatus.expired;

  const subscriptionExpired = isCancelled || isExpired;

  const subscriptionUsable = Boolean(
    subscription &&
      (
        (isTrial && trialEnd && trialEnd > now) ||
        (
          subscription.status === SubscriptionStatus.active &&
          (!subscription.renewAt || subscription.renewAt > now)
        )
      )
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

  const order: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.starter]: 1,
    [SubscriptionPlan.professional]: 2,
    [SubscriptionPlan.enterprise]: 3,
  };

  // Cancelled or expired customers can choose any plan.
  // Existing active customers see their current plan and upgrades.
  const visiblePlans = plans.filter(
    (plan) =>
      subscriptionExpired ||
      order[plan.id] >= order[currentPlan]
  );

  const statusLabel = isCancelled
    ? "Cancelled"
    : isExpired
      ? "Expired"
      : isTrial
        ? "Trial"
        : "Active";

  const trialOrSubscriptionEnd = isTrial
    ? trialEnd
    : subscription?.renewAt ?? null;

  return (
    <main className="mx-auto max-w-7xl p-6 md:p-10">
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
                {statusLabel}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {isTrial ? "Trial Ends" : "Renewal Date"}
              </p>

              <p className="mt-1 text-lg font-semibold">
                {trialOrSubscriptionEnd
                  ? trialOrSubscriptionEnd.toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {subscriptionExpired && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">
              {isCancelled
                ? "Subscription Cancelled"
                : "Subscription Expired"}
            </h2>

            <p className="mt-2 text-red-600">
              {isCancelled
                ? "Your subscription has been cancelled. Choose a plan below to restore CRM access."
                : "Your subscription or trial has expired. Choose a plan below to restore CRM access."}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Your existing business records have not been deleted.
            </p>
          </div>
        )}
      </div>

      <div
        className={`grid gap-8 ${
          visiblePlans.length === 1
            ? "mx-auto max-w-md"
            : "md:grid-cols-3"
        }`}
      >
        {visiblePlans.map((plan) => {
          const isCurrent = plan.id === currentPlan;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-8 transition-all ${
                isCurrent
                  ? "scale-[1.02] border-orange-500 bg-orange-50 shadow-xl"
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
                  {isCancelled
                    ? "Cancelled Plan"
                    : isExpired
                      ? "Expired Plan"
                      : isTrial
                        ? "Free Trial"
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
                    <span className="font-bold text-green-600">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/billing/plans/checkout?plan=${plan.id}`}
                aria-disabled={isCurrent && subscriptionUsable}
                className={`mt-10 block w-full rounded-xl py-4 text-center text-lg font-semibold transition ${
                  isCurrent && subscriptionUsable
                    ? "pointer-events-none bg-gray-300 text-gray-600"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {isCurrent
                  ? subscriptionUsable
                    ? isTrial
                      ? "Trial Active"
                      : "Current Plan"
                    : isCancelled
                      ? `Reactivate ${plan.title}`
                      : `Renew ${plan.title}`
                  : order[plan.id] > order[currentPlan]
                    ? `Upgrade to ${plan.title}`
                    : `Choose ${plan.title}`}
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
          Having trouble renewing your subscription or updating your
          billing information? Our support team is here to help.
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
