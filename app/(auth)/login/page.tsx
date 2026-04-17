"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">

      <form
        onSubmit={handleLogin}
        className="w-[400px] bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-white">Login</h1>

        {error && (
          <p className="text-red-400 text-sm">
            ❌ Wrong email or password
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/10 border border-white/10 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 py-3 rounded-lg text-white hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}