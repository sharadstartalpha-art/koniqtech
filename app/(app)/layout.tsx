import Link from "next/link"

const menu = [

["Dashboard","/dashboard"],

["Leads","/leads"],

["Customers","/customers"],

["Pipeline","/pipeline"],

["Jobs","/jobs"],

["Calendar","/calendar"],

["Messages","/messages"],

["Billing","/billing"],

["Dispatch","/dispatch"],

["Analytics","/analytics"],

["AI","/ai"],

["Monitoring","/monitoring"],

["QA","/qa"],

["Bugs","/bugs"],

["Infra","/infra"],

["Integrations","/integrations"]

]

export default function AppLayout({

children

}:{

children:React.ReactNode

}){

return(

<div className="h-screen flex bg-white">

{/* LEFT */}

<aside className="

w-[250px]

border-r

bg-[#fafafa]

flex

flex-col

">

<div className="

h-20

px-6

border-b

flex

items-center

gap-4

">

<img

src="/logo.png"

className="

w-9

h-9

object-contain

"

/>

<div>

<p className="

font-semibold

text-[16px]

text-slate-900

">

KoniqTech

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

overflow-y-auto

px-4

py-6

space-y-1

">

{

menu.map(

m=>(

<Menu

key={m[0]}

href={m[1]}

label={m[0]}

/>

)

)

}

</nav>

<div className="

border-t

p-5

">

<div className="

flex

items-center

gap-3

">

<div className="

w-8

h-8

rounded-full

bg-slate-200

"/>

<div>

<p className="

text-sm

font-medium

text-slate-900

">

info@koniqtech.com

</p>

</div>

</div>

</div>

</aside>

{/* RIGHT */}

<div className="

flex-1

flex

flex-col

">

<header className="

h-20

border-b

px-8

bg-white

flex

items-center

justify-between

">

<input

placeholder="Search..."

className="

w-[640px]

h-11

rounded-xl

border

border-slate-200

px-4

outline-none

text-slate-900

placeholder:text-slate-400

"

/>

<div className="

flex

items-center

gap-6

">

<button>

🔔

</button>

<img

src="/logo.png"

className="

w-10

h-10

rounded-full

object-cover

"

/>

</div>

</header>

<main className="

flex-1

bg-[#f8fafc]

overflow-auto

p-8

">

{children}

</main>

</div>

</div>

)

}

function Menu({

href,

label

}:{

href:string

label:string

}){

return(

<Link

href={href}

className="

flex

items-center

gap-3

px-4

py-3

rounded-xl

text-slate-700

text-sm

hover:bg-white

hover:shadow-sm

transition

"

>

{label}

</Link>

)

}