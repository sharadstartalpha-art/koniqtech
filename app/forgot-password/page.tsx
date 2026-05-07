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

 {/* LOGO */}

        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 text-white px-5 py-2 font-bold rounded-lg">
            KoniqTech
          </div>
        </div>


        <h1 className="text-center text-2xl font-semibold mb-2">
          Reset Password
        </h1>

        <input
          placeholder="Enter your email"
          className="w-full border-b border-gray-300 focus:border-orange-500 outline-none py-2 mb-4 bg-transparent"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Send OTP
        </button>


 {/* LOGIN */}

        <p className="text-center text-sm mt-6">
          <a
            href="/login"
            className="text-orange-600 hover:text-orange-700"
          >
            ← Back to login
          </a>
        </p>

      </div>
    </div>
  );
}