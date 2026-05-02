"use client";

import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post("/api/auth/register", { email, password });

    alert("OTP sent");
    window.location.href = `/verify-otp?email=${email}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef]">
      <div className="w-full max-w-sm bg-white p-8 rounded-md">

        <h1 className="text-xl font-semibold mb-6 text-center">
          Create account
        </h1>

        <input
          placeholder="Email"
          className="w-full border-b mb-4 py-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border-b mb-6 py-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Register
        </button>

      </div>
    </div>
  );
}