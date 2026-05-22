import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page({

  searchParams

}:{
  searchParams:{
    q?:string
    page?:string
  }
}){

  const session = await auth()

  const orgId = (session?.user as any)?.orgId

  if(!orgId){

    return(
      <div className="p-10">
        No organization found
      </div>
    )

  }

  const q =
  searchParams.q || ""

  const page =
  Number(
    searchParams.page || 1
  )

  const limit = 10

  const leads =
  await prisma.lead.findMany({

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

    take:limit,

    skip:
    (page-1)*limit,

    orderBy:{
      createdAt:"desc"
    }

  })

  return(

<div className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h1 className="text-5xl font-bold">

Leads

</h1>

<p className="text-slate-500 mt-2">

Manage lead pipeline

</p>

</div>

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

New Lead

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
flex
justify-between
items-center
">

<form>

<input

name="q"

defaultValue={q}

placeholder="Search leads..."

className="
w-[360px]
h-11
px-4
rounded-xl
border
"

 />

</form>

<div className="
text-sm
text-slate-500
">

Page {page}

</div>

</div>

<div className="overflow-x-auto">

<table className="w-full min-w-[900px]">

<thead className="bg-slate-50">

<tr>

<th className="p-5 text-left">

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

<th>

Actions

</th>

</tr>

</thead>

<tbody>

{

leads.map(

lead=>(

<tr

key={lead.id}

className="
border-t
hover:bg-slate-50
"

>

<td className="p-5">

{

lead.firstName

}

{

lead.lastName

}

</td>

<td>

{lead.email}

</td>

<td>

{lead.phone}

</td>

<td>

<span className="
px-3
py-1
rounded-full
bg-blue-50
text-blue-700
text-sm
">

{lead.status}

</span>

</td>

<td>

<div className="flex gap-3">

<Link

href={

`/leads/edit/${lead.id}`

}

className="
text-blue-600
"

>

Edit

</Link>

<button className="text-red-600">

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
flex
justify-between
">

<Link

href={

`/leads?page=${
page-1
}`

}

className="text-sm"

>

Previous

</Link>

<Link

href={

`/leads?page=${
page+1
}`

}

className="text-sm"

>

Next

</Link>

</div>

</div>

</div>

)

}