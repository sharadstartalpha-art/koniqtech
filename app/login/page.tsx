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
      setLoading(true);

      if (isRegister) {
        await axios.post("/api/auth/register", { email, password });
        alert("📧 OTP sent to your email");
        window.location.href = "/verify";
      } else {
        await axios.post("/api/auth/login", { email, password });
        window.location.href =
          "/products/invoice-recovery/dashboard";
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isRegister ? "Register" : "Login"}
      </h1>

      <input
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
        className="bg-black text-white px-4 py-2 w-full"
      >
        {loading
          ? "Processing..."
          : isRegister
          ? "Register"
          : "Login"}
      </button>

      <p
        className="mt-4 text-sm cursor-pointer text-blue-600"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Create account"}
      </p>
    </div>
  );
}