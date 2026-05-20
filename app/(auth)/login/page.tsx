"use client"

import { useState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)

    const r = await fetch(
      "/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    )

    const d = await r.json()

    setLoading(false)

    if (!r.ok) {
      alert(
        d.error ||
        "Login failed"
      )

      return
    }

    window.location.href =
      d.redirect
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <div className="bg-black text-white flex items-center p-20">

        <div>

          <h1 className="text-6xl font-bold">
            KONIQ CRM
          </h1>

          <p className="mt-6 text-2xl text-gray-300">
            AI CRM for home service companies
          </p>

        </div>

      </div>

      <div className="bg-slate-100 flex items-center justify-center">

        <div className="bg-white p-14 rounded-3xl w-[520px] shadow-xl">

          <input
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Email"
            className="
              w-full
              p-5
              border
              rounded-2xl
              mb-5
              text-black
              outline-none
            "
          />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            placeholder="Password"
            className="
              w-full
              p-5
              border
              rounded-2xl
              mb-5
              text-black
              outline-none
            "
          />

          <button
            onClick={submit}
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              p-5
              rounded-2xl
              disabled:opacity-50
            "
          >

            {
              loading
                ? "Signing in..."
                : "Sign In"
            }

          </button>

          <div className="text-center mt-8">

            <Link
              href="/register"
              className="text-blue-600"
            >
              Register
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}