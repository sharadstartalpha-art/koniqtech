"use client"

import { useState } from "react"

import Link from "next/link"

import {

ArrowRight,
Sparkles

}

from "lucide-react"

export default function RegisterPage(){

const [name,setName]=useState("")

const [company,setCompany]=useState("")

const [email,setEmail]=useState("")

const [password,setPassword]=useState("")

const [crmType,setCrmType]=
useState("roofing")

const [otp,setOtp]=
useState("")

const [step,setStep]=
useState(1)

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

alert("OTP sent")

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

<div className="
min-h-screen

grid

lg:grid-cols-2
">

<div className="
hidden
lg:flex

bg-black

text-white

items-center

px-24
">

<div>

<div className="
inline-flex

gap-2

px-4
py-2

rounded-full

bg-white/10
">

<Sparkles size={16}/>

CRM Platform

</div>

<h1 className="
text-7xl

font-bold

mt-8
">

Create your

workspace

</h1>

<p className="
text-slate-300

text-xl

mt-8
">

Launch your CRM
with subscriptions,
AI and automation.

</p>

</div>

</div>

<div className="
bg-slate-50

flex
items-center
justify-center

p-10
">

<div className="
w-full

max-w-[560px]

bg-white

border

rounded-[32px]

p-12
">

<h1 className="
text-4xl

font-semibold
">

Create account

</h1>

<p className="
text-slate-500

mt-3
">

Start your CRM workspace

</p>

<div className="
space-y-4

mt-8
">

<input

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

placeholder="Name"

value={name}

onChange={e=>

setName(
e.target.value
)

}

/>

<input

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

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

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

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

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

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

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

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

className="
w-full

h-14

bg-black

text-white

rounded-2xl
"

>

Send OTP

</button>

:

<>

<input

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50
"

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

className="
w-full

h-14

bg-black

text-white

rounded-2xl

flex
items-center
justify-center
gap-2
"

>

Continue

<ArrowRight size={16}/>

</button>

</>

}

</div>

<div className="
text-center

mt-8

text-sm
">

Already have account?

<Link

href="/login"

className="
ml-2

font-medium
"

>

Login

</Link>

</div>

</div>

</div>

</div>

)

}