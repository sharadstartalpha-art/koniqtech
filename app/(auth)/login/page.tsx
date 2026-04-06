"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const login = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials");
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-4 shadow">
        <h1 className="text-xl font-semibold text-center">
          Welcome back 👋
        </h1>

        {/* GOOGLE */}
        <button
          onClick={() =>
            signIn("google", { callbackUrl: "/dashboard" })
          }
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Continue with Google
        </button>

        {/* GITHUB */}
        <button
          onClick={() =>
            signIn("github", { callbackUrl: "/dashboard" })
          }
          className="w-full bg-black text-white py-2 rounded"
        >
          Continue with GitHub
        </button>

        {/* FACEBOOK */}
        <button
          onClick={() =>
            signIn("facebook", { callbackUrl: "/dashboard" })
          }
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Continue with Facebook
        </button>

        <div className="text-center text-sm">OR</div>

        {/* EMAIL LOGIN */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className="w-full border px-3 py-2 rounded"
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-2 text-sm"
  >
    {showPassword ? "Hide" : "Show"}
  </button>

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}