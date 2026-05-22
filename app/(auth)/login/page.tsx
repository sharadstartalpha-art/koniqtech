"use client"

import { signIn } from "next-auth/react"

import { useState } from "react"

import {

Shield,
Sparkles,
Building2,
ArrowRight

}

from "lucide-react"

export default function LoginPage(){

const [email,setEmail]=
useState("")

const [password,setPassword]=
useState("")

const [loading,setLoading]=
useState(false)

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

"super_admin"

){

window.location.href=
"/admin/dashboard"

return

}

window.location.href=
"/dashboard"

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

relative

overflow-hidden

bg-gradient-to-br

from-slate-950

via-slate-900

to-black
">

<div className="
absolute

inset-0

bg-[radial-gradient(circle_at_top_right,#1e293b,transparent_45%)]
"/>

<div className="
relative

z-10

flex
flex-col
justify-between

p-20

text-white
">

<div>

<div className="
flex
items-center
gap-4
">

<img

src="/logo.png"

className="
w-12
h-12
"

/>

<div>

<h1 className="
text-2xl
font-semibold
">

Koniqtech

</h1>

<p className="
text-slate-400
">

AI CRM Platform

</p>

</div>

</div>

</div>

<div>

<div className="
inline-flex

items-center
gap-2

px-4
py-2

rounded-full

bg-white/10

backdrop-blur
">

<Sparkles
size={16}
/>

AI Powered CRM

</div>

<h1 className="
text-7xl

font-bold

leading-tight

mt-8
">

Grow your

home service

business

</h1>

<p className="
text-xl

text-slate-300

mt-8

max-w-xl
">

Manage leads, customers,
dispatch, billing, AI,
automation and field teams
from one platform.

</p>

<div className="
flex
gap-4

mt-10
">

<Badge

icon={<Building2 size={16}/>}

label="Multi Tenant"

/>

<Badge

icon={<Shield size={16}/>}

label="Secure Auth"

/>

</div>

</div>

<div className="
text-slate-500
text-sm
">

© 2026 koniqtech CRM

</div>

</div>

</div>

<div className="
bg-slate-50

flex
items-center
justify-center

p-10
">

<form

onSubmit={submit}

className="
w-full

max-w-[520px]

bg-white

border

rounded-[32px]

p-12

shadow-sm
"

>

<div>

<p className="
text-sm
text-slate-500
">

Welcome back

</p>

<h1 className="
text-5xl

font-semibold

tracking-tight

mt-2
">

Sign In

</h1>

<p className="
text-slate-500

mt-4
">

Access your CRM workspace

</p>

</div>

<div className="
space-y-5

mt-10
">

<input

value={email}

onChange={e=>

setEmail(
e.target.value
)

}

placeholder="Email address"

className="
w-full

h-14

px-5

rounded-2xl

border

bg-slate-50

outline-none

focus:bg-white
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

h-14

px-5

rounded-2xl

border

bg-slate-50

outline-none

focus:bg-white
"

/>

<button

disabled={loading}

className="
w-full

h-14

rounded-2xl

bg-black

text-white

font-medium

flex
items-center
justify-center
gap-2
"

>

{

loading

?

"Signing in..."

:

<>

Continue

<ArrowRight
size={16}
/>

</>

}

</button>

</div>

<div className="
mt-8

text-sm

text-slate-500
text-center
">

Powered by Koniq SaaS CRM

</div>

</form>

</div>

</div>

)

}

function Badge({

icon,
label

}:any){

return(

<div className="
flex
items-center
gap-2

px-4
py-3

rounded-2xl

bg-white/10

backdrop-blur
">

{icon}

{label}

</div>

)

}