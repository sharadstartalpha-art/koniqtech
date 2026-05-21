import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function Page({

params

}:any){

const users=

await prisma.user.findMany({

where:{

orgId:params.id

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Tenant Users

</h1>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead>

<tr>

<th className="p-5">

Name

</th>

<th>

Email

</th>

<th>

Role

</th>

</tr>

</thead>

<tbody>

{

users.map(user=>(

<tr
key={user.id}
className="border-t"
>

<td className="p-5">

{user.name}

</td>

<td>

{user.email}

</td>

<td>

{user.role}

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