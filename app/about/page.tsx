import Link from "next/link"

export default function AboutPage(){

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<section className="
max-w-5xl
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
About Koniqtech
</div>

<h1 className="
text-6xl
font-bold
">
Built for Service Businesses
</h1>

<p className="
text-xl
text-slate-400
mt-8
leading-relaxed
">

Koniqtech is an AI-powered CRM platform
designed specifically for Roofing,
HVAC, Plumbing and Landscaping companies.

Our mission is to help service businesses
grow faster through automation,
AI and streamlined operations.

</p>

</div>

<div className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-10
mt-16
">

<h2 className="
text-3xl
font-bold
mb-6
">

Our Vision

</h2>

<p className="
text-slate-400
leading-relaxed
">

To become the leading AI-powered operating system
for home service companies worldwide.

</p>

</div>

<div className="text-center mt-16">

<Link
href="/register"
className="
bg-orange-500
hover:bg-orange-600
px-8
py-4
rounded-xl
inline-block
"
>

Start Free Trial

</Link>

</div>

</section>

</div>

)

}