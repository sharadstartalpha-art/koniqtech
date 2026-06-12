import Link from "next/link"
import { Check } from "lucide-react"

const plans = [

{
name:"Starter",
price:"$199",
description:"Perfect for growing service businesses.",
features:[
"Lead Management",
"Customers",
"Jobs",
"Dispatch Board",
"Quotes",
"Invoices",
"Analytics"
]
},

{
name:"Growth AI",
price:"$299",
description:"Everything in Starter plus AI.",
featured:true,
features:[
"Everything Starter",
"AI Assistant",
"Lead Scoring",
"AI Workflows",
"AI Follow Ups",
"Voice AI",
"Advanced Analytics"
]
},

{
name:"Enterprise",
price:"Custom",
description:"For multi-location organizations.",
features:[
"Unlimited Locations",
"White Label",
"Custom Integrations",
"Dedicated Support",
"Advanced Security",
"SLA Support"
]
}

]

export default function PricingPage(){

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
Pricing
</div>

<h1 className="
text-6xl
font-bold
">
Simple pricing
</h1>

<p className="
text-slate-400
text-xl
mt-6
">
No hidden fees.
Scale as you grow.
</p>

</div>

<div className="
grid
lg:grid-cols-3
gap-8
mt-20
">

{

plans.map(plan=>(

<div

key={plan.name}

className={`
rounded-3xl
p-8

border

${
plan.featured
?
"bg-orange-500 text-white border-orange-500"
:
"bg-slate-900 border-slate-800"
}
`}

>

<h2 className="
text-3xl
font-bold
">
{plan.name}
</h2>

<p className="
mt-4
opacity-80
">
{plan.description}
</p>

<div className="
text-6xl
font-bold
mt-8
">
{plan.price}

{
plan.price !== "Custom" && (
<span className="
text-xl
font-normal
">
/mo
</span>
)
}

</div>

<div className="
space-y-4
mt-10
">

{
plan.features.map(feature=>(

<div
key={feature}
className="
flex
items-center
gap-3
"
>

<Check size={18}/>

<span>
{feature}
</span>

</div>

))
}

</div>

<Link

href="/register"

className={`
block
text-center

mt-10

py-4

rounded-xl

font-medium

${
plan.featured
?
"bg-white text-black"
:
"bg-orange-500 hover:bg-orange-600"
}
`}

>

{
plan.name==="Enterprise"
?
"Contact Sales"
:
"Start Free"
}

</Link>

</div>

))

}

</div>

<section className="
mt-24
text-center
">

<h2 className="
text-4xl
font-bold
">
Need a custom solution?
</h2>

<p className="
text-slate-400
mt-4
">
Multi-location,
franchise and enterprise deployments available.
</p>

<Link

href="/contact"

className="
inline-block

mt-8

bg-orange-500
hover:bg-orange-600

px-8
py-4

rounded-xl
"

>

Contact Sales

</Link>

</section>

</section>

</div>

)

}