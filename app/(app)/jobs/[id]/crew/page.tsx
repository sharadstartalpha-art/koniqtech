import prisma from "@/shared/lib/prisma"

export default async function Page({
params
}:any){

const { id }=
await params

const crew=
await prisma.crewAssignment.findMany({

where:{
jobId:id
},

include:{
user:true
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Crew

</h1>

{

crew.map(x=>(

<div
key={x.id}
className="
bg-white
border
rounded-3xl
p-6
"
>

{x.user.name}

</div>

))

}

</div>

)

}