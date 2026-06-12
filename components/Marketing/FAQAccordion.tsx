"use client"

import { useState } from "react"
import {
Plus,
Minus
} from "lucide-react"

const faqs=[

{
q:"Which industries are supported?",
a:"Roofing, HVAC, Plumbing and Landscaping businesses."
},

{
q:"Is AI included?",
a:"Yes. AI Assistant, lead scoring, workflows and automation are available."
},

{
q:"Can I cancel anytime?",
a:"Yes. You can cancel your subscription at any time."
},

{
q:"Do you offer a free trial?",
a:"Yes. You can start with a free trial before subscribing."
},

{
q:"Does Koniqtech support invoicing?",
a:"Yes. Quotes, invoices and customer billing are included."
}

]

export default function FAQAccordion(){

const [active,setActive]=
useState<number|null>(0)

return(

<div className="
space-y-4
">

{

faqs.map(

(item,index)=>(

<div

key={index}

className="
bg-slate-900

border
border-slate-800

rounded-3xl

overflow-hidden
"

>

<button

onClick={()=>

setActive(

active===index

?

null

:

index

)

}

className="
w-full

flex
items-center
justify-between

p-6

text-left
"

>

<h3 className="
text-lg
font-semibold
text-white
">

{item.q}

</h3>

{

active===index

?

<Minus
size={18}
className="
text-orange-500
"
/>

:

<Plus
size={18}
className="
text-orange-500
"
/>

}

</button>

{

active===index && (

<div className="
px-6
pb-6

text-slate-400

leading-7
">

{item.a}

</div>

)

}

</div>

)

)

}

</div>

)

}