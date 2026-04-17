"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStep("otp");
    else setMessage("Failed to send OTP");

    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      setMessage("Invalid OTP");
      setLoading(false);
      return;
    }

    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">

      <div className="w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl space-y-4">

        <h1 className="text-2xl font-bold text-white">
          Create Account
        </h1>

        {step === "form" && (
          <>
            <input
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={register}
              className="w-full bg-blue-600 py-3 rounded-lg text-white"
            >
              {loading ? "Sending..." : "Register"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-sm text-gray-400">
              Enter OTP sent to {email}
            </p>

            <input
              placeholder="OTP"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 py-3 rounded-lg text-white"
            >
              Verify & Create Account
            </button>
          </>
        )}

        {message && (
          <p className="text-sm text-red-400">{message}</p>
        )}
      </div>
    </div>
  );
}