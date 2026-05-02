"use client";

import { useState } from "react";
import axios from "axios";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      if (!email || !password) {
        alert("Email & password required");
        return;
      }

      setLoading(true);

      /* ✅ GET RESPONSE */
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      /* ✅ ROLE-BASED REDIRECT */
      if (res.data.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href =
          "/products/invoice-recovery/dashboard";
      }

    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
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

        <h1 className="text-center text-xl mb-6">Log in</h1>

        <input
          placeholder="Email"
          className="w-full border-b mb-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput value={password} onChange={setPassword} />

        <div className="text-right mb-4">
          <a href="/forgot-password" className="text-orange-600 text-sm">
            Forgot password?
          </a>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-orange-600">
            Create an account
          </a>
        </p>

      </div>
    </div>
  );
}