"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage(){

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loading,setLoading]=useState(false)

async function submit(
e:React.FormEvent
){

e.preventDefault()

setLoading(true)

const res=
await signIn(

"credentials",

{

email,
password,

redirect:false

}

)

setLoading(false)

if(!res?.ok){

alert(
"Invalid credentials"
)

return

}

/*
fetch session
*/

const sessionRes=
await fetch(

"/api/auth/session",

{

cache:"no-store"

}

)

const session=
await sessionRes.json()

const role=
session?.user?.role

if(

role===

"SUPER_ADMIN"

){

window.location.href=
"/admin/dashboard"

return

}

window.location.href=
"/dashboard"

}

return(

<div className="h-screen grid grid-cols-2">

<div className="bg-black flex items-center px-24">

<div>

<h1 className="text-white text-7xl font-bold">

KONIQ CRM

</h1>

<p className="text-white text-2xl mt-6">

AI CRM for home service companies

</p>

</div>

</div>

<div className="bg-slate-100 flex items-center justify-center">

<form

onSubmit={submit}

className="
bg-white
w-[520px]
p-12
rounded-3xl
space-y-6
"

>

<h1 className="text-5xl font-bold">

Sign In

</h1>

<input

value={email}

onChange={e=>
setEmail(
e.target.value
)
}

placeholder="Email"

className="
w-full
h-16
border
rounded-2xl
px-5
"

/>

<input

type="password"

value={password}

onChange={e=>
setPassword(
e.target.value
)
}

placeholder="Password"

className="
w-full
h-16
border
rounded-2xl
px-5
"

/>

<button

disabled={loading}

className="
w-full
h-16
bg-blue-600
text-white
rounded-2xl
"

>

{

loading

?

"Logging in..."

:

"Login"

}

</button>

</form>

</div>

</div>

)

}