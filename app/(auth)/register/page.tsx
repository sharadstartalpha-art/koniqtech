"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // STEP 1 → Send OTP
  const register = async () => {
    if (!email || !password) {
      setMessage("Email and password required");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStep("otp");
    } else {
      setMessage("Failed to send OTP");
    }

    setLoading(false);
  };

  // STEP 2 → Verify OTP + Create User
  const verifyOtp = async () => {
  setLoading(true);
  setMessage("");

  try {
    const verifyRes = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      setMessage(verifyData.error || "Invalid OTP");
      setLoading(false);
      return;
    }

    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok) {
      setMessage(registerData.error || "Registration failed");
      setLoading(false);
      return;
    }

    setMessage("✅ Account created!");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);

  } catch (err) {
    setMessage("Something went wrong");
  }

  setLoading(false);
};

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded space-y-4">
      <h1 className="text-xl font-semibold">Create Account</h1>

      {step === "form" && (
        <>
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

         <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full border px-3 py-2 rounded"
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-2 text-sm"
  >
    {showPassword ? "Hide" : "Show"}
</button>
          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="text-sm">Enter OTP sent to {email}</p>

          <input
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>
        </>
      )}

      {message && (
        <p className="text-sm text-center">{message}</p>
      )}
    </div>
  );
}