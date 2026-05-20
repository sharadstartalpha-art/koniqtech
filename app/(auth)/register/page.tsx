"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage(){

const [name,setName]=useState("")
const [company,setCompany]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [otp,setOtp]=useState("")

const [step,setStep]=useState(1)

async function sendOtp(){

const res=await fetch(
"/api/auth/send-otp",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email
})
}
)

if(res.ok){

setStep(2)

alert("OTP sent")

}

}

async function register(){

const res=await fetch(
"/api/auth/verify-otp",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

name,

organization:company,

email,

password,

code:otp

})
}
)

if(res.ok){

window.location.href="/login"

return

}

alert("Registration failed")

}

return(

<div className="min-h-screen grid lg:grid-cols-2">

<div className="bg-blue-700 text-white flex items-center px-20">

<div>

<h1 className="text-7xl font-bold mb-8">

Start Free

</h1>

<p className="text-3xl">

Launch your CRM in minutes

</p>

</div>

</div>

<div className="bg-slate-100 flex items-center justify-center">

<div className="bg-white rounded-3xl w-full max-w-xl p-12 shadow-xl space-y-6">

<input
className="w-full p-5 rounded-2xl border"
placeholder="Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
className="w-full p-5 rounded-2xl border"
placeholder="Company"
value={company}
onChange={e=>setCompany(e.target.value)}
/>

<input
className="w-full p-5 rounded-2xl border"
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<input
className="w-full p-5 rounded-2xl border"
type="password"
placeholder="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

{

step===1?

<button
onClick={sendOtp}
className="w-full bg-blue-600 text-white p-5 rounded-2xl"
>

Send OTP

</button>

:

<>

<input
className="w-full p-5 rounded-2xl border"
placeholder="OTP"
value={otp}
onChange={e=>setOtp(e.target.value)}
/>

<button
onClick={register}
className="w-full bg-blue-600 text-white p-5 rounded-2xl"
>

Register

</button>

</>

}

<div className="text-center">

<Link
href="/login"
className="text-blue-600"
>

Login

</Link>

</div>

</div>

</div>

</div>

)

}