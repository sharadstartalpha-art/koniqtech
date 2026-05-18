"use client"

import Link from
"next/link"

const links=[

"dashboard",

"leads",

"customers",

"pipeline",

"quotes",

"jobs",

"calendar",

"messages",

"automation",

"billing",

"reports",

"settings",

"ai"

]

export default function Sidebar(){

return(

<div className="w-72 h-screen border-r p-5">

<h1 className="text-2xl font-bold">

KONIQ CRM

</h1>

<div className="mt-8 space-y-3">

{

links.map(

x=>(

<Link

key={x}

href={`/${x}`}

className=
"block p-3 rounded"

>

{x}

</Link>

)

)

}

</div>

</div>

)

}