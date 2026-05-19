import Link from "next/link"

export default function Home(){

return(

<div className="min-h-screen bg-slate-950 text-white">

<nav className="
border-b
border-slate-800
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

<h1 className="
text-3xl
font-bold
">

KONIQTECH

</h1>

<div className="
flex
gap-5
items-center
">

<Link href="/login">

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
grid
lg:grid-cols-2
gap-20
items-center
px-8
py-28
">

<div>

<div className="
inline-flex
bg-slate-800
rounded-full
px-4
py-2
mb-8
">

AI CRM PLATFORM

</div>

<h1 className="
text-7xl
font-bold
leading-tight
">

AI CRM for

Roofing HVAC

Plumbing

Landscaping

</h1>

<p className="
text-xl
text-slate-300
mt-8
">

Lead management • Dispatch • Quotes • Billing • AI • Documents • Automation

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
"
>

Start Free

</Link>

<Link
href="/portal"
className="
border
border-slate-600
px-8
py-4
rounded-xl
"
>

View Demo

</Link>

</div>

</div>

<div className="
bg-slate-900
rounded-3xl
p-10
border
border-slate-800
">

<div className="
grid
grid-cols-2
gap-6
">

<div className="
bg-slate-800
rounded-2xl
p-8
">

<h2 className="text-4xl font-bold">

241

</h2>

<p>

Leads

</p>

</div>

<div className="
bg-slate-800
rounded-2xl
p-8
">

<h2 className="text-4xl font-bold">

$82K

</h2>

<p>

Revenue

</p>

</div>

<div className="
bg-slate-800
rounded-2xl
p-8
">

43 Jobs

</div>

<div className="
bg-slate-800
rounded-2xl
p-8
">

112 Customers

</div>

</div>

</div>

</section>

</div>

)

}