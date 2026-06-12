import {
CheckCircle
} from "lucide-react"

const services=[

"API",
"Authentication",
"CRM",
"Billing",
"AI Services",
"Notifications",
"Storage"

]

export default function StatusPage(){

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
bg-green-500/10
text-green-400
mb-6
">

System Status

</div>

<h1 className="
text-6xl
font-bold
">

All Systems Operational

</h1>

<p className="
text-slate-400
text-xl
mt-6
">

Current platform health and uptime.

</p>

</div>

<div className="
space-y-4
mt-16
">

{
services.map(service=>(

<div
key={service}
className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6

flex
justify-between
items-center
"
>

<span>
{service}
</span>

<div className="
flex
items-center
gap-2
text-green-400
">

<CheckCircle size={18}/>

Operational

</div>

</div>

))
}

</div>

</section>

</div>

)

}