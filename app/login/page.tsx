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

  const submit = async () => {
    console.log("🔥 CLICK WORKING");

    try {
      setLoading(true);

      if (!email || !password) {
        alert("Email & password required");
        return;
      }

      if (isRegister) {
        await api.post("/api/auth/register", { email, password });

        alert("OTP sent");
        router.push(`/verify?email=${email}`);
      } else {
        const res = await api.post("/api/auth/login", {
          email,
          password,
        });

        console.log("LOGIN RESPONSE:", res.data);

        if (res.data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/products/invoice-recovery/dashboard");
        }
      }
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      alert(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">
        {isRegister ? "Register" : "Login"}
      </h1>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* BUTTON */}
      <button
        onClick={submit}   // ✅ NOT form submit anymore
        disabled={loading}
        className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
      >
        {loading ? "Loading..." : isRegister ? "Register" : "Login"}
      </button>

      {/* TOGGLE */}
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