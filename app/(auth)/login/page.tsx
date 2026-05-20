"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState("admin@koniqtech.com")
  const [password, setPassword] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    async function login(){

const res=

await fetch(

"/api/auth/login",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify({

email,

password

})

}

)

const data=

await res.json()

if(!res.ok){

alert(

data.error

)

return

}

window.location.href=

"/dashboard"

}
}

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      <div className="bg-slate-950 text-white p-20 flex flex-col justify-center">

        <h1 className="text-6xl font-bold">
          KONIQ CRM
        </h1>

        <p className="text-xl text-slate-300 mt-6">
          AI CRM for home service companies
        </p>

      </div>

      <div className="bg-slate-100 flex items-center justify-center">

        <div className="bg-white w-[520px] rounded-3xl shadow-2xl p-12">

          <h1 className="text-5xl font-bold mb-10">
            Login
          </h1>

          <form
            onSubmit={submit}
            className="space-y-5"
          >

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
              Sign In
            </button>

          </form>

          <p className="mt-8 text-center">

            No account?

            <Link
              href="/register"
              className="text-blue-600 ml-2"
            >
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}