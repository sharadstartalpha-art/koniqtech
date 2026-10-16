
"use client";

import { useState } from "react";
import Link from "next/link";

export default function CancelSubscriptionPage() {
  const [step, setStep] = useState<"confirm" | "otp">("confirm");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailHint, setEmailHint] = useState("");

  async function sendOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/billing/cancellation/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send the verification code."
        );
      }

      setEmailHint(result.emailHint || "your registered email");
      setMessage(
        "A verification code has been sent to your registered email."
      );
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit verification code.");
      return;
    }

    setError(
      "OTP verification and cancellation are not connected yet. No cancellation has been made."
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6 md:p-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-medium text-red-600">
          Subscription settings
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Cancel Subscription
        </h1>

        {step === "confirm" ? (
          <>
            <p className="mt-4 text-slate-600">
              Before continuing, please confirm that you want to cancel
              your KoniqTech subscription.
            </p>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="font-semibold text-amber-900">
                Please note
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-amber-900">
                <li>
                  We will send a verification code to your registered email.
                </li>
                <li>
                  Your subscription will not be cancelled until the code
                  is verified.
                </li>
                <li>
                  Your business records will not be deleted.
                </li>
              </ul>
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending code..." : "Confirm and Send OTP"}
              </button>

              <Link
                href="/billing"
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Subscription
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-slate-600">
              Enter the six-digit code sent to{" "}
              <span className="font-semibold">{emailHint}</span>.
            </p>

            <form onSubmit={verifyOtp} className="mt-6 space-y-4">
              <label
                htmlFor="cancellation-otp"
                className="block text-sm font-medium text-slate-700"
              >
                Email verification code
              </label>

              <input
                id="cancellation-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg tracking-[0.3em] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {message && (
                <p role="status" className="text-sm text-green-700">
                  {message}
                </p>
              )}

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Verify and Cancel Subscription
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("confirm");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
