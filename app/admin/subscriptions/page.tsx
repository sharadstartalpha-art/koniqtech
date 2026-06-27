import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const subscriptions=

await prisma.subscription.findMany({

orderBy:{

id:"desc"

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Subscriptions

</h1>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-5">

Plan

</th>

<th>

Org ID

</th>

<th>

Amount

</th>

<th>

Provider

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

{

subscriptions.map(sub=>(

<tr
key={sub.id}
className="border-t"
>

<td className="p-5">

{sub.plan}

</td>

<td>

{sub.orgId}

</td>

<td>

${sub.amount.toFixed(2)}

</td>

<td>

{sub.provider}

</td>

<td>

{sub.status}

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}