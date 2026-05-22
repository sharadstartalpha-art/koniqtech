import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await getServerSession()

if(!session?.user?.email){

return(

<div className="p-10">

No session found

</div>

)

}

const dbUser=
await prisma.user.findUnique({

where:{
email:session.user.email
},

include:{
organization:true
}

})

if(!dbUser){

return(

<div className="p-10">

User not found

</div>

)

}

const orgId=dbUser.orgId

const leads=
await prisma.lead.count({

where:{
orgId
}

})

const customers=
await prisma.customer.count({

where:{
orgId
}

})

const jobs=
await prisma.job.count({

where:{
orgId
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Dashboard

</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-white border rounded-3xl p-8">

<p>Leads</p>

<h2 className="text-5xl font-bold">

{leads}

</h2>

</div>

<div className="bg-white border rounded-3xl p-8">

<p>Customers</p>

<h2 className="text-5xl font-bold">

{customers}

</h2>

</div>

<div className="bg-white border rounded-3xl p-8">

<p>Jobs</p>

<h2 className="text-5xl font-bold">

{jobs}

</h2>

</div>

</div>

<div className="bg-white border rounded-3xl p-8">

<h2 className="text-2xl font-bold mb-5">

Subscription

</h2>

<p>

Plan:

{dbUser.organization?.plan}

</p>

<p>

Expires:

{

dbUser.organization
?.subscriptionEndsAt

?.toDateString()

||

"No subscription"

}

</p>

<Link

href="/billing"

className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-xl"

>

Upgrade

</Link>

</div>

</div>

)

}