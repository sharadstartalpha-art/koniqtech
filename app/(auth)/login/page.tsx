"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      // 🔥 fetch session to check role
      const session = await fetch("/api/auth/session").then((r) => r.json());

      if (session?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 bg-white rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button
          onClick={login}
          className="bg-black text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}