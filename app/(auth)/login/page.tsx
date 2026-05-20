"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage(){

const router=useRouter()

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loading,setLoading]=useState(false)

async function login(){

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

setLoading(false)

if(!res.ok){

alert(

data.error ||

"Login failed"

)

return

}

router.push(

"/dashboard"

)

}

return(

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

onChange={(e)=>

setEmail(
e.target.value
)

}

placeholder="Email"

className="w-full p-5 border rounded-2xl mb-5 text-black"

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

className="w-full p-5 border rounded-2xl mb-5 text-black"

/>

<button

onClick={login}

disabled={loading}

className="w-full bg-blue-600 text-white p-5 rounded-2xl"

>

{

loading ?

"Signing in..." :

"Sign In"

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