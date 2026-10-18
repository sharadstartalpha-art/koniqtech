
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
export default function CancelSubscriptionButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"confirm" | "otp">("confirm");
  const [otp, setOtp] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  async function sendOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/billing/cancellation/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send OTP.");
      }

      setEmailHint(result.emailHint || "your registered email");
      setOtp("");
      setStep("otp");
      setMessage("Verification code requested. Check your email.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the complete six-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/billing/cancellation/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "OTP verification failed."
        );
      }

      setCancelled(true);
      setMessage(
  result.message || "Your subscription was cancelled successfully."
);

     await signOut({ callbackUrl: "/login" });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify the OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function closeDialog() {
    if (loading) return;

    setOpen(false);
    setStep("confirm");
    setOtp("");
    setMessage("");
    setError("");
    setCancelled(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
          setMessage("");
        }}
        className="rounded-xl border border-red-300 px-6 py-3 font-medium text-red-600 hover:bg-red-50"
      >
        Cancel Subscription
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-subscription-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="cancel-subscription-title"
              className="text-2xl font-bold text-slate-900"
            >
              {cancelled ? "Subscription Cancelled" : "Cancel Subscription"}
            </h2>

            {cancelled ? (
              <>
                <p role="status" className="mt-4 text-green-700">
                  {message}
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-lg border px-4 py-2"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : step === "confirm" ? (
              <>
                <p className="mt-4 text-slate-600">
                  Are you sure you want to continue? We will send a
                  verification code to your registered email. Your
                  subscription will not be cancelled until the code is
                  verified.
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Your business records will not be deleted.
                </p>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={loading}
                    className="rounded-lg border px-4 py-2"
                  >
                    Keep Subscription
                  </button>

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Confirm and Send OTP"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 text-slate-600">
                  Enter the six-digit code sent to {emailHint}.
                </p>

                <form
                  className="mt-5 space-y-4"
                  onSubmit={verifyOtp}
                >
                  <div>
                    <label
                      htmlFor="cancel-otp"
                      className="block text-sm font-medium"
                    >
                      Verification code
                    </label>

                    <input
                      id="cancel-otp"
                      type="text"
                      value={otp}
                      onChange={(event) =>
                        setOtp(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      disabled={loading}
                      placeholder="6-digit code"
                      className="mt-2 w-full rounded-lg border px-4 py-3 tracking-widest"
                    />
                  </div>

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

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeDialog}
                      disabled={loading}
                      className="rounded-lg border px-4 py-2"
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      disabled={otp.length !== 6 || loading}
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
