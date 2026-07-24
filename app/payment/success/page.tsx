"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState(
    "Verifying your PayPal subscription..."
  );

  useEffect(() => {
    const verify = async () => {
      const subscriptionId =
        searchParams.get("subscription_id") ||
        searchParams.get("subscriptionId") ||
        searchParams.get("ba_token");

      if (!subscriptionId) {
        setMessage("Subscription ID not found.");

        setTimeout(() => {
          router.replace("/register/plan");
        }, 3000);

        return;
      }

      try {
        const res = await fetch(
          "/api/paypal/verify-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionId,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Verification failed."
          );
        }

        setMessage(
          "Subscription activated successfully."
        );

        setTimeout(() => {
          router.replace("/dashboard");
        }, 2000);
      } catch (error: any) {
        console.error(error);

        setMessage(
          error.message ??
            "Unable to verify your subscription."
        );

        setTimeout(() => {
          router.replace("/register/plan");
        }, 4000);
      }
    };

    verify();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-10 shadow-xl">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-5">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>
        </div>

        <h1 className="mt-8 text-center text-3xl font-bold text-slate-900">
          Payment Successful
        </h1>

        <p className="mt-4 text-center text-slate-600">
          Thank you for subscribing to KoniqTech.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 rounded-xl bg-orange-50 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-orange-600" />

          <span className="font-medium text-orange-700">
            {message}
          </span>
        </div>

        <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4">
          <ul className="space-y-2 text-sm text-green-800">
            <li>✓ Organization Created</li>
            <li>✓ Owner Account Ready</li>
            <li>✓ Subscription Activated</li>
            <li>✓ Redirecting to Dashboard...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}