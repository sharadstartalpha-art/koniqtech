"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    try {
      if (!otp || !password) {
        alert("All fields required");
        return;
      }

      setLoading(true);

      await axios.post("/api/auth/reset-password", {
        email,
        otp,
        password,
      });

      alert("Password reset successful ✅");
      window.location.href = "/login";

    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef]">
      <div className="w-full max-w-sm bg-white p-8 rounded-md">

        <h1 className="text-xl mb-6 text-center">
          Reset Password
        </h1>

        <input
          placeholder="Enter OTP"
          className="w-full border-b mb-4 py-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          placeholder="New Password"
          type="password"
          className="w-full border-b mb-6 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={reset}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}