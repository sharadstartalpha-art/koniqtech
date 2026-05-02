"use client";

import { useState } from "react";
import axios from "axios";

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

      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      window.location.href = "/dashboard";

    } catch (err: any) {
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6ef]">

      <div className="w-full max-w-sm bg-white p-8 rounded-md shadow-sm">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-500 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
            KoniqTech
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-center text-xl font-semibold mb-6">
          Log in
        </h1>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm text-gray-500">
            Email
          </label>
          <input
            type="email"
            className="w-full border-b outline-none py-2 focus:border-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">
            Password
          </label>
          <input
            type="password"
            className="w-full border-b outline-none py-2 focus:border-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-6">
          <a
            href="/forgot-password"
            className="text-sm text-orange-600 hover:underline"
          >
            Forgot your password?
          </a>
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* CREATE ACCOUNT */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-orange-600 hover:underline"
          >
            Create an account.
          </a>
        </p>

      </div>
    </div>
  );
}