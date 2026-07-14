import Link from "next/link"

export default function Footer(){

return(

<footer
className="
border-t
border-slate-800

bg-slate-950
"
>

<div
className="
max-w-7xl
mx-auto

px-6
py-20

grid

md:grid-cols-5

gap-10
"
>

<div>

<div
className="
flex
items-center
gap-3
mb-5
"
>

<img
src="/logo.png"
className="w-10 h-10"
/>

<div>

<h3
className="
font-bold
text-xl
text-white
"
>
Koniqtech
</h3>

<p
className="
text-xs
text-slate-400
"
>
Field Service CRM
</p>

</div>

</div>

<p
className="
text-slate-400
leading-7
"
>
AI-powered CRM platform for roofing,
HVAC, plumbing and landscaping companies.
</p>

</div>

<div>

<h4
className="
font-semibold
mb-5
text-white
"
>
Product
</h4>

<div
className="
space-y-3
text-slate-400
"
>


<Link href="/features">
Features
</Link>

<br/>

<Link href="/ai">
AI Platform
</Link>

<br/>

<Link href="/integrations">
Integrations
</Link>

<br/>

<Link href="/pricing">
Pricing
</Link>

<br/>

<Link href="/docs">
Documentation
</Link>

<br/>

<Link href="/help">
Help Center
</Link>

</div>

</div>

<div>

<h4
className="
font-semibold
mb-5
text-white
"
>
Industries
</h4>

<div
className="
space-y-3
text-slate-400
"
>

<Link href="/industries">
All Industries
</Link>

<br/>    

<Link href="/industries/roofing">
Roofing
</Link>

<br/>

<Link href="/industries/hvac">
HVAC
</Link>

<br/>

<Link href="/industries/plumbing">
Plumbing
</Link>

<br/>

<Link href="/industries/landscaping">
Landscaping
</Link>

</div>

</div>

<div>

<h4
className="
font-semibold
mb-5
text-white
"
>
Company
</h4>

<div
className="
space-y-3
text-slate-400
"
>

<Link href="/about">
About
</Link>

<br/>

<Link href="/careers">
Careers
</Link>

<br/>

<Link href="/contact">
Contact
</Link>

<br/>

<Link href="/status">
System Status
</Link>

</div>

</div>

<div>

<h4
className="
font-semibold
mb-5
text-white
"
>
Legal
</h4>

<div
className="
space-y-3
text-slate-400
"
>

<Link href="/privacy-policy">
Privacy Policy
</Link>

<br/>

<Link href="/terms-and-conditions">
Terms & Conditions
</Link>

<br/>

<Link href="/refund-policy">
Refund Policy
</Link>

<br/>

<Link href="/cookie-policy">
Cookie Policy
</Link>

</div>

</div>

</div>

<div
className="
border-t
border-slate-800

py-8

text-center

text-slate-500
"
>

© {new Date().getFullYear()} Koniqtech.
All rights reserved.

</div>

</footer>

)

}