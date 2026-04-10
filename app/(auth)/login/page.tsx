"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow-sm w-80 border">

        <h1 className="text-xl font-semibold mb-4">
          Login
        </h1>

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full border p-2 mb-4 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-black">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}