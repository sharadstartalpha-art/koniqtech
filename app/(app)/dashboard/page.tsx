import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import Link from "next/link"

export const dynamic="force-dynamic"

export default async function Page(){

const session=
await getServerSession()

const user=
session?.user

if(!user)return null

const dbUser=
await prisma.user.findUnique({

where:{
email:user.email!
},

include:{

organization:true

}

})

if(!dbUser)return null

const org=
dbUser.organization

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

const subscriptionActive=

org?.subscriptionEndsAt &&

org.subscriptionEndsAt>

new Date()

return(

<div className="space-y-8">

<div>

<h1 className="
text-5xl
font-bold
">

Dashboard

</h1>

<p className="
text-slate-500
mt-2
">

{org?.name}

</p>

</div>

<div className="
grid
grid-cols-4
gap-6
">

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="
text-slate-500
">

Leads

</p>

<h2 className="
text-5xl
font-bold
mt-4
">

{leads}

</h2>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="
text-slate-500
">

Customers

</p>

<h2 className="
text-5xl
font-bold
mt-4
">

{customers}

</h2>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="
text-slate-500
">

Jobs

</p>

<h2 className="
text-5xl
font-bold
mt-4
">

{jobs}

</h2>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="
text-slate-500
">

Plan

</p>

<h2 className="
text-3xl
font-bold
mt-4
">

{org?.plan}

</h2>

</div>

</div>

<div className="
grid
grid-cols-2
gap-6
">

<div className="
bg-white
border
rounded-3xl
p-8
space-y-6
">

<h2 className="
text-3xl
font-bold
">

Subscription

</h2>

<div>

<p className="
text-slate-500
">

Status

</p>

<p className={

subscriptionActive

?

"text-green-600 font-bold"

:

"text-red-600 font-bold"

}>

{

subscriptionActive

?

"ACTIVE"

:

"EXPIRED"

}

</p>

</div>

<div>

<p className="
text-slate-500
">

Expires

</p>

<p className="
font-bold
">

{

org?.subscriptionEndsAt

?

org.subscriptionEndsAt
.toDateString()

:

"No subscription"

}

</p>

</div>

<div>

<p className="
text-slate-500
">

Users Limit

</p>

<p className="
font-bold
">

{org?.usersLimit}

</p>

</div>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
space-y-6
">

<h2 className="
text-3xl
font-bold
">

Upgrade

</h2>

<p className="
text-slate-500
">

Renew subscription
or upgrade plan

</p>

<Link

href="/settings/subscription"

className="
block
bg-black
text-white
text-center
p-4
rounded-xl
"

>

Manage Subscription

</Link>

<Link

href="/payments"

className="
block
border
text-center
p-4
rounded-xl
"

>

Payment Portal

</Link>

<Link

href="https://buy.stripe.com"

target="_blank"

className="
block
bg-green-600
text-white
text-center
p-4
rounded-xl
"

>

Renew Subscription

</Link>

</div>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<h2 className="
text-3xl
font-bold
mb-6
">

Recent Activity

</h2>

<div className="
space-y-4
">

<div className="
border
p-4
rounded-xl
">

Leads created:
{leads}

</div>

<div className="
border
p-4
rounded-xl
">

Customers:
{customers}

</div>

<div className="
border
p-4
rounded-xl
">

Jobs:
{jobs}

</div>

</div>

</div>

</div>

)

}