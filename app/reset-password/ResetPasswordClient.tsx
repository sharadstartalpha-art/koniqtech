"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import PasswordInput from "@/components/PasswordInput";

export default function ResetPasswordClient() {
  const params = useSearchParams();
  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const reset = async () => {
    await axios.post("/api/auth/reset-password", {
      email,
      otp,
      password,
    });

    alert("Password reset successful");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef]">
      <div className="w-full max-w-sm bg-white p-8 rounded-md">

        {/* 🔥 LOGO */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 text-white px-5 py-2 font-bold rounded">
            KoniqTech
          </div>
        </div>

        <h1 className="text-center text-xl mb-6">
          Reset Password
        </h1>

        <input
          placeholder="Enter OTP"
          className="w-full border-b mb-4 py-2"
          onChange={(e) => setOtp(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="New Password"
        />

        <button
          onClick={reset}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Reset Password
        </button>

        <p className="text-center text-sm mt-6">
          <a href="/login" className="text-orange-600">
            ← Back to login
          </a>
        </p>

      </div>
    </div>
  );
}