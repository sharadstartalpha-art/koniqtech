import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export default async function Page({
params
}:{
params:Promise<{
id:string
}>
}){

const { id }=await params

const job=
await prisma.job.findUnique({

where:{id},

include:{
customer:true,
technician:true
}

})

if(!job){

return <div>Job not found</div>

}

const modules=[

["Board",`/jobs/${id}/board`],
["Milestones",`/jobs/${id}/milestones`],
["Crew",`/jobs/${id}/crew`],
["Tasks",`/jobs/${id}/tasks`],
["Dependencies",`/jobs/${id}/dependencies`],
["Materials",`/jobs/${id}/materials`],
["Purchase Orders",`/jobs/${id}/purchase-orders`],
["Change Orders",`/jobs/${id}/change-orders`],
["Punch List",`/jobs/${id}/punch`],
["Closeout",`/jobs/${id}/closeout`],
["Schedule",`/jobs/${id}/schedule`]
]

return(

<div className="space-y-8">

<div>

<h1 className="text-5xl font-bold">

{job.title}

</h1>

<p className="text-slate-500 mt-2">

{job.customer.firstName}

{" "}

{job.customer.lastName}

</p>

</div>

<div className="grid grid-cols-5 gap-5">

{

modules.map(([title,href])=>(

<Link

key={href}

href={href}

className="
bg-white
border
rounded-3xl
p-8
hover:border-blue-600
"

>

{title}

</Link>

))

}

</div>

</div>

)

}