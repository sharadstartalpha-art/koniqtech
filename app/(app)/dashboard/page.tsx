import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page(){

const session=await auth()

if(!session?.user?.email){

return(

<div className="p-10">

<h1 className="text-2xl">

Please login again

</h1>

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

User missing

</div>

)

}

const leads=
await prisma.lead.count({

where:{
orgId:dbUser.orgId
}

})

const customers=
await prisma.customer.count({

where:{
orgId:dbUser.orgId
}

})

const jobs=
await prisma.job.count({

where:{
orgId:dbUser.orgId
}

})

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Dashboard

</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-white p-8 rounded-3xl border">

<p>Leads</p>

<h2 className="text-5xl font-bold">

{leads}

</h2>

</div>

<div className="bg-white p-8 rounded-3xl border">

<p>Customers</p>

<h2 className="text-5xl font-bold">

{customers}

</h2>

</div>

<div className="bg-white p-8 rounded-3xl border">

<p>Jobs</p>

<h2 className="text-5xl font-bold">

{jobs}

</h2>

</div>

</div>

<div className="bg-white border rounded-3xl p-8">

<h2 className="text-2xl font-bold">

Subscription

</h2>

<p className="mt-4">

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

className="
inline-block
mt-6
bg-black
text-white
px-6
py-3
rounded-xl
"

>

Update Subscription

</Link>

</div>

</div>

)

}