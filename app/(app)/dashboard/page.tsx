import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import Link from "next/link"

import { redirect } from "next/navigation"

export const dynamic=
"force-dynamic"

export default async function Page(){

const session=
await auth()

if(!session?.user){

redirect(
"/login"
)

}

if(

(session.user as any)
.role===

"SUPER_ADMIN"

){

redirect(
"/admin/dashboard"
)

}

const dbUser=

await prisma.user.findUnique({

where:{

email:
session.user.email!

},

include:{

organization:true

}

})

if(!dbUser){

return(

<div className="p-10">

User missing

</div>

)

}

const leads=

await prisma.lead.count({

where:{

orgId:
dbUser.orgId

}

})

const customers=

await prisma.customer.count({

where:{

orgId:
dbUser.orgId

}

})

const jobs=

await prisma.job.count({

where:{

orgId:
dbUser.orgId

}

})

return(

<div className="space-y-8">

<h1 className="text-6xl font-bold">

Dashboard

</h1>

<div className="grid grid-cols-3 gap-6">

<Card
title="Leads"
value={leads}
/>

<Card
title="Customers"
value={customers}
/>

<Card
title="Jobs"
value={jobs}
/>

</div>

<div className="bg-white border rounded-3xl p-10">

<h2 className="text-4xl font-bold">

Subscription

</h2>

<div className="mt-8 space-y-3">

<p>

Plan:

<b>

{

dbUser.organization
?.plan ||

"Free"

}

</b>

</p>

<p>

Expires:

<b>

{

dbUser.organization
?.subscriptionEndsAt

?.toDateString()

||

"No subscription"

}

</b>

</p>

</div>

<Link

href="/billing"

className="
inline-block
mt-8
bg-black
text-white
px-8
py-4
rounded-2xl
"

>

Update Subscription

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

<div className="bg-white border rounded-3xl p-8">

<p>

{title}

</p>

<h2 className="text-6xl font-bold mt-4">

{value}

</h2>

</div>

)

}