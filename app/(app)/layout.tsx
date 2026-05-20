"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function AppLayout({
  children,
}:{
  children:React.ReactNode
}){

const pathname=
usePathname()

async function logout(){

await fetch(
"/api/auth/logout",
{
method:"POST"
}
)

window.location.href=
"/login"

}

const menus=[

{
href:"/dashboard",
label:"Dashboard"
},

{
href:"/leads",
label:"Leads"
},

{
href:"/customers",
label:"Customers"
},

{
href:"/pipeline",
label:"Pipeline"
},

{
href:"/jobs",
label:"Jobs"
},

{
href:"/calendar",
label:"Calendar"
},

{
href:"/messages",
label:"Messages"
},

{
href:"/quotes",
label:"Quotes"
},

{
href:"/documents",
label:"Documents"
},

{
href:"/dispatch",
label:"Dispatch"
},

{
href:"/billing",
label:"Billing"
},

{
href:"/subscriptions",
label:"Subscriptions"
},

{
href:"/notifications",
label:"Notifications"
},

{
href:"/team",
label:"Team"
},

{
href:"/roles",
label:"Roles"
},

{
href:"/analytics",
label:"Analytics"
},

{
href:"/ai",
label:"AI"

},

{
href:"/monitoring",
label:"Monitoring"
},

{
href:"/reports",
label:"Reports"
},

{
href:"/settings",
label:"Settings"
}

]

return(

<div className="
min-h-screen
flex
bg-slate-100
">

<aside className="
w-72
bg-slate-950
text-white
flex
flex-col
shadow-xl
">

<div className="
p-6
border-b
border-slate-800
">

<Image

src="/logo.png"

alt="logo"

width={150}

height={60}

className="
object-contain
"

/>

<p className="
text-xs
text-slate-400
mt-3
">

AI Service Platform

</p>

</div>

<nav className="
flex-1
overflow-y-auto
p-5
space-y-2
">

{

menus.map(
item=>(

<Link

key={item.href}

href={item.href}

className={`

block

px-4

py-3

rounded-xl

text-sm

font-medium

transition

${

pathname.startsWith(
item.href
)

?

"bg-blue-600 text-white"

:

"text-slate-300 hover:bg-slate-800"

}

`}

>

{item.label}

</Link>

)

)

}

</nav>

<div className="
p-5
border-t
border-slate-800
">

<button

onClick={logout}

className="

w-full

bg-red-500

hover:bg-red-600

transition

text-white

rounded-xl

py-3

font-medium

"

>

Logout

</button>

</div>

</aside>

<div className="
flex-1
flex
flex-col
">

<header className="

bg-white

h-20

border-b

px-10

flex

items-center

justify-between

shadow-sm

">

<div>

<h2 className="
text-2xl
font-bold
text-slate-800
">

{

pathname
.replace(
"/",
""
)

||

"dashboard"

}

</h2>

<p className="
text-sm
text-slate-500
capitalize
">

KONIQ CRM

</p>

</div>

<div className="
flex
items-center
gap-4
">

<div className="
w-11
h-11
rounded-full
bg-blue-100
flex
items-center
justify-center
font-bold
text-blue-600
">

K

</div>

<div>

<p className="
font-semibold
text-slate-800
">

Koniq Admin

</p>

<p className="
text-sm
text-slate-500
">

Owner

</p>

</div>

</div>

</header>

<main className="
p-8
overflow-auto
flex-1
">

{children}

</main>

</div>

</div>

)

}