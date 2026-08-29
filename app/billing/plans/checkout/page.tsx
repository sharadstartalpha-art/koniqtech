"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function CheckoutContent() {
  const searchParams = useSearchParams();

  const plan = searchParams.get("plan");

  const [loading, setLoading] = useState(false);

  async function subscribe() {
    try {
      setLoading(true);

      const response = await fetch(
  "/api/paypal/create-renewal-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Unable to create subscription."
        );
      }

      window.location.href =
        result.approvalUrl;

    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-8">

      <div className="w-full rounded-3xl border bg-white p-10 shadow">

        <h1 className="text-3xl font-bold">
          Confirm Subscription
        </h1>

        <p className="mt-4 text-slate-600">
          You are subscribing to:
        </p>

        <div className="mt-6 rounded-2xl bg-orange-50 p-6">

          <div className="text-xl font-semibold capitalize">
            {plan}
          </div>

        </div>

        <button
          onClick={subscribe}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {loading
            ? "Redirecting to PayPal..."
            : "Continue to PayPal"}
        </button>

      </div>

    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}