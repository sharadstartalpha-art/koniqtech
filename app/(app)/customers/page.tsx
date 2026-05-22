import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page({

searchParams

}:any){

const session=
await auth()

const orgId=

(session?.user as any)
?.orgId

if(!orgId){

return(

<div>

No organization

</div>

)

}

const q=

searchParams.q || ""

const customers=

await prisma.customer.findMany({

where:{

orgId,

OR:[

{

firstName:{

contains:q,

mode:"insensitive"

}

},

{

email:{

contains:q,

mode:"insensitive"

}

}

]

},

orderBy:{

createdAt:"desc"

}

})

return(

<div className="space-y-8">

<div className="
flex
justify-between
items-center
">

<div>

<h1 className="text-5xl font-bold">

Customers

</h1>

<p className="
text-slate-500
mt-2
">

Customer management

</p>

</div>

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

<div className="
p-5
border-b
">

<form>

<input

name="q"

defaultValue={q}

placeholder="Search customers"

className="
w-[360px]
h-11
border
rounded-xl
px-4
"

/>

</form>

</div>

<div className="overflow-x-auto">

<table className="
w-full
min-w-[900px]
">

<thead className="
bg-slate-50
">

<tr>

<th className="
p-5
text-left
">

Name

</th>

<th>

Email

</th>

<th>

Phone

</th>

<th>

Actions

</th>

</tr>

</thead>

<tbody>

{

customers.map(

customer=>(

<tr

key={customer.id}

className="
border-t
hover:bg-slate-50
"

>

<td className="p-5">

{

customer.firstName

}

{

customer.lastName

}

</td>

<td>

{customer.email}

</td>

<td>

{customer.phone}

</td>

<td>

<div className="flex gap-4">

<Link

href={`

/customers/edit/${customer.id}

`}

className="
text-blue-600
"

>

Edit

</Link>

<button className="
text-red-600
">

Delete

</button>

</div>

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

<div className="
border-t
p-5
text-sm
text-slate-500
">

{customers.length}

customers

</div>

</div>

</div>

)

}