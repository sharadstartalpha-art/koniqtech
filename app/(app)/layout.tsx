import Link from "next/link"

const menu=[

["Dashboard","/dashboard"],

["Leads","/leads"],

["Customers","/customers"],

["Pipeline","/pipeline"],

["Jobs","/jobs"],

["Dispatch","/dispatch"],

["Calendar","/calendar"],

["Analytics","/analytics"],

["Billing","/billing"],

["AI","/ai"],

["Settings","/settings"]

]

export default function Layout({

children

}:{

children:React.ReactNode

}){

return(

<div className="h-screen flex">

<aside className="
w-72
bg-white
border-r
flex
flex-col
">

<div className="
h-20
px-6
border-b
flex
items-center
gap-3
">

<img

src="/logo.png"

className="
h-10
"

/>

<div>

<p className="
font-bold
">

KONIQ

</p>

<p className="
text-xs
text-slate-500
">

CRM

</p>

</div>

</div>

<nav className="
flex-1
p-5
space-y-2
">

{

menu.map(

m=>(

<Link

key={m[0]}

href={m[1]}

className="
block
px-4
py-3
rounded-xl
hover:bg-slate-100
"

>

{m[0]}

</Link>

)

)

}

</nav>

</aside>

<div className="
flex-1
bg-slate-50
">

<header className="
bg-white
h-20
border-b
px-8
flex
items-center
justify-between
">

<input

placeholder="
Search"

className="
border
rounded-xl
px-4
py-2
w-96
"

/>

<div className="
flex
gap-4
">

<button>

🔔

</button>

<img

src="/avatar.png"

className="
w-10
h-10
rounded-full
"

/>

</div>

</header>

<main className="
p-8
">

{children}

</main>

</div>

</div>

)

}