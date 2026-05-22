import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page({

searchParams

}:any){

const page=
Number(
searchParams?.page||1
)

const limit=10

const skip=
(page-1)*limit

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

const customers=
await prisma.customer.findMany({

where:{
orgId:dbUser.orgId
},

skip,

take:limit,

orderBy:{
createdAt:"desc"
}

})

const total=
await prisma.customer.count({

where:{
orgId:dbUser.orgId
}

})

const pages=
Math.ceil(
total/limit
)

return(

<div className="space-y-8">

<div className="flex justify-between">

<h1 className="text-5xl font-bold">

Customers

</h1>

<Link

href="/customers/create"

className="
bg-black
text-white
px-6
py-3
rounded-xl
"

>

Add Customer

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

Phone

</th>

<th>

Email

</th>

</tr>

</thead>

<tbody>

{

customers.map(c=>(

<tr
key={c.id}
className="border-t"
>

<td className="p-5">

{c.firstName}

</td>

<td>

{c.phone}

</td>

<td>

{c.email}

</td>

</tr>

))

}

</tbody>

</table>

</div>

<div className="flex gap-2">

{

Array.from({

length:pages

}).map((_,i)=>(

<Link

key={i}

href={`?page=${i+1}`}

className="
border
px-4
py-2
rounded
"

>

{i+1}

</Link>

))

}

</div>

</div>

)

}