import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function OrganizationsPage(){

const orgs=

await prisma.organization.findMany({

include:{

users:true

},

orderBy:{

createdAt:"desc"

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Organizations

</h1>

<div className="grid gap-6">

{

orgs.map(org=>(

<Link

key={org.id}

href={`/admin/organizations/${org.id}`}

className="bg-white p-8 rounded-3xl border"

>

<h2 className="text-2xl font-bold">

{org.name}

</h2>

<p>

CRM:

{org.crmType}

</p>

<p>

Plan:

{org.plan}

</p>

<p>

Users:

{org.users.length}

</p>

</Link>

))

}

</div>

</div>

)

}