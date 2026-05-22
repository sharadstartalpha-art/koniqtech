"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState,useEffect } from "react"

import { getSession } from "next-auth/react"

import {

LayoutDashboard,
Users,
GitBranch,
Briefcase,
Calendar,
MessageSquare,
CreditCard,
Truck,
BarChart3,
Brain,
Bell,
Settings,
Search,
MoreHorizontal,
User,
Moon,
Home,
LogOut

} from "lucide-react"

const MENU=[

["Dashboard","/dashboard",LayoutDashboard],
["Leads","/leads",Users],
["Customers","/customers",Users],
["Pipeline","/pipeline",GitBranch],
["Jobs","/jobs",Briefcase],
["Calendar","/calendar",Calendar],
["Messages","/messages",MessageSquare],
["Billing","/billing",CreditCard],
["Dispatch","/dispatch",Truck],
["Analytics","/analytics",BarChart3],
["AI","/ai",Brain],
["Notifications","/notifications",Bell],
["Settings","/settings",Settings]

]

export default function Layout({

children

}:{

children:React.ReactNode

}){

const pathname=
usePathname()

const [email,setEmail]=
useState("")

useEffect(()=>{

load()

},[])

async function load(){

const session=
await getSession()

setEmail(

session?.user?.email

||

""

)

}

return(

<div className="h-screen flex bg-[#f8f8f8]">

<aside className="
w-[248px]
bg-white
border-r
flex
flex-col
">

<div className="
h-24
px-8
border-b
flex
items-center
gap-4
">

<img
src="/logo.png"
className="w-10 h-10"
/>

<div>

<h1 className="text-2xl font-semibold">

koniqtech

</h1>

<p className="text-slate-500">

CRM

</p>

</div>

</div>

<div className="
flex-1
overflow-auto
px-3
py-4
space-y-1
">

{

MENU.map(

([label,href,Icon]:any)=>(

<Link

key={href}

href={href}

className={`

h-11
px-4
rounded-xl

flex
items-center
gap-4

${

pathname===href

?

"bg-slate-100"

:

"hover:bg-slate-100"

}

`}

>

<Icon size={18}/>

{label}

</Link>

)

)

}

</div>

<FooterMenu

email={email}

/>

</aside>

<div className="
flex-1
flex
flex-col
">

<header className="
h-24
bg-white
border-b
px-8

flex
items-center
justify-between
">

<div className="
relative
w-[680px]
">

<Search

size={18}

className="
absolute
left-5
top-3.5
text-slate-400
"

/>

<input

placeholder="Search..."

className="
w-full
h-11
pl-12

rounded-2xl
border
"

/>

</div>

<img

src="/logo.png"

className="w-10 h-10"

/>

</header>

<main className="
flex-1
overflow-auto
p-8
">

{children}

</main>

</div>

</div>

)

}

function FooterMenu({

email

}:{

email:string

}){

const [open,setOpen]=
useState(false)

async function logout(){

await fetch(

"/api/auth/signout",

{

method:"POST"

}

)

window.location.href=
"/login"

}

return(

<div className="
border-t
p-3
relative
">

<button

onClick={()=>
setOpen(!open)
}

className="
w-full

flex
items-center
justify-between
"

>

<div className="
flex
items-center
gap-3
">

<div className="
w-10
h-10
rounded-full
bg-slate-200
"/>

<p className="text-sm">

{

email ||

"No user"

}

</p>

</div>

<MoreHorizontal size={18}/>

</button>

{

open && (

<div className="
absolute

left-3
bottom-16

w-[220px]

bg-white

rounded-3xl

border

shadow-xl
">

<Row

icon={<User size={16}/>}

label="Profile"

/>

<Row

icon={<Settings size={16}/>}

label="Settings"

/>

<button

onClick={logout}

className="
w-full

p-4

flex
items-center
gap-3
"

>

<LogOut size={16}/>

Logout

</button>

</div>

)

}

</div>

)

}

function Row({

icon,
label

}:any){

return(

<div className="
p-4

flex
items-center
gap-3
">

{icon}

{label}

</div>

)

}