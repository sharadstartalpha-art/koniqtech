import Link from "next/link"
import {
Users,
Calendar,
Brain,
FileText,
Wrench,
BarChart3,
Shield,
ArrowRight
} from "lucide-react"

const features = [
{
title:"Lead Management",
icon:Users,
desc:"Capture, qualify and convert leads from websites, forms and campaigns."
},
{
title:"Dispatch Board",
icon:Calendar,
desc:"Schedule technicians, assign jobs and optimize routes."
},
{
title:"AI Automation",
icon:Brain,
desc:"AI lead scoring, workflows, reminders and smart follow-ups."
},
{
title:"Quotes & Invoices",
icon:FileText,
desc:"Create estimates, invoices and customer documents instantly."
},
{
title:"Field Service",
icon:Wrench,
desc:"Manage jobs, technicians, crews and field operations."
},
{
title:"Analytics",
icon:BarChart3,
desc:"Revenue, conversion rates and business performance dashboards."
},
{
title:"Security",
icon:Shield,
desc:"Role based permissions and secure multi-tenant architecture."
}
]

export default function FeaturesPage(){

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
Platform Features
</div>

<h1 className="
text-6xl
font-bold
">
Everything your business needs
</h1>

<p className="
text-slate-400
text-xl
mt-6
max-w-3xl
mx-auto
">
Lead management, dispatch,
billing, AI automation and field
operations in one platform.
</p>

</div>

<div className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-6
mt-20
">

{
features.map((item)=>{

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
hover:border-orange-500/30
transition
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
leading-relaxed
">
{item.desc}
</p>

</div>

)

})
}

</div>

<div className="
text-center
mt-20
">

<Link
href="/register"
className="
inline-flex
items-center
gap-2

bg-orange-500
hover:bg-orange-600

px-8
py-4

rounded-xl

font-medium
"
>

Start Free Trial

<ArrowRight size={18}/>

</Link>

</div>

</section>

</div>

)

}