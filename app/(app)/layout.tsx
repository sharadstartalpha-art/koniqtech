"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
["Settings","/settings",Settings],

["QA","/qa",Settings],
["Bugs","/bugs",Settings],
["Infra","/infra",Settings],
["Integrations","/integrations",Settings]

]

export default function Layout({

children

}:{

children:React.ReactNode

}){

const pathname=usePathname()

return(

<div className="h-screen flex bg-[#f8f8f8]">

{/* SIDEBAR */}

<aside className="w-[248px] bg-white border-r border-slate-200 flex flex-col">

{/* LOGO */}

<div className="h-24 px-8 border-b border-slate-200 flex items-center gap-4">

<img
src="/logo.png"
className="w-10 h-10 object-contain"
/>

<div>

<h1 className="font-semibold text-[22px] text-black">

koniqtech

</h1>

<p className="text-sm text-slate-500">

CRM

</p>

</div>

</div>

{/* MENU */}

<div className="flex-1 overflow-auto px-3 py-4 space-y-1">

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

text-[15px]
font-medium

transition

${

pathname===href

?

"bg-slate-100 text-black"

:

"text-slate-800 hover:bg-slate-100"

}

`}

>

<Icon size={18}/>

<span>

{label}

</span>

</Link>

)

)

}

</div>

<FooterMenu/>

</aside>

{/* CONTENT */}

<div className="flex-1 flex flex-col">

<header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

<div className="relative w-[680px]">

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
border-slate-200
bg-[#fafafa]
outline-none
text-black
"

/>

</div>

<img

src="/logo.png"

className="w-10 h-10"

/>

</header>

<main className="flex-1 overflow-auto p-8">

{children}

</main>

</div>

</div>

)

}

function FooterMenu(){

const [open,setOpen]=useState(false)

async function logout(){

await fetch(

"/api/auth/logout",

{

method:"POST"

}

)

window.location.href="/login"

}

return(

<div className="border-t border-slate-200 p-3 relative bg-white">

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
border-slate-200

shadow-xl

overflow-hidden

z-50

">

<Row icon={<User size={16}/>}

label="My profile"/>

<Row icon={<Moon size={16}/>}

label="Toggle theme"

badge="M"/>

<Row icon={<Home size={16}/>}

label="Homepage"/>

<Row icon={<Settings size={16}/>}

label="Settings"/>

<button

onClick={logout}

className="

w-full

px-5
py-4

flex
items-center
gap-3

hover:bg-slate-100

border-t

text-black

"

>

<LogOut size={16}/>

Logout

</button>

</div>

)

}

<button

onClick={()=>setOpen(!open)}

className="
w-full

flex
items-center
justify-between

"

>

<div className="flex items-center gap-3">

<div className="
w-10
h-10
rounded-full
bg-slate-200
"/>

<p className="text-sm text-black">

info@koniqtech.com

</p>

</div>

<MoreHorizontal size={18}/>

</button>

</div>

)

}

function Row({

icon,
label,
badge

}:any){

return(

<button

className="

w-full

px-5
py-4

flex
items-center
justify-between

hover:bg-slate-100

text-black

"

>

<div className="flex items-center gap-3">

{icon}

{label}

</div>

{

badge && (

<div className="
bg-slate-200
px-2
rounded-md
text-xs
">

{badge}

</div>

)

}

</button>

)

}