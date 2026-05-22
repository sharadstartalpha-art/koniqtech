import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"

export const dynamic="force-dynamic"

export default async function Page({

searchParams

}:any){

const session=
await getServerSession()

const user=
session?.user as any

if(!user)return null

const q=
searchParams?.q || ""

const page=
Number(
searchParams?.page || 1
)

const limit=10

const skip=
(page-1)*limit

const customers=
await prisma.customer.findMany({

where:{

orgId:user.orgId,

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

},

{

phone:{

contains:q,

mode:"insensitive"

}

}

]

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

orgId:user.orgId

}

})

const pages=
Math.ceil(
total/limit
)

return(

<div className="space-y-8">

<div className="
flex
justify-between
items-center
">

<h1 className="
text-5xl
font-bold
">

Customers

</h1>

<div className="
flex
gap-4
">

<form>

<input

name="q"

defaultValue={q}

placeholder="Search customer"

className="
border
p-4
rounded-xl
w-72
"

/>

</form>

<Link

href="/customers/create"

className="
bg-black
text-white
px-6
py-4
rounded-xl
"

>

Create Customer

</Link>

</div>

</div>

<div className="
bg-white
border
rounded-3xl
overflow-hidden
">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-5 text-left">

Customer

</th>

<th>Email</th>

<th>Phone</th>

<th>Address</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{

customers.map(customer=>(

<tr

key={customer.id}

className="border-t"

>

<td className="p-5">

{

customer.firstName+

" "+

(

customer.lastName||

""

)

}

</td>

<td>

{customer.email}

</td>

<td>

{customer.phone}

</td>

<td>

{customer.address}

</td>

<td>

<div className="
flex
gap-3
">

<Link

href={`/customers/${customer.id}`}

className="text-blue-600"

>

View

</Link>

<Link

href={`/customers/edit/${customer.id}`}

className="text-green-600"

>

Edit

</Link>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

<div className="
flex
gap-3
">

{

Array.from({

length:pages

}).map((_,i)=>(

<Link

key={i}

href={`?page=${i+1}&q=${q}`}

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