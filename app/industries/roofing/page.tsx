import Link from "next/link"
import {
Home,
CheckCircle,
ArrowRight
} from "lucide-react"

export default function RoofingPage(){

const features=[

"Roofing Lead Management",
"Roof Inspection Tracking",
"Estimate Builder",
"Project Scheduling",
"Crew Management",
"Invoicing & Payments",
"AI Lead Scoring",
"Customer Portal"

]

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<section className="
max-w-7xl
mx-auto
px-6
py-24
">

<div className="
grid
lg:grid-cols-2
gap-16
items-center
">

<div>

<div className="
inline-flex
gap-2

px-4
py-2

rounded-full

bg-orange-500/10

text-orange-400
">

<Home size={16}/>

Roofing CRM

</div>

<h1 className="
text-7xl
font-bold
mt-8
">

CRM for

Roofing

Companies

</h1>

<p className="
text-xl
text-slate-400
mt-8
">

Manage leads, inspections,
estimates, projects, crews
and invoices from one platform.

</p>

<Link

href="/register"

className="
inline-flex
items-center
gap-2

bg-orange-500

px-8
py-4

rounded-xl

mt-10
"

>

Start Free Trial

<ArrowRight size={18}/>

</Link>

</div>

<div className="
bg-slate-900

border
border-slate-800

rounded-3xl

p-10
">

<h2 className="
text-3xl
font-bold
mb-8
">

Included Features

</h2>

<div className="
space-y-4
">

{
features.map(x=>(

<div
key={x}
className="
flex
items-center
gap-3
"
>

<CheckCircle
size={18}
className="text-orange-500"
/>

{x}

</div>

))
}

</div>

</div>

</div>

</section>

</div>

)

}