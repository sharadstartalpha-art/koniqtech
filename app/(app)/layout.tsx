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
MoreHorizontal,
Bell,
User,
Home,
Moon,
Settings,
LogOut

} from "lucide-react"

const items=[

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

<div className="

w-[248px]

bg-[#fafafa]

border-r

flex

flex-col

">

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

<div className="

flex-1

overflow-auto

px-3

py-5

space-y-1

">

{

items.map(

([name,href,Icon]:any)=>(

<Link

key={href}

href={href}

className={`

flex

items-center

gap-3

h-10

px-3

rounded-xl

text-sm

text-black

transition

${

path===href

?

"bg-[#e9e9e9]"

:

"hover:bg-[#ececec]"

}

`}

>

<Icon

size={16}

color="#52525b"

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

bottom-14

left-2

w-[220px]

bg-white

border

rounded-2xl

shadow-xl

overflow-hidden

">

<Row

icon={User}

label="My profile"

/>

<Row

icon={Moon}

label="Toggle theme"

/>

<Row

icon={Home}

label="Homepage"

/>

<Row

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

h-11

px-4

flex

items-center

gap-3

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

</div>

{/* CONTENT */}

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

"

/>

<div className="

flex

gap-5

items-center

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

p-8

overflow-auto

">

{children}

</main>

</div>

</div>

)

}

function Row({

icon:Icon,

label

}:any){

return(

<button

className="

w-full

h-11

px-4

flex

items-center

gap-3

text-black

hover:bg-slate-50

"

>

<Icon

size={16}

/>

{label}

</button>

)

}