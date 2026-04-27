"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault(); // 🔥 prevents page reload

    try {
      if (isRegister) {
        await axios.post("/api/auth/register", { email, password });

        alert("OTP sent");
        window.location.href = `/verify?email=${email}`;
      } else {
        await axios.post("/api/auth/login", { email, password });

        window.location.href =
          "/products/invoice-recovery/dashboard";
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
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit" // 🔥 THIS enables Enter key
          className="bg-black text-white px-4 py-2 w-full"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p
        className="mt-4 text-sm cursor-pointer"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have account? Login"
          : "Create account"}
      </p>
    </div>
  );
}