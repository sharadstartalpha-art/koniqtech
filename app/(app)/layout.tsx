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

const menus=[

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

export default function AppLayout({

children

}:{

children:React.ReactNode

}){

const pathname=usePathname()

return(

<div className="h-screen flex bg-[#f8f8f8]">

{/* SIDEBAR */}

<aside className="w-[248px] bg-white border-r border-slate-200 flex flex-col">

<div className="h-24 border-b border-slate-200 px-7 flex items-center gap-4">

<img

src="/logo.png"

className="w-10 h-10 object-contain"

/>

<div>

<h1 className="font-semibold text-xl">

koniqtech

</h1>

<p className="text-slate-500 text-sm">

CRM

</p>

</div>

</div>

<div className="flex-1 overflow-auto py-4 px-3 space-y-1">

{

menus.map(

([label,href,Icon]:any)=>(

<Link

key={href}

href={href}

className={`

flex
items-center
gap-4
px-4
h-11
rounded-xl
text-[16px]
transition

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

<FooterMenu/>

</aside>

{/* CONTENT */}

<div className="flex-1 flex flex-col">

<header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center justify-between">

<div className="w-[680px] relative">

<Search

size={18}

className="absolute left-5 top-4 text-slate-400"

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
"

/>

</div>

<img

src="/logo.png"

className="w-10 h-10 object-contain"

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

<div className="border-t border-slate-200 p-3 relative">

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

<p className="text-sm">

info@koniqtech.com

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
border
border-slate-200
rounded-3xl
shadow-xl
overflow-hidden
z-50
">

<Item

icon={<User size={16}/>}

label="My profile"

/>

<Item

icon={<Moon size={16}/>}

label="Toggle theme"

badge="M"

/>

<Item

icon={<Home size={16}/>}

label="Homepage"

/>

<Item

icon={<Settings size={16}/>}

label="Settings"

/>

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

function Item({

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
"

>

<div className="
flex
items-center
gap-3
">

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