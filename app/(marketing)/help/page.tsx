import {
HelpCircle,
Mail,
MessageSquare,
Phone
} from "lucide-react"

export default function HelpPage(){

const items=[

{
title:"Email Support",
icon:Mail,
value:"support@koniqtech.com"
},

{
title:"Live Chat",
icon:MessageSquare,
value:"Available Mon-Fri"
},

{
title:"Phone Support",
icon:Phone,
value:"+1 (800) 555-1234"
}

]

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<section className="
max-w-6xl
mx-auto
px-6
py-24
">

<div className="text-center">

<div className="
inline-flex
items-center
gap-2
px-4
py-2
rounded-full
bg-orange-500/10
text-orange-400
mb-6
">

<HelpCircle size={16}/>

Help Center

</div>

<h1 className="
text-6xl
font-bold
">

How can we help?

</h1>

<p className="
text-xl
text-slate-400
mt-6
">

Find answers and contact support.

</p>

</div>

<div className="
grid
md:grid-cols-3
gap-6
mt-16
">

{
items.map(item=>{

const Icon=item.icon

return(

<div
key={item.title}
className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
"
>

<Icon
size={28}
className="text-orange-500"
/>

<h3 className="
text-2xl
font-semibold
mt-5
">

{item.title}

</h3>

<p className="
text-slate-400
mt-4
">

{item.value}

</p>

</div>

)

})
}

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

Frequently Asked Questions

</h2>

<div className="space-y-6">

<div>
<h3 className="font-semibold">
How do I upgrade my plan?
</h3>
<p className="text-slate-400 mt-2">
Visit Billing under Settings.
</p>
</div>

<div>
<h3 className="font-semibold">
Can I cancel anytime?
</h3>
<p className="text-slate-400 mt-2">
Yes. Cancel anytime from your account.
</p>
</div>

<div>
<h3 className="font-semibold">
Is data secure?
</h3>
<p className="text-slate-400 mt-2">
Yes. Enterprise-grade security measures are used.
</p>
</div>

</div>

</div>

</section>

</div>

)

}