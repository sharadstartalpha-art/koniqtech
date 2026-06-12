"use client"

import Link from "next/link"
import { useState } from "react"
import {
Menu,
X,
ChevronDown
} from "lucide-react"

export default function Navbar(){

const [mobileOpen,setMobileOpen]=
useState(false)

const [industryOpen,setIndustryOpen]=
useState(false)

return(

<header
className="
sticky
top-0
z-50

border-b
border-slate-800

bg-slate-950/90
backdrop-blur
"
>

<div
className="
max-w-7xl
mx-auto

h-20

px-6

flex
items-center
justify-between
"
>

<Link
href="/"
className="
flex
items-center
gap-3
"
>

<img
src="/logo.png"
alt="Koniqtech"
className="w-10 h-10"
/>

<div>

<h2
className="
text-white
font-bold
text-xl
"
>
Koniqtech
</h2>

<p
className="
text-slate-400
text-xs
"
>
Field Service CRM
</p>

</div>

</Link>

<nav
className="
hidden
lg:flex

items-center
gap-8
"
>

<Link
href="/features"
className="
text-slate-300
hover:text-white
"
>
Features
</Link>

<div
className="relative"
onMouseEnter={()=>
setIndustryOpen(true)
}
onMouseLeave={()=>
setIndustryOpen(false)
}
>

<button
className="
flex
items-center
gap-2

text-slate-300
hover:text-white
"
>

Industries

<ChevronDown size={16}/>

</button>

{

industryOpen && (

<div
className="
absolute
top-full
left-0

mt-3

w-64

bg-slate-900

border
border-slate-800

rounded-2xl

overflow-hidden
"
>

<Link
href="/industries/roofing"
className="
block
px-5
py-4

hover:bg-slate-800
"
>
Roofing CRM
</Link>

<Link
href="/industries/hvac"
className="
block
px-5
py-4

hover:bg-slate-800
"
>
HVAC CRM
</Link>

<Link
href="/industries/plumbing"
className="
block
px-5
py-4

hover:bg-slate-800
"
>
Plumbing CRM
</Link>

<Link
href="/industries/landscaping"
className="
block
px-5
py-4

hover:bg-slate-800
"
>
Landscaping CRM
</Link>

</div>

)

}

</div>

<Link
href="/pricing"
className="
text-slate-300
hover:text-white
"
>
Pricing
</Link>

<Link
href="/about"
className="
text-slate-300
hover:text-white
"
>
About
</Link>

<Link
href="/docs"
className="
text-slate-300
hover:text-white
"
>
Docs
</Link>

<Link
href="/contact"
className="
text-slate-300
hover:text-white
"
>
Contact
</Link>

</nav>

<div
className="
hidden
lg:flex

items-center
gap-4
"
>

<Link
href="/login"
className="
text-slate-300
hover:text-white
"
>
Login
</Link>

<Link
href="/register"
className="
bg-orange-500

hover:bg-orange-600

text-white

px-5
py-3

rounded-xl

font-medium
"
>
Start Free
</Link>

</div>

<button
onClick={()=>
setMobileOpen(true)
}
className="
lg:hidden
text-white
"
>

<Menu size={26}/>

</button>

</div>

{

mobileOpen && (

<div
className="
fixed
inset-0
z-[999]
"
>

<div
onClick={()=>
setMobileOpen(false)
}
className="
absolute
inset-0

bg-black/70
"
/>

<div
className="
absolute

right-0
top-0

h-full
w-[320px]

bg-slate-950

border-l
border-slate-800

p-6
"
>

<div
className="
flex
justify-between
items-center

mb-8
"
>

<h3
className="
text-white
font-semibold
"
>
Menu
</h3>

<button
onClick={()=>
setMobileOpen(false)
}
>

<X
size={24}
className="text-white"
/>

</button>

</div>

<div
className="
flex
flex-col
gap-5
"
>

<Link href="/features">
Features
</Link>

<Link href="/industries">
Industries
</Link>

<Link href="/pricing">
Pricing
</Link>

<Link href="/about">
About
</Link>

<Link href="/docs">
Docs
</Link>

<Link href="/contact">
Contact
</Link>

<Link href="/help">
Help
</Link>

</div>

<div
className="
mt-10
space-y-3
"
>

<Link
href="/login"
className="
block

text-center

border
border-slate-700

py-3

rounded-xl
"
>
Login
</Link>

<Link
href="/register"
className="
block

text-center

bg-orange-500

py-3

rounded-xl
"
>
Start Free
</Link>

</div>

</div>

</div>

)

}

</header>

)

}