"use client"

import Link from "next/link"
import {
X
} from "lucide-react"

interface Props{
open:boolean
onClose:()=>void
}

export default function MobileMenu({
open,
onClose
}:Props){

if(!open) return null

return(

<div className="
fixed
inset-0
z-[999]
">

<div
onClick={onClose}
className="
absolute
inset-0
bg-black/70
backdrop-blur-sm
"
/>

<div className="
absolute
right-0
top-0

h-full
w-[320px]

bg-slate-950

border-l
border-slate-800

p-6

flex
flex-col
">

<div className="
flex
justify-between
items-center
mb-10
">

<h2 className="
text-xl
font-semibold
text-white
">

Menu

</h2>

<button
onClick={onClose}
className="text-white"
>

<X size={22}/>

</button>

</div>

<nav className="
flex
flex-col
gap-5
text-white
">

<Link
href="/"
onClick={onClose}
>
Home
</Link>

<Link
href="/features"
onClick={onClose}
>
Features
</Link>

<Link
href="/industries"
onClick={onClose}
>
Industries
</Link>

<Link
href="/pricing"
onClick={onClose}
>
Pricing
</Link>

<Link
href="/contact"
onClick={onClose}
>
Contact
</Link>

</nav>

<div className="
mt-auto
space-y-3
">

<Link
href="/login"
className="
block
text-center

border
border-slate-700

py-3

rounded-xl

text-white
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
hover:bg-orange-600

py-3

rounded-xl

text-white
"
>

Start Free

</Link>

</div>

</div>

</div>

)

}