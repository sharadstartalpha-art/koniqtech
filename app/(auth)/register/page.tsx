"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        company,
        email,
        password,
      }),
    })

    router.push("/login")
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      
      <div className="bg-blue-700 text-white p-20 flex flex-col justify-center">
        <h1 className="text-6xl font-bold">
          Start Free
        </h1>

        <p className="text-xl mt-6">
          Launch your CRM in minutes
        </p>
      </div>

      <div className="bg-slate-100 flex items-center justify-center">
        <div className="bg-white w-[560px] rounded-3xl shadow-xl p-12">

          <h1 className="text-5xl font-bold mb-8">
            Create Account
          </h1>

          <form onSubmit={submit} className="space-y-5">

            <div className="space-y-4">

              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-300
                  px-5
                  text-black
                  outline-none
                  focus:border-blue-500
                "
              />

              <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-300
                  px-5
                  text-black
                  outline-none
                  focus:border-blue-500
                "
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-300
                  px-5
                  text-black
                  outline-none
                  focus:border-blue-500
                "
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-slate-300
                  px-5
                  text-black
                  outline-none
                  focus:border-blue-500
                "
              />
            </div>

            <button
              type="submit"
              className="
                w-full
                bg-blue-600
                text-white
                p-4
                rounded-xl
                hover:bg-blue-700
                transition
              "
            >
              Register
            </button>

          </form>

          <p className="text-center mt-8">
            Already registered?

            <Link
              href="/login"
              className="text-blue-600 ml-2"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}