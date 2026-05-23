import prisma from "@/shared/lib/prisma"

export default async function Page(){

const tasks=

await prisma.jobTask.findMany({

include:{
job:true
}

})

return(

<div>

<h1 className="text-4xl font-semibold mb-6">

Tasks

</h1>

<div className="space-y-4">

{

tasks.map(x=>(

<div
key={x.id}
className="bg-white border rounded-3xl p-6"
>

{x.title}

<br/>

{x.status}

<br/>

{x.job.title}

</div>

))

}

</div>

</div>

)

}