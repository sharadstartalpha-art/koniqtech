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
Activity,

Bell,

MoreHorizontal,

User,
Moon,
Home,
Settings,
LogOut,

ChevronRight

}

from "lucide-react"

const menu=[

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

["Monitoring","/monitoring",Activity]

]

export default function Layout({

children

}:{

children:React.ReactNode

}){

const path=usePathname()

const [

open,

setOpen

]=useState(false)

return(

<div className="h-screen flex bg-white">

{/* SIDEBAR */}

<aside className="

w-[248px]

border-r

bg-[#fafafa]

flex

flex-col

relative

overflow-visible

">

{/* HEADER */}

<div className="

h-20

border-b

px-6

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

text-black

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

overflow-y-auto

px-3

py-4

space-y-1

">

{

menu.map(

([name,href,Icon]:any)=>(

<Link

key={href}

href={href}

className={`

h-11

px-3

rounded-xl

flex

items-center

gap-3

text-black

text-sm

transition

${

path===href

?

"bg-[#ececec]"

:

"hover:bg-[#ececec]"

}

`}

>

<Icon

size={16}

/>

{name}

</Link>

)

)

}

</div>

{/* FOOTER */}

<div className="

border-t

p-3

relative

overflow-visible

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

<p className="

text-sm

text-black

">

info@koniqtech.com

</p>

</div>

<button

onClick={()=>

setOpen(

!open

)

}

className="

w-8

h-8

rounded-lg

hover:bg-slate-200

flex

items-center

justify-center

"

>

<MoreHorizontal

size={18}

/>

</button>

</div>

{/* POPUP */}

{

open&&(

<div className="

absolute

bottom-16

left-2

w-[220px]

bg-white

border

rounded-2xl

shadow-2xl

z-[999]

overflow-hidden

">

<Row

icon={User}

label="My profile"

/>

<Row

icon={Moon}

label="Toggle theme"

right="M"

/>

<Row

icon={Home}

label="Homepage"

/>

<Row

icon={Settings}

label="Settings"

/>

<div className="border-t"/>

<form
action="/api/auth/logout"
method="POST"
>

<button
className="
w-full
h-12
px-4
flex
items-center
gap-3
hover:bg-slate-50
"
>

<LogOut size={16}/>

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

text-black

placeholder:text-slate-400

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

className="w-8 h-8"

/>

</div>

</header>

<main className="

flex-1

bg-slate-50

overflow-auto

p-8

">

{children}

</main>

</div>

</div>

)

}

function Row({

icon:Icon,

label,

right

}:any){

return(

<button

className="

w-full

h-12

px-4

flex

items-center

justify-between

hover:bg-slate-50

"

>

<div className="

flex

items-center

gap-3

text-black

text-sm

">

<Icon

size={16}

/>

{label}

</div>

{

right&&(

<span className="

text-xs

bg-slate-200

px-2

rounded

">

{right}

</span>

)

}

</button>

)

}