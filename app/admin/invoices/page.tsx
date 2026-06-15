import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page(){

const invoices=

await prisma.invoice.findMany({

orderBy:{

dueDate:"desc"

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Invoices

</h1>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-5">

Org

</th>

<th>

Customer

</th>

<th>

Amount

</th>

<th>

Status

</th>

<th>

Due Date

</th>

</tr>

</thead>

<tbody>

{

invoices.map(i=>(

<tr
key={i.id}
className="border-t"
>

<td className="p-5">

{i.orgId}

</td>

<td>

{i.customerId}

</td>

<td>

${Number(i.total)}

</td>

<td>

{i.status}

</td>

<td>

{

i.dueDate?.toDateString()

}

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