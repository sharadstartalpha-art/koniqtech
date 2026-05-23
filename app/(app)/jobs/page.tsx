import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await auth()

const orgId=

(session?.user as any)
?.orgId

const jobs=

await prisma.job.findMany({

where:{
orgId
},

include:{

customer:true,

technician:true

},

orderBy:{

scheduledDate:"desc"

}

})

return(

<div className="space-y-6">

<div className="
flex
justify-between
items-center
">

<h1 className="
text-4xl
font-semibold
">

Jobs

</h1>

<Link

href="/jobs/create"

className="
bg-green-600

text-white

px-5
py-3

rounded-xl
"

>

New Job

</Link>

</div>

<div className="
grid

md:grid-cols-3

gap-4
">

<LinkCard
title="Job Board"
href="/jobs/board"
/>

<LinkCard
title="Milestones"
href="/jobs/milestones"
/>

<LinkCard
title="Crew"
href="/jobs/crew"
/>

<LinkCard
title="Tasks"
href="/jobs/tasks"
/>

<LinkCard
title="Dependencies"
href="/jobs/dependencies"
/>

<LinkCard
title="Materials"
href="/jobs/materials"
/>

<LinkCard
title="Purchase Orders"
href="/jobs/purchase-orders"
/>

<LinkCard
title="Change Orders"
href="/jobs/change-orders"
/>

<LinkCard
title="Punch List"
href="/jobs/punch-list"
/>

<LinkCard
title="Closeout"
href="/jobs/closeout"
/>

</div>

<div className="
bg-white

border

rounded-3xl

overflow-hidden
">

<table className="w-full">

<thead className="
bg-slate-50
">

<tr>

<th className="p-4">

Job

</th>

<th>

Customer

</th>

<th>

Tech

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

{

jobs.map(

j=>(

<tr
key={j.id}
className="
border-t
"
>

<td className="p-4">

<Link
href={`/jobs/${j.id}`}
>

{j.title}

</Link>

</td>

<td>

{

j.customer.firstName

}

</td>

<td>

{

j.technician?.name

||

"Unassigned"

}

</td>

<td>

{j.status}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

</div>

)

}

function LinkCard({

title,
href

}:any){

return(

<Link

href={href}

className="
bg-white

border

rounded-2xl

p-6
"

>

{title}

</Link>

)

}