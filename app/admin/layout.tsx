"use client"

import Link from "next/link"

import {

Search,
Building2,
Users,
CreditCard,
BarChart3,
Shield,
Database,
Brain,
Bell,
Settings,
LogOut,
MoreHorizontal

}

from "lucide-react"

import {

usePathname

}

from "next/navigation"

import {

useState

}

from "react"

const menu=[

[
"Dashboard",
"/admin/dashboard",
BarChart3
],

[
"Organizations",
"/admin/organizations",
Building2
],

[
"Users",
"/admin/users",
Users
],

[
"Plans",
"/admin/plans",
CreditCard
],

[
"Billing",
"/admin/billing",
CreditCard
],

[
"Analytics",
"/admin/analytics",
BarChart3
],

[
"AI",
"/admin/ai-analytics",
Brain
],

[
"Monitoring",
"/admin/monitoring",
Bell
],

[
"Audit",
"/admin/audit",
Shield
],

[
"Data",
"/admin/data",
Database
],

[
"Settings",
"/admin/settings",
Settings

]

]

export default function AdminLayout({

children

}:{

children:React.ReactNode

}){

const path=

usePathname()

const [

open,

setOpen

]=

useState(false)

return(

<div className="h-screen flex bg-[#fafafa]">

<aside className="w-[250px] bg-white border-r flex flex-col">

<div className="px-7 py-8 border-b">

<div className="flex gap-4">

<img

src="/logo.png"

className="w-9 h-9 object-contain"

/>

<div>

<h1 className="font-semibold text-[22px]">

koniqtech

</h1>

<p className="text-sm text-slate-500">

Super Admin

</p>

</div>

</div>

</div>

<nav className="flex-1 overflow-auto px-3 py-5">

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
text-[15px]
transition

${
path===href

?

"bg-[#f3f3f3]"

:

"hover:bg-[#f5f5f5]"
}

`}

>

<Icon

size={18}

/>

{label}

</Link>

)

)

}

</div>

</nav>

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

<div className="flex gap-3">

<div className="w-10 h-10 rounded-full bg-slate-200"/>

<div>

<p className="font-medium">

superadmin@koniqtech.com

</p>

<p className="text-xs text-slate-500">

Super Admin

</p>

</div>

</div>

<MoreHorizontal
size={18}
/>

</button>

{

open&&(

<div className="

absolute
bottom-20
left-3
w-[220px]
bg-white
border
rounded-3xl
shadow-xl
overflow-hidden

">

<Item

icon={Users}

label="Profile"

/>

<Item

icon={Building2}

label="Organizations"

/>

<Item

icon={Settings}

label="Settings"

/>

<a

href="/api/auth/logout"

className="

flex
gap-3
items-center
px-5
py-4
border-t
hover:bg-[#f5f5f5]

"

>

<LogOut
size={18}
/>

Logout

</a>

</div>

)

}

</div>

</aside>

<div className="flex-1 flex flex-col">

<header className="

h-[82px]
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
rounded-2xl
border
pl-14
outline-none

"

/>

</div>

<img

src="/logo.png"

className="

w-10
h-10

"

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

function Item({

icon:Icon,

label

}:any){

return(

<button

className="

w-full
flex
gap-3
items-center
px-5
py-4
hover:bg-[#f5f5f5]

"

>

<Icon
size={18}
/>

{label}

</button>

)

}