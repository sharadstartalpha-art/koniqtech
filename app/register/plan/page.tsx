"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = "starter" | "growth" | "professional";

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
    } catch (err: any) {
      alert(err.message);
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
          loading={loading === "starter"}
          onClick={() => subscribe("starter")}
        />

        <PlanCard
          title="Growth"
          price="$199/mo"
          loading={loading === "growth"}
          onClick={() => subscribe("growth")}
        />

        <PlanCard
          title="Professional"
          price="$299/mo"
          loading={loading === "professional"}
          onClick={() => subscribe("professional")}
        />
      </div>
    </main>
  );
}

function PlanCard({
  title,
  price,
  loading,
  onClick,
}: {
  title: string;
  price: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border p-8 shadow">
      <h2 className="text-2xl font-bold">{title}</h2>

      <p className="mt-4 text-4xl font-extrabold">{price}</p>

      <button
        onClick={onClick}
        disabled={loading}
        className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-white"
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