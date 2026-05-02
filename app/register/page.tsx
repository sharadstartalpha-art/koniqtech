"use client";

import { useState } from "react";
import axios from "axios";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post("/api/auth/register", { email, password });
    window.location.href = `/verify-otp?email=${email}`;
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
          Create account
        </h1>

        <input
          placeholder="Email"
          className="w-full border-b mb-4 py-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput value={password} onChange={setPassword} />

        <button
          onClick={register}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          Register
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}