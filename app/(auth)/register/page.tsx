"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    alert("Account created 🎉")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">Create Account</h1>

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  )
}