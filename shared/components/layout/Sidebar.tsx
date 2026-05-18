import Link from "next/link"

const items=[

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

<div className="
w-72
bg-white
border-r
h-screen
p-6
">

<h1 className="
text-4xl
font-bold
mb-10
">

KONIQ

</h1>

<div className="
space-y-3
">

{

items.map(

x=>(

<Link

key={x}

href={`/${x}`}

className="
block
rounded-xl
p-3
hover:bg-slate-100
capitalize
"

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