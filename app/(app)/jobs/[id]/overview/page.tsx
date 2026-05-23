import prisma from "@/shared/lib/prisma"

export default async function Page({

params

}:any){

const job=
await prisma.job.findUnique({

where:{
id:params.id
},

include:{

customer:true,
technician:true

}

})

if(!job){

return null

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

{job.title}

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card
title="Customer"
value={
job.customer.companyName
||
job.customer.firstName
||
"Customer"
}
/>

<Card
title="Technician"
value={job.technician?.name||"Unassigned"}
/>

<Card
title="Status"
value={job.status}
/>

<Card
title="Schedule"
value={
job.scheduledDate?.toDateString()
||
"Not scheduled"
}
/>

</div>

</div>

)

}

function Card({

title,
value

}:any){

return(

<div className="
bg-white
rounded-3xl
border
p-8
">

<p className="text-slate-500">

{title}

</p>

<h2 className="
text-2xl
font-bold
mt-3
">

{value}

</h2>

</div>

)

}