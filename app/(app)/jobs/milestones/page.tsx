import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const items=

await prisma.jobMilestone.findMany({

include:{
job:true
}

})

return(

<div className="space-y-6">

<h1 className="text-4xl font-semibold">

Milestones

</h1>

<div className="grid gap-4">

{

items.map(x=>(

<div
key={x.id}
className="bg-white border rounded-3xl p-6"
>

<h2 className="font-semibold">

{x.title}

</h2>

<p>

{x.status}

</p>

<p>

{x.job.title}

</p>

</div>

))

}

</div>

</div>

)

}