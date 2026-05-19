import Link from "next/link"

export default function HomePage(){

return(

<div className="min-h-screen bg-slate-950 text-white">

<header className="max-w-7xl mx-auto px-8 py-6 flex justify-between">

<h1 className="text-3xl font-bold">

KONIQTECH

</h1>

<nav className="space-x-8">

<Link href="/login">

Login

</Link>

<Link href="/register">

Start Free

</Link>

</nav>

</header>

<section className="max-w-7xl mx-auto px-8 py-24">

<div className="grid lg:grid-cols-2 gap-16">

<div>

<h2 className="text-6xl font-bold leading-tight">

AI CRM for

Roofing

HVAC

Plumbing

Landscaping

</h2>

<p className="mt-8 text-slate-300">

All-in-one CRM + AI + Dispatch + Docs + Billing

</p>

<div className="mt-8 flex gap-4">

<Link

href="/register"

className="bg-blue-600 px-6 py-4 rounded-xl"

>

Start Free

</Link>

<Link

href="/portal"

className="border px-6 py-4 rounded-xl"

>

View Demo

</Link>

</div>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

CRM Preview

</div>

</div>

</section>

</div>

)

}