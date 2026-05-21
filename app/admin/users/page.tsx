import prisma from "@/shared/lib/prisma"

export const dynamic="force-dynamic"

export default async function UsersPage({

searchParams

}:any){

const q=

searchParams?.q||

""

const page=

Number(

searchParams?.page||

1

)

const limit=15

const skip=

(page-1)*limit

const users=

await prisma.user.findMany({

where:{

OR:[

{

name:{

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

include:{

organization:true

},

skip,

take:limit

})

const total=

await prisma.user.count()

const pages=

Math.ceil(

total/limit

)

return(

<div className="space-y-8">

<div className="flex justify-between">

<h1 className="text-4xl font-bold">

Users

</h1>

<form>

<input

name="q"

placeholder="Search user"

defaultValue={q}

className="border p-4 rounded-xl w-80"

/>

</form>

</div>

<div className="bg-white rounded-3xl overflow-hidden border">

<table className="w-full">

<thead className="bg-slate-100">

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

<th>

Company

</th>

<th>

CRM

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

<td>

{

user.organization?.name

}

</td>

<td>

{

user.organization?.crmType

}

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

<a

key={i}

href={`?page=${i+1}&q=${q}`}

className="border px-4 py-2 rounded"

>

{i+1}

</a>

))

}

</div>

</div>

)

}