import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const jobs=
await prisma.job.findMany({

include:{
customer:true
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Route Optimization

</h1>

<div className="
bg-white
border
rounded-3xl
p-8
space-y-4
">

{

jobs.map(job=>(

<div
key={job.id}
className="
border
rounded-2xl
p-5
"
>

<h2>{job.title}</h2>

<p>

{job.customer.companyName}

</p>

</div>

))

}

</div>

</div>

)

}