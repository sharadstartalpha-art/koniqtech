"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  // ⏱ countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const verify = async () => {
    try {
      await axios.post("/api/auth/verify-otp", { email, otp });
      alert("Verified ✅");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.response?.data?.error);
    }
  };

  const resend = async () => {
    await axios.post("/api/auth/resend-otp", { email });
    alert("OTP resent 📩");
    setTimer(60);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Verify OTP</h1>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Enter OTP"
        className="border p-2 w-full mb-3"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={verify}
        className="bg-black text-white px-4 py-2 w-full mb-3"
      >
        Verify
      </button>

      {timer > 0 ? (
        <p className="text-sm text-gray-500">
          Resend OTP in {timer}s
        </p>
      ) : (
        <button
          onClick={resend}
          className="text-blue-500 underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
}