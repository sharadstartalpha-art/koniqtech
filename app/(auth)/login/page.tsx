"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="p-10 space-y-4">
      <button onClick={() => signIn("google")}>
        Login with Google
      </button>

      <button onClick={() => signIn("github")}>
        Login with GitHub
      </button>

      <button onClick={() => signIn("facebook")}>
        Login with Facebook
      </button>

      <button
        onClick={() =>
          signIn("credentials", {
            email: "test@test.com",
            password: "123456",
            callbackUrl: "/dashboard",
          })
        }
      >
        Login with Email
      </button>
    </div>
  )
}