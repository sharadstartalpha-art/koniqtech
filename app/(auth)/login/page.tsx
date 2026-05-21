"use client"

import { useState } from "react"

export default function LoginPage() {

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)

  async function login(){

    try{

      setLoading(true)

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

        setLoading(false)

        alert(

          data.error ||

          "Login failed"

        )

        return

      }

      window.location.href=

      data.redirect ||

      "/dashboard"

    }

    catch(err){

      setLoading(false)

      alert(

        "Server error"

      )

    }

  }

  return(

<div className="min-h-screen grid grid-cols-2">

<div className="bg-black text-white flex flex-col justify-center px-24">

<h1 className="text-6xl font-bold mb-8">

KONIQ CRM

</h1>

<p className="text-2xl text-gray-300">

AI CRM for home service companies

</p>

</div>

<div className="bg-slate-100 flex items-center justify-center">

<div className="bg-white rounded-3xl p-12 shadow-xl w-[520px]">

<h2 className="text-3xl font-bold mb-8">

Sign In

</h2>

<input

value={email}

onChange={(e)=>

setEmail(

e.target.value

)

}

placeholder="Email"

className="

w-full
border
rounded-xl
p-4
mb-5

"

/>

<input

type="password"

value={password}

onChange={(e)=>

setPassword(

e.target.value

)

}

placeholder="Password"

className="

w-full
border
rounded-xl
p-4
mb-8

"

/>

<button

onClick={login}

disabled={loading}

className="

w-full
h-14
bg-blue-600
text-white
rounded-xl
font-semibold

"

>

{

loading

?

"Signing in..."

:

"Login"

}

</button>

<div className="mt-6 text-center">

<a

href="/register"

className="text-blue-600"

>

Create account

</a>

</div>

</div>

</div>

</div>

  )

}