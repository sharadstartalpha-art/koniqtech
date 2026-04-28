"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isRegister) {
        await api.post("/api/auth/register", { email, password });

        alert("OTP sent to your email");
        router.push(`/verify?email=${email}`);
      } else {
        const res = await api.post("/api/auth/login", {
          email,
          password,
        });

        const data = res.data;

        // ✅ ROLE BASED REDIRECT
        if (data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/products/invoice-recovery/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        {isRegister ? "Register" : "Login"}
      </h1>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          required
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>
      </form>

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