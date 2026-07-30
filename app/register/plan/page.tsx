"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SubscriptionPlan } from "@prisma/client";

type Plan = SubscriptionPlan;

function ChoosePlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orgId = searchParams.get("orgId");

  const [loading, setLoading] = useState<Plan | null>(null);

  async function subscribe(plan: Plan) {
    try {
      setLoading(plan);

      const response = await fetch(
        "/api/paypal/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orgId,
            plan,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      window.location.href = result.approvalUrl;
    } catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Unable to create subscription.";

  alert(message);
} finally {
      setLoading(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-10">
      <h1 className="mb-10 text-center text-4xl font-bold">
        Choose Your Plan
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        <PlanCard
          title="Starter"
          price="$99/mo"
          
          features={[
  "Unlimited Leads",
  "Customers",
  "Jobs",
  "Invoices",
  "AI Assistant",
]}


          loading={loading === SubscriptionPlan.starter}
          onClick={() => subscribe(SubscriptionPlan.starter)}
        />

        <PlanCard
  title="Professional"
  price="$199/mo"
  features={[
  "Everything in Starter",
  "Advanced AI",
  "Automation",
  "Reports",
  "Unlimited Users",
]}
  loading={loading === SubscriptionPlan.professional}
  onClick={() => subscribe(SubscriptionPlan.professional)}
/>

        <PlanCard
  title="Enterprise"
  price="$499/mo"
  features={[
  "Everything in Professional",
  "Multi-location",
  "Priority Support",
  "Dedicated Success Manager",
  "Custom Integrations",
]}
  loading={loading === SubscriptionPlan.enterprise}
  onClick={() => subscribe(SubscriptionPlan.enterprise)}
/>
      </div>
    </main>
  );
}

function PlanCard({
  title,
  price,
  
  features,
  loading,
  onClick,
}: {
  title: string;
  price: string;
  
  features: string[];
  loading: boolean;
  onClick: () => void | Promise<void>;
}) {
  return (
   <div className="rounded-2xl border p-8 shadow">
  <h2 className="text-2xl font-bold">{title}</h2>

  <p className="mt-4 text-4xl font-extrabold">{price}</p>

  <ul className="mt-6 space-y-2">
    {features.map((feature) => (
      <li
        key={feature}
        className="text-sm text-slate-600"
      >
        ✓ {feature}
      </li>
    ))}
  </ul>

  <button
    onClick={onClick}
    disabled={loading}
    className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "Redirecting..." : "Subscribe"}
  </button>
</div>
  );
}

export default function ChoosePlanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <ChoosePlanContent />
    </Suspense>
  );
}