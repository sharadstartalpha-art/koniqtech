import prisma from "@/shared/lib/prisma"

export default async function Page(){

const jobs=
await prisma.job.findMany({

take:20,

orderBy:{
title:"asc"
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Queues

</h1>

<div className="
bg-white
rounded-3xl
border
p-8
space-y-4
">

{

jobs.map(job=>(

<div

key={job.id}

className="
border-b
pb-4
"

>

<h2 className="font-bold">

{job.title}

</h2>

<p>

{job.status}

</p>

</div>

))

}

</div>

</div>

)

}