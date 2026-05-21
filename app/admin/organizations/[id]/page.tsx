import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page({

params

}:any){

const org=

await prisma.organization.findUnique({

where:{
id:params.id
},

include:{

users:true,

subscriptions:true

}

})

if(!org){

return(
<div>
Organization not found
</div>
)

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

{org.name}

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
title="CRM"
value={org.crmType}
/>

<Card
title="Plan"
value={org.plan}
/>

<Card
title="Users"
value={org.users.length}
/>

<Card
title="Subscriptions"
value={org.subscriptions.length}
/>

</div>

<div className="flex gap-4">

<Link
href={`/admin/organizations/${org.id}/subscription`}
className="bg-blue-600 text-white px-6 py-3 rounded-xl"
>

Subscription

</Link>

<Link
href={`/admin/organizations/${org.id}/users`}
className="bg-black text-white px-6 py-3 rounded-xl"
>

Users

</Link>

<Link
href={`/admin/organizations/${org.id}/billing`}
className="bg-green-600 text-white px-6 py-3 rounded-xl"
>

Billing

</Link>

</div>

</div>

)

}

function Card({

title,
value

}:any){

return(

<div className="bg-white p-8 rounded-3xl border">

<p>

{title}

</p>

<h2 className="text-3xl font-bold mt-4">

{String(value)}

</h2>

</div>

)

}