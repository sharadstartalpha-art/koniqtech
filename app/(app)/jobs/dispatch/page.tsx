import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const techs=
await prisma.user.findMany({

where:{
role:"technician"
},

include:{
jobs:true
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Dispatch Board

</h1>

<div className="
grid
grid-cols-4
gap-6
">

{

techs.map(tech=>(

<div

key={tech.id}

className="
bg-white
border
rounded-3xl
p-6
min-h-[500px]
"

>

<div className="mb-6">

<h2 className="
font-bold
text-xl
">

{tech.name}

</h2>

<p className="text-slate-500">

{tech.jobs.length} jobs

</p>

</div>

<div className="space-y-4">

{

tech.jobs.map(job=>(

<div

key={job.id}

className="
bg-slate-100
rounded-2xl
p-4
"

>

<h3 className="font-semibold">

{job.title}

</h3>

<p className="
text-sm
text-slate-500
">

{job.status}

</p>

</div>

))

}

</div>

</div>

))

}

</div>

</div>

)

}