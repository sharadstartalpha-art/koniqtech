"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function VerifyOtpClient() {
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      if (!otp) {
        alert("Enter OTP");
        return;
      }

      setLoading(true);

      await axios.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      alert("Account verified ✅");

      window.location.href = "/login";
    } catch (err: any) {
      alert(err?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6">

        <h1 className="text-xl font-semibold mb-4 text-center">
          Enter OTP
        </h1>

        <p className="text-sm text-gray-500 mb-3 text-center">
          Sent to: {email}
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          className="border rounded-md p-2 w-full mb-4 text-center tracking-widest"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verify}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded-md"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
}