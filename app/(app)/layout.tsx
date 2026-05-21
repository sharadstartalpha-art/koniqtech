"use client"
import SidebarLink from "@/shared/components/sidebar-link"
import Link from "next/link"
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
Activity,
Bug,
Shield,
Plug,
Bell,
User,
Settings,
Moon,
Home,
LogOut,
MoreHorizontal

}

from "lucide-react"

const menu=[

{
name:"Dashboard",
href:"/dashboard",
icon:LayoutDashboard
},

{
name:"Leads",
href:"/leads",
icon:Users
},

{
name:"Customers",
href:"/customers",
icon:Users
},

{
name:"Pipeline",
href:"/pipeline",
icon:GitBranch
},

{
name:"Jobs",
href:"/jobs",
icon:Briefcase
},

{
name:"Calendar",
href:"/calendar",
icon:Calendar
},

{
name:"Messages",
href:"/messages",
icon:MessageSquare
},

{
name:"Billing",
href:"/billing",
icon:CreditCard
},

{
name:"Dispatch",
href:"/dispatch",
icon:Truck
},

{
name:"Analytics",
href:"/analytics",
icon:BarChart3
},

{
name:"AI",
href:"/ai",
icon:Brain
},

{
name:"Monitoring",
href:"/monitoring",
icon:Activity
},

{
name:"QA",
href:"/qa",
icon:Shield
},

{
name:"Bugs",
href:"/bugs",
icon:Bug
},

{
name:"Integrations",
href:"/integrations",
icon:Plug
}

]

export default function AppLayout({

children

}:{

children:React.ReactNode

}){

const [

open,

setOpen

]=useState(false)

return(

<div className="h-screen flex bg-white">

<aside className="

w-[248px]

border-r

bg-[#fafafa]

flex

flex-col

">

{/* TOP */}

<div className="

h-20

border-b

px-5

flex

items-center

gap-3

">

<img

src="/logo.png"

className="w-8 h-8"

/>

<div>

<p className="

font-semibold

text-slate-900

">

koniqtech

</p>

<p className="

text-xs

text-slate-500

">

CRM

</p>

</div>

</div>

{/* MENU */}

<div className="

flex-1

overflow-auto

px-3

py-4

space-y-1

">

{

menu.map(

item=>{

const Icon=item.icon

return(

<SidebarLink

key={item.name}

href={item.href}

icon={Icon}

label={item.name}

/>

)

}

)

}

</div>

{/* FOOTER */}

<div className="

border-t

p-3

relative

">

<div className="

flex

items-center

justify-between

">

<div className="

flex

items-center

gap-3

">

<div className="

w-8

h-8

rounded-full

bg-slate-200

"/>

<div>

<p className="

text-sm

font-medium

">

info@koniqtech.com

</p>

</div>

</div>

<button

onClick={()=>

setOpen(

!open

)

}

className="

text-slate-500

"

>

<MoreHorizontal

size={18}

/>

</button>

</div>

{

open&&(

<div className="

absolute

left-3

bottom-16

w-[220px]

bg-white

border

rounded-2xl

shadow-xl

overflow-hidden

z-50

">

<MenuRow

icon={User}

label="My profile"

/>

<MenuRow

icon={Moon}

label="Toggle theme"

/>

<MenuRow

icon={Home}

label="Homepage"

/>

<MenuRow

icon={Settings}

label="Settings"

/>

<form

action="/api/auth/logout"

method="POST"

>

<button

className="

w-full

px-4

h-12

flex

gap-3

items-center

hover:bg-slate-50

"

>

<LogOut

size={16}

/>

Logout

</button>

</form>

</div>

)

}

</div>

</aside>

{/* RIGHT */}

<div className="flex-1 flex flex-col">

<header className="

h-20

border-b

px-8

bg-white

flex

items-center

justify-between

">

<input

placeholder="Search..."

className="

w-[680px]

h-11

rounded-xl

border

px-4

text-sm

outline-none

"

/>

<div className="

flex

items-center

gap-5

">

<Bell

size={18}

/>

<img

src="/logo.png"

className="

w-9

h-9

"

/>

</div>

</header>

<main className="

flex-1

bg-slate-50

p-8

overflow-auto

">

{children}

</main>

</div>

</div>

)

}

function MenuRow({

icon:Icon,

label

}:any){

return(

<button

className="

w-full

h-12

px-4

flex

items-center

gap-3

hover:bg-slate-50

text-sm

"

>

<Icon size={16}/>

{label}

</button>

)

}