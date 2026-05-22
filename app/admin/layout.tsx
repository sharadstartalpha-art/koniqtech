"use client"

import Link from "next/link"

import {
useEffect,
useRef,
useState
} from "react"

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
ChevronDown,
MoreHorizontal,
LogOut

}

from "lucide-react"

const MENU=[

["Dashboard","/admin/dashboard",LayoutDashboard],

["Organizations","/admin/organizations",Building2],

["Users","/admin/users",Users],

["Plans","/admin/plans",CreditCard],

["Analytics","/admin/analytics",BarChart3],

["AI","/admin/ai",Brain],

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

const [open,setOpen]=
useState(false)

const ref=
useRef<HTMLDivElement>(null)

useEffect(()=>{

function outside(
e:any
){

if(

ref.current &&

!ref.current.contains(
e.target
)

){

setOpen(false)

}

}

document.addEventListener(
"mousedown",
outside
)

return()=>{

document.removeEventListener(
"mousedown",
outside
)

}

},[])

return(

<div className="
h-screen

flex

bg-[#f8f8f8]
">

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

<h1 className="
text-2xl
font-semibold
">

koniqtech

</h1>

<p className="
text-slate-500
">

Super Admin

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

<SidebarFooter/>

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

bg-slate-50
"

/>

</div>

<div

ref={ref}

className="
relative
"

>

<button

onClick={()=>
setOpen(
!open
)
}

className="
flex
items-center
gap-3

px-4
py-2

rounded-2xl

hover:bg-slate-100
"

>

<div className="
w-10
h-10

rounded-full

bg-black

text-white

flex
items-center
justify-center
">

S

</div>

<div className="
text-left
">

<p className="
text-sm
font-medium
">

Super Admin

</p>

<p className="
text-xs
text-slate-500
">

superadmin@koniqtech.com

</p>

</div>

<ChevronDown
size={16}
/>

</button>

{

open && (

<div className="
absolute

right-0
top-16

w-[250px]

bg-white

border

rounded-3xl

shadow-xl

overflow-hidden

z-50
">

<div className="
p-5
border-b
">

<p className="
font-semibold
">

Super Admin

</p>

<p className="
text-sm
text-slate-500
">

superadmin@koniqtech.com

</p>

</div>

<Link

href="/admin/settings"

className="
p-4

flex
items-center
gap-3

hover:bg-slate-50
"

>

<Settings
size={16}
/>

Settings

</Link>

<button

onClick={()=>{

window.location.href=
"/login"

}}

className="
w-full

p-4

flex
items-center
gap-3

text-red-600

hover:bg-red-50
"

>

<LogOut
size={16}
/>

Logout

</button>

</div>

)

}

</div>

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

function SidebarFooter(){

const [open,setOpen]=
useState(false)

return(

<div className="
border-t

relative

bg-white
">

<button

onClick={()=>
setOpen(
!open
)
}

className="
w-full

h-16

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

superadmin@koniqtech.com

</p>

<p className="
text-xs
text-slate-500
">

Super Admin

</p>

</div>

</div>

<MoreHorizontal
size={18}
/>

</button>

{

open && (

<div className="
absolute

left-2
bottom-20

w-[220px]

bg-white

border

rounded-3xl

shadow-xl

overflow-hidden

z-50
">

<Link

href="/admin/settings"

className="
block

p-4

hover:bg-slate-50
"

>

Settings

</Link>

<button

onClick={()=>{

window.location.href=
"/login"

}}

className="
w-full

p-4

text-left

text-red-600

hover:bg-red-50
"

>

Logout

</button>

</div>

)

}

</div>

)

}