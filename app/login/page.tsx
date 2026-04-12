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
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleLogin}
        className="w-[400px] space-y-4 border p-6 rounded-xl"
      >
        <h1 className="text-xl font-bold">Login</h1>

        {/* 🔥 ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm">
            ❌ Wrong email or password
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}