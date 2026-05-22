import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await getServerSession()

if(!session?.user?.email){

return null

}

const dbUser=
await prisma.user.findUnique({

where:{
email:session.user.email
}

})

if(!dbUser){

return null

}

const leads=
await prisma.lead.findMany({

where:{
orgId:dbUser.orgId
},

orderBy:{
createdAt:"desc"
}

})

return(

<div className="space-y-8">

<div className="flex justify-between">

<h1 className="text-5xl font-bold">

Leads

</h1>

<Link

href="/leads/create"

className="
bg-black
text-white
px-6
py-3
rounded-xl
"

>

Create Lead

</Link>

</div>

<div className="
bg-white
border
rounded-3xl
overflow-hidden
">

<table className="w-full">

<thead>

<tr className="bg-slate-100">

<th className="p-5">

Name

</th>

<th>

Email

</th>

<th>

Phone

</th>

<th>

Status

</th>

</tr>

</thead>

<tbody>

{

leads.map(item=>(

<tr
key={item.id}
className="border-t"
>

<td className="p-5">

{

item.firstName

}

</td>

<td>

{item.email}

</td>

<td>

{item.phone}

</td>

<td>

{item.status}

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