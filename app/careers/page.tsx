import Link from "next/link"

const jobs=[

{
title:"Senior Full Stack Developer",
location:"Remote"
},

{
title:"UI/UX Designer",
location:"Remote"
},

{
title:"Customer Success Manager",
location:"Remote"
}

]

export default function CareersPage(){

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
px-4
py-2
rounded-full
bg-orange-500/10
text-orange-400
mb-6
">
Careers
</div>

<h1 className="
text-6xl
font-bold
">
Join Our Team
</h1>

<p className="
text-slate-400
text-xl
mt-6
">
Help build the future of AI-powered CRM software.
</p>

</div>

<div className="
space-y-6
mt-20
">

{
jobs.map(job=>(

<div
key={job.title}
className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
flex
justify-between
items-center
"
>

<div>

<h3 className="
text-2xl
font-semibold
">
{job.title}
</h3>

<p className="text-slate-400 mt-2">
{job.location}
</p>

</div>

<Link
href="/contact"
className="
bg-orange-500
hover:bg-orange-600
px-6
py-3
rounded-xl
"
>

Apply

</Link>

</div>

))
}

</div>

</section>

</div>

)

}