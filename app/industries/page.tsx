import Link from "next/link"
import {
Home,
Wrench,
Droplets,
Trees,
ArrowRight
} from "lucide-react"

const industries = [

{
title:"Roofing CRM",
icon:Home,
href:"/industries/roofing",
description:
"Manage roofing leads, estimates, crews and projects."
},

{
title:"HVAC CRM",
icon:Wrench,
href:"/industries/hvac",
description:
"Schedule technicians, service calls and maintenance plans."
},

{
title:"Plumbing CRM",
icon:Droplets,
href:"/industries/plumbing",
description:
"Handle emergency jobs, dispatch and customer management."
},

{
title:"Landscaping CRM",
icon:Trees,
href:"/industries/landscaping",
description:
"Manage recurring maintenance and landscaping projects."
}

]

export default function IndustriesPage(){

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

<div className="text-center">

<div className="
inline-flex
px-4
py-2
rounded-full
bg-orange-500/10
text-orange-400
mb-6
">
Industries
</div>

<h1 className="
text-6xl
font-bold
">
Built for Service Businesses
</h1>

<p className="
text-slate-400
text-xl
mt-6
max-w-3xl
mx-auto
">
Purpose-built CRM solutions for home
service companies across multiple industries.
</p>

</div>

<div className="
grid
md:grid-cols-2
gap-8
mt-20
">

{
industries.map(item=>{

const Icon=item.icon

return(

<Link
key={item.title}
href={item.href}
>

<div className="
bg-slate-900
border
border-slate-800

rounded-3xl

p-10

hover:border-orange-500/40
transition
">

<Icon
size={36}
className="text-orange-500"
/>

<h2 className="
text-3xl
font-bold
mt-6
">
{item.title}
</h2>

<p className="
text-slate-400
mt-4
">
{item.description}
</p>

<div className="
flex
items-center
gap-2

text-orange-500

mt-6
">

Learn More

<ArrowRight size={18}/>

</div>

</div>

</Link>

)

})
}

</div>

</section>

</div>

)

}