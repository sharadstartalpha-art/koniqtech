import Link from "next/link"

export default function Home(){

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<div className="
max-w-7xl
mx-auto
px-8
py-8
flex
justify-between
">

<h1 className="
text-3xl
font-bold
">

KONIQTECH

</h1>

<div className="space-x-5">

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

<section className="
max-w-7xl
mx-auto
px-8
py-24
grid
grid-cols-2
gap-16
items-center
">

<div>

<h1 className="
text-7xl
font-bold
leading-tight
">

AI CRM for Home Service Companies

</h1>

<p className="
text-xl
text-slate-300
mt-8
">

Roofing • HVAC • Plumbing • Landscaping

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
border-white
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
bg-slate-800
rounded-3xl
h-[600px]
p-10
">

CRM Preview

</div>

</section>

</div>

)

}