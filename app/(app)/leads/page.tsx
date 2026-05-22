import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await getServerSession()

const user=
session?.user

if(!user)return null

const dbUser=
await prisma.user.findUnique({

where:{
email:user.email!
}

})

if(!dbUser)return null

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
py-4
rounded-xl
"
>

Create Lead

</Link>

</div>

<table className="
w-full
bg-white
border
rounded-3xl
overflow-hidden
">

<thead className="bg-slate-100">

<tr>

<th className="p-5 text-left">

Lead

</th>

<th>Email</th>

<th>Phone</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{

leads.map(lead=>(

<tr
key={lead.id}
className="border-t"
>

<td className="p-5">

{

lead.firstName+

" "+

(
lead.lastName||

""
)

}

</td>

<td>{lead.email}</td>

<td>{lead.phone}</td>

<td>{lead.status}</td>

</tr>

))

}

</tbody>

</table>

</div>

)

}