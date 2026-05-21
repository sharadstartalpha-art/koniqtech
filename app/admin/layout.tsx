"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

import {

LayoutDashboard,
Building2,
Users,
CreditCard,
BarChart3,
Brain,
Shield,
Database,
Bell,
Settings,
Search,
MoreHorizontal,
LogOut

}

from "lucide-react"

const menu=[

["Dashboard","/admin/dashboard",LayoutDashboard],

["Organizations","/admin/organizations",Building2],

["Users","/admin/users",Users],

["Plans","/admin/plans",CreditCard],

["Analytics","/admin/analytics",BarChart3],

["AI","/admin/ai-analytics",Brain],

["Audit","/admin/audit",Shield],

["Monitoring","/admin/monitoring",Bell],

["Data","/admin/data",Database],

["Settings","/admin/settings",Settings]

]

export default function AdminLayout({

children

}:{

children:React.ReactNode

}){

const pathname=

usePathname()

const [

open,

setOpen

]=

useState(false)

return(

<div className="flex h-screen bg-[#fafafa] text-black overflow-hidden">

{/* SIDEBAR */}

<aside className="w-[250px] bg-white border-r flex flex-col shrink-0">

<div className="h-[84px] border-b flex items-center px-7">

<img

src="/logo.png"

className="w-10 h-10 object-contain"

/>

<div className="ml-4">

<h1 className="font-semibold text-[20px]">

koniqtech

</h1>

<p className="text-sm text-slate-500">

Super Admin

</p>

</div>

</div>

<div className="flex-1 overflow-auto p-3">

<div className="space-y-1">

{

menu.map(

([

label,

href,

Icon

]:any)=>(

<Link

key={href}

href={href}

className={`

flex
items-center
gap-3
px-4
py-3
rounded-xl
transition

${

pathname===href

?

"bg-[#f3f3f3]"

:

"hover:bg-[#f5f5f5]"

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

</div>

<div className="border-t p-3 relative">

<button

onClick={()=>

setOpen(

!open

)

}

className="

w-full
flex
items-center
justify-between
p-3
rounded-xl
hover:bg-[#f5f5f5]

"

>

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-slate-200"/>

<div className="text-left">

<p className="text-sm font-medium">

superadmin@koniqtech.com

</p>

<p className="text-xs text-slate-500">

Super Admin

</p>

</div>

</div>

<MoreHorizontal size={18}/>

</button>

{

open&&(

<div className="

absolute
bottom-20
left-3
w-[220px]
bg-white
rounded-3xl
border
shadow-xl
overflow-hidden
z-50

">

<MenuItem
label="Profile"
/>

<MenuItem
label="Organizations"
/>

<MenuItem
label="Settings"
/>

<button

onClick={()=>{

window.location.href=

"/api/auth/logout"

}}

className="

w-full
flex
items-center
gap-3
px-5
py-4
border-t
hover:bg-[#f5f5f5]

"

>

<LogOut size={18}/>

Logout

</button>


</div>

)

}

</div>

</aside>

{/* MAIN */}

<div className="flex-1 flex flex-col overflow-hidden">

<header className="

h-[84px]
bg-white
border-b
px-8
flex
items-center
justify-between

">

<div className="relative">

<Search

size={18}

className="

absolute
left-5
top-1/2
-translate-y-1/2
text-slate-400

"

/>

<input

placeholder="Search..."

className="

w-[680px]
h-[50px]
border
rounded-2xl
pl-14
outline-none
bg-white

"

/>

</div>

<img

src="/logo.png"

className="w-10 h-10"

/>

</header>

<main className="flex-1 overflow-auto p-8 bg-[#fafafa]">

{children}

</main>

</div>

</div>

)

}

function MenuItem({

label

}:{

label:string

}){

return(

<button

className="

w-full
px-5
py-4
text-left
hover:bg-[#f5f5f5]

"

>

{label}

</button>

)

}