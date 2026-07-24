"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState(
    "Verifying your subscription..."
  );

  useEffect(() => {
    const verify = async () => {
      const subscriptionId =
        searchParams.get("subscription_id") ||
        searchParams.get("subscriptionId") ||
        searchParams.get("ba_token");

      const orgId = searchParams.get("orgId");

      if (!subscriptionId || !orgId) {
        setMessage("Invalid payment session.");

        setTimeout(() => {
          router.replace("/register/plan");
        }, 3000);

        return;
      }

      try {
        const response = await fetch(
          "/api/paypal/verify-subscription",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subscriptionId,
              orgId,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Verification failed."
          );
        }

        setMessage(
          "Subscription activated successfully."
        );

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (err: any) {
        console.error(err);

        setMessage(
          err.message ||
            "Unable to verify subscription."
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
          Thank you for choosing KoniqTech.
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
            <li>✓ Subscription Verified</li>
            <li>✓ Account Activated</li>
            <li>✓ Redirecting to Login...</li>
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
      <SuccessContent />
    </Suspense>
  );
}