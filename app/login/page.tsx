"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      if (isRegister) {
        await axios.post("/api/auth/register", { email, password });

        alert("OTP sent to your email");
        window.location.href = `/verify?email=${email}`;
      } else {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        const data = res.data;

        // ✅ ROLE BASED REDIRECT
        if (data.role === "ADMIN") {
          window.location.href = "/admin";
        } else {
          window.location.href =
            "/products/invoice-recovery/dashboard";
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.error);
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
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full"
        >
          {isRegister ? "Register" : "Login"}
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