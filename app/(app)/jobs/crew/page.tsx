import prisma from "@/shared/lib/prisma"

export default async function Page(){

const crew=

await prisma.crewAssignment.findMany({

include:{

job:true,
user:true

}

})

return(

<div>

<h1 className="text-4xl font-semibold mb-6">

Crew Assignment

</h1>

<div className="space-y-4">

{

crew.map(x=>(

<div
key={x.id}
className="bg-white border rounded-3xl p-6"
>

{x.user.name}

<br/>

{x.job.title}

<br/>

{x.role}

</div>

))

}

</div>

</div>

)

}