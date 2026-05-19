"use client"

import Link from "next/link"

const items=[

"dashboard",
"leads",
"customers",
"pipeline",
"jobs",
"calendar",
"messages",
"reports",
"settings",
"ai"

]

export default function Sidebar(){

return(

<div className="
w-72
bg-white
border-r
min-h-screen
p-6
space-y-8
">

<h1 className="
text-3xl
font-bold
">

KONIQ CRM

</h1>

<nav className="space-y-4">

{

items.map(

x=>(

<Link
key={x}
href={`/${x}`}
className="
block
rounded-lg
px-4
py-3
hover:bg-slate-100
capitalize
"
>

{x}

</Link>

)

)

}

</nav>

</div>

)

}