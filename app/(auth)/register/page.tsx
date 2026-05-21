"use client"

import { useState } from "react"

import Link from "next/link"

export default function RegisterPage(){

const [name,setName]=useState("")

const [company,setCompany]=useState("")

const [email,setEmail]=useState("")

const [password,setPassword]=useState("")

const [crmType,setCrmType]=useState("roofing")

const [otp,setOtp]=useState("")

const [step,setStep]=useState(1)

async function sendOtp(){

const res=

await fetch(

"/api/auth/send-otp",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify({

email

})

}

)

if(res.ok){

setStep(2)

alert(

"OTP sent"

)

}

}

async function register(){

const res=

await fetch(

"/api/auth/register",

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:JSON.stringify({

name,

company,

email,

password,

otp,

crmType

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

`/subscriptions/paypal?crm=${crmType}&company=${company}&email=${email}`

}

return(

<div className="min-h-screen grid lg:grid-cols-2">

<div className="bg-black text-white flex items-center px-24">

<div>

<h1 className="text-7xl font-bold">

KONIQ CRM

</h1>

<p className="text-2xl text-slate-300 mt-8">

Choose your industry CRM

</p>

</div>

</div>

<div className="bg-slate-100 flex items-center justify-center">

<div className="bg-white rounded-3xl p-12 shadow-xl w-[560px]">

<h2 className="text-3xl font-bold mb-8">

Create Account

</h2>

<input

className="w-full border rounded-2xl p-5 mb-4"

placeholder="Name"

value={name}

onChange={e=>

setName(

e.target.value

)

}

/>

<input

className="w-full border rounded-2xl p-5 mb-4"

placeholder="Company"

value={company}

onChange={e=>

setCompany(

e.target.value

)

}

/>

<select

value={crmType}

onChange={e=>

setCrmType(

e.target.value

)

}

className="w-full border rounded-2xl p-5 mb-4"

>

<option value="roofing">

Roofing CRM ($199)

</option>

<option value="hvac">

HVAC CRM ($199)

</option>

<option value="plumbing">

Plumbing CRM ($199)

</option>

<option value="landscaping">

Landscaping CRM ($199)

</option>

</select>

<input

className="w-full border rounded-2xl p-5 mb-4"

placeholder="Email"

value={email}

onChange={e=>

setEmail(

e.target.value

)

}

/>

<input

type="password"

className="w-full border rounded-2xl p-5 mb-6"

placeholder="Password"

value={password}

onChange={e=>

setPassword(

e.target.value

)

}

/>

{

step===1

?

<button

onClick={sendOtp}

className="w-full bg-blue-600 text-white p-5 rounded-2xl"

>

Send OTP

</button>

:

<>

<input

className="w-full border rounded-2xl p-5 mb-4"

placeholder="OTP"

value={otp}

onChange={e=>

setOtp(

e.target.value

)

}

/>

<button

onClick={register}

className="w-full bg-blue-600 text-white p-5 rounded-2xl"

>

Continue To Payment

</button>

</>

}

<div className="text-center mt-6">

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