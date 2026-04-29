"use client";

import { useState } from "react";
import api from "@/lib/axios";

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
        const res = await api.post("/api/auth/register", {
          email,
          password,
        });

        if (res.data.success) {
          window.location.href = `/verify?email=${email}`;
        } else {
          alert(res.data.error);
        }
      } else {
        const res = await api.post("/api/auth/login", {
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
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        {isRegister ? "Create account" : "Login"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "Loading..." : isRegister ? "Register" : "Login"}
      </button>

      <p
        className="mt-4 text-sm text-blue-600 cursor-pointer"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Create account"}
      </p>
    </div>
  );
}