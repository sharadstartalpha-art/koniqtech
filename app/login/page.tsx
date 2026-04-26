"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    await axios.post("/api/auth/send-otp", { email });
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await axios.post("/api/auth/verify-otp", {
      email,
      otp,
    });

    localStorage.setItem("userId", res.data.userId);

    window.location.href =
      "/products/invoice-recovery/dashboard";
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>

      {step === 1 && (
        <>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={sendOtp}
            className="bg-black text-white px-4 py-2 w-full"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="border p-2 w-full mb-3"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className="bg-black text-white px-4 py-2 w-full"
          >
            Verify
          </button>
        </>
      )}
    </div>
  );
}