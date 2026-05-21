"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SidebarLink({

href,

icon:Icon,

label

}:any){

const path=usePathname()

const active=

path===href

return(

<Link

href={href}

className={`

h-10

px-3

rounded-xl

flex

items-center

gap-3

text-sm

transition

${

active

?

"bg-[#ececec]"

:

"hover:bg-[#ececec]"

}

`}

>

<Icon size={17}/>

{label}

</Link>

)

}