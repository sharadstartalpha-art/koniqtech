"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-6 text-center">Login</h1>

        <button
          onClick={() => signIn("google")}
          className="w-full bg-red-500 text-white py-2 mb-2 rounded"
        >
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="w-full bg-gray-800 text-white py-2 mb-2 rounded"
        >
          Continue with GitHub
        </button>

        <button
          onClick={() => signIn("facebook")}
          className="w-full bg-blue-600 text-white py-2 mb-4 rounded"
        >
          Continue with Facebook
        </button>

        <div className="text-center text-gray-500 mb-2">OR</div>

        <button
          onClick={() => signIn()}
          className="w-full border py-2 rounded"
        >
          Login with Email
        </button>
      </div>
    </div>
  )
}