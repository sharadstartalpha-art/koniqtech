"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const industries = [

{
name:"Roofing CRM",
href:"/industries/roofing"
},

{
name:"HVAC CRM",
href:"/industries/hvac"
},

{
name:"Plumbing CRM",
href:"/industries/plumbing"
},

{
name:"Landscaping CRM",
href:"/industries/landscaping"
}

]

export default function IndustriesDropdown(){

const [open,setOpen]=
useState(false)

return(

<div
className="relative"
onMouseEnter={()=>
setOpen(true)
}
onMouseLeave={()=>
setOpen(false)
}
>

<button
className="
flex
items-center
gap-2

text-slate-300

hover:text-white

transition
"
>

Industries

<ChevronDown
size={16}
/>

</button>

{

open && (

<div
className="
absolute

top-full
left-0

mt-3

w-72

bg-slate-900

border
border-slate-800

rounded-2xl

overflow-hidden

shadow-2xl
"
>

{

industries.map(

item=>(

<Link

key={item.name}

href={item.href}

className="
block

px-5
py-4

text-slate-300

hover:bg-slate-800
hover:text-white

transition
"

>

{item.name}

</Link>

)

)

}

</div>

)

}

</div>

)

}