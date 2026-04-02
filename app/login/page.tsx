"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 border rounded w-[350px] text-center">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {/* OAuth */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-red-500 text-white py-2 rounded mb-2"
        >
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full bg-black text-white py-2 rounded mb-2"
        >
          Continue with GitHub
        </button>

        <button
          onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
          className="w-full bg-blue-600 text-white py-2 rounded mb-4"
        >
          Continue with Facebook
        </button>

        <p className="text-sm mb-2">OR</p>

        {/* Email login */}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-black text-white py-2 rounded">
            Login
          </button>
        </form>

        {/* Navigation */}
        <div className="mt-4 text-sm">
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}