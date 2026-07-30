"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

function CancelContent() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-10 shadow-xl">
        <div className="flex justify-center">
          <div className="rounded-full bg-orange-100 p-5">
            <AlertTriangle className="h-14 w-14 text-orange-600" />
          </div>
        </div>

        <h1 className="mt-8 text-center text-3xl font-bold text-slate-900">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-center text-slate-600">
          Your PayPal subscription was not completed.
        </p>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h2 className="font-semibold text-orange-800">
            What happened?
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-orange-700">
            <li>• You cancelled the PayPal checkout.</li>
            <li>• No payment has been charged.</li>
            <li>• Your subscription has not been activated.</li>
            <li>• Your account remains inactive until payment is completed.</li>
          </ul>
        </div>

        <div className="mt-8 grid gap-3">
          <button
            onClick={() => router.push("/register/plan")}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <CreditCard className="h-5 w-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Need help? Contact our support team if you experienced any issues during checkout.
        </p>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}