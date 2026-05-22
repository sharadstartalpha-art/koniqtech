import Link from "next/link"

import {

ArrowRight,
Check,
Building2,
Brain,
Wrench,
Calendar,
FileText,
Users,
ChevronRight

}

from "lucide-react"

const industries=[

"Roofing CRM",
"HVAC CRM",
"Plumbing CRM",
"Landscaping CRM"

]

const features=[

{
title:"Lead Management",
icon:Users,
desc:"Capture, qualify and manage leads"
},

{
title:"Dispatch Board",
icon:Calendar,
desc:"Schedule technicians and jobs"
},

{
title:"AI Automation",
icon:Brain,
desc:"Lead scoring and workflows"
},

{
title:"Quotes & Docs",
icon:FileText,
desc:"Invoices, estimates and PDFs"
},

{
title:"Field Service",
icon:Wrench,
desc:"Jobs, service calls and teams"
},

{
title:"Multi Tenant SaaS",
icon:Building2,
desc:"Industry CRM platform"
}

]

const faqs=[

{
q:"Which industries are supported?",
a:"Roofing, HVAC, Plumbing and Landscaping with dedicated CRM workflows."
},

{
q:"Is billing included?",
a:"Yes. Quotes, invoices, subscriptions and customer billing."
},

{
q:"Can I use AI?",
a:"Yes. AI assistant, workflows, lead scoring and automations."
},

{
q:"Is this multi tenant?",
a:"Yes. Each company operates in isolated organizations."
}

]

export default function Home(){

return(

<div className="
min-h-screen

bg-slate-950

text-white
">

<nav className="
sticky
top-0

z-50

backdrop-blur

border-b

border-slate-800/50

bg-slate-950/80
">

<div className="
max-w-7xl

mx-auto

px-8
py-6

flex
justify-between
items-center
">

<div className="
flex
items-center
gap-4
">

<img

src="/logo.png"

className="
w-10
h-10
"

/>

<div>

<h1 className="
text-2xl
font-semibold
">

koniqtech

</h1>

<p className="
text-xs
text-slate-400
">

Multi CRM Platform

</p>

</div>

</div>

<div className="
flex
gap-4
items-center
">

<Link

href="/login"

className="
text-slate-300
"

>

Login

</Link>

<Link

href="/register"

className="
bg-blue-600

px-5
py-3

rounded-xl
"

>

Start Free

</Link>

</div>

</div>

</nav>

<section className="
max-w-7xl

mx-auto

px-8
py-28

grid

lg:grid-cols-2

gap-20

items-center
">

<div>

<div className="
inline-flex

px-4
py-2

rounded-full

bg-slate-800

mb-8
">

AI Multi Industry CRM

</div>

<h1 className="
text-7xl

font-bold

leading-tight
">

CRM platform

for home

service

businesses

</h1>

<p className="
text-xl

text-slate-300

mt-8

max-w-2xl
">

Lead management,
dispatch,
quotes,
billing,
AI,
field service,
automation and SaaS management.

</p>

<div className="
flex
gap-4

mt-10
">

<Link

href="/register"

className="
bg-blue-600

px-8
py-4

rounded-xl

flex
items-center
gap-2
"

>

Start Free

<ArrowRight size={18}/>

</Link>

<Link

href="/login"

className="
border

border-slate-700

px-8
py-4

rounded-xl
"

>

View Demo

</Link>

</div>

<div className="
grid

grid-cols-2

gap-4

mt-12
">

{

industries.map(

x=>(

<div

key={x}

className="
bg-slate-900

border

border-slate-800

rounded-2xl

p-5
"

>

{x}

</div>

)

)

}

</div>

</div>

<div className="
bg-slate-900

border

border-slate-800

rounded-[32px]

p-10
">

<div className="
grid

grid-cols-2

gap-6
">

<Stat
v="241"
t="Leads"
/>

<Stat
v="$82K"
t="Revenue"
/>

<Stat
v="43"
t="Jobs"
/>

<Stat
v="112"
t="Customers"
/>

</div>

</div>

</section>

<section className="
max-w-7xl

mx-auto

px-8
pb-24
">

<div className="
text-center

mb-16
">

<h2 className="
text-5xl

font-bold
">

Everything included

</h2>

</div>

<div className="
grid

md:grid-cols-3

gap-6
">

{

features.map(

x=>(

<div

key={x.title}

className="
bg-slate-900

border

border-slate-800

rounded-3xl

p-8
"

>

<x.icon
size={24}
/>

<h3 className="
text-2xl

font-semibold

mt-6
">

{x.title}

</h3>

<p className="
text-slate-400

mt-4
">

{x.desc}

</p>

</div>

)

)

}

</div>

</section>

<section className="
max-w-7xl

mx-auto

px-8
pb-24
">

<div className="
bg-slate-900

border

border-slate-800

rounded-[32px]

p-12
">

<h2 className="
text-5xl

font-bold

text-center
">

Pricing

</h2>

<div className="
grid

md:grid-cols-2

gap-8

mt-12
">

<PricingCard

title="Starter"

price="$199"

features={[

"Industry CRM",
"Leads",
"Customers",
"Jobs",
"Billing"

]}

/>

<PricingCard

title="Pro AI"

price="$299"

features={[

"AI",
"Voice",
"Automation",
"Scoring",
"Workflows"

]}

/>

</div>

</div>

</section>

<section className="
max-w-5xl

mx-auto

px-8
pb-24
">

<h2 className="
text-5xl

font-bold

text-center

mb-16
">

FAQ

</h2>

<div className="
space-y-5
">

{

faqs.map(

x=>(

<div

key={x.q}

className="
bg-slate-900

border

border-slate-800

rounded-3xl

p-8
"

>

<h3 className="
text-xl

font-semibold
">

{x.q}

</h3>

<p className="
text-slate-400

mt-4
">

{x.a}

</p>

</div>

)

)

}

</div>

</section>

<section className="
border-t

border-slate-800
">

<div className="
max-w-7xl

mx-auto

px-8
py-20

text-center
">

<h2 className="
text-5xl

font-bold
">

Start growing today

</h2>

<p className="
text-slate-400

mt-5
">

Launch your CRM workspace

</p>

<Link

href="/register"

className="
inline-flex

items-center
gap-2

bg-blue-600

px-8
py-4

rounded-xl

mt-8
"

>

Get Started

<ChevronRight size={18}/>

</Link>

</div>

</section>

</div>

)

}

function Stat({

v,
t

}:any){

return(

<div className="
bg-slate-800

rounded-2xl

p-8
">

<h2 className="
text-5xl

font-bold
">

{v}

</h2>

<p className="
text-slate-400

mt-3
">

{t}

</p>

</div>

)

}

function PricingCard({

title,
price,
features

}:any){

return(

<div className="
bg-slate-800

rounded-3xl

p-10
">

<h3 className="
text-3xl

font-bold
">

{title}

</h3>

<p className="
text-6xl

font-bold

mt-6
">

{price}

<span className="
text-xl

text-slate-400
">

/mo

</span>

</p>

<div className="
space-y-4

mt-8
">

{

features.map(

(x:string)=>(

<div

key={x}

className="
flex
gap-3
"

>

<Check size={18}/>

{x}

</div>

)

)

}

</div>

</div>

)

}