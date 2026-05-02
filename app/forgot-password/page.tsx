"use client";

import { useState } from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    await axios.post("/api/auth/resend-otp", { email });

    alert("OTP sent");
    window.location.href = `/reset-password?email=${email}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef]">
      <div className="w-full max-w-sm bg-white p-8 rounded-md">

        <h1 className="text-xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        <input
          placeholder="Enter your email"
          className="w-full border-b mb-6 py-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Send OTP
        </button>

      </div>
    </div>
  );
}