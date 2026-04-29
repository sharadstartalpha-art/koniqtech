"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
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

      if (isRegister) {
        await axios.post("/api/auth/register", {
          email,
          password,
        });

        alert("Verification email sent");
      } else {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (res.data.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href =
            "/products/invoice-recovery/dashboard";
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6">

        <h1 className="text-xl font-semibold mb-4 text-center">
          {isRegister ? "Create account" : "Sign in"}
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="border rounded-md p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="border rounded-md p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded-md disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

        <p
          className="text-sm text-center text-blue-600 mt-4 cursor-pointer"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Create account"}
        </p>

      </div>
    </div>
  );
}