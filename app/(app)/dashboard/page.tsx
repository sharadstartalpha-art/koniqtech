import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import Link from "next/link"

import { redirect } from "next/navigation"

export const dynamic="force-dynamic"

export default async function DashboardPage(){

const session=
await auth()

if(!session?.user){

redirect("/login")

}

const role=

(session.user as any)
?.role

if(

role===

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

<h1 className="text-2xl font-semibold">

User not found

</h1>

</div>

)

}

const [

leads,
customers,
jobs

]=await Promise.all([

prisma.lead.count({

where:{

orgId:
dbUser.orgId

}

}),

prisma.customer.count({

where:{

orgId:
dbUser.orgId

}

}),

prisma.job.count({

where:{

orgId:
dbUser.orgId

}

})

])

const subscriptionEnds=

dbUser.organization
?.subscriptionEndsAt

const expiringSoon=

subscriptionEnds

?

new Date(
subscriptionEnds
).getTime()

-

Date.now()

<

1000*
60*
60*
24*
7

:

false

return(

<div className="space-y-8">

<div>

<h1 className="text-6xl font-bold">

Dashboard

</h1>

<p className="text-slate-500 mt-2">

Welcome back

{

dbUser.name

}

</p>

</div>

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

<div className="bg-white rounded-3xl border p-10">

<div className="flex justify-between items-start">

<div>

<h2 className="text-4xl font-bold">

Subscription

</h2>

<div className="mt-8 space-y-3">

<p>

Plan:

<span className="font-semibold ml-2">

{

dbUser.organization
?.plan

||

"Free"

}

</span>

</p>

<p>

Expires:

<span className="font-semibold ml-2">

{

subscriptionEnds

?

subscriptionEnds
.toDateString()

:

"No subscription"

}

</span>

</p>

</div>

{

expiringSoon && (

<div className="
mt-6
inline-flex
px-4
py-2
rounded-xl
bg-yellow-100
text-yellow-700
font-medium
">

Subscription expiring soon

</div>

)

}

</div>

<Link

href="/billing"

className="
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

<div className="bg-white rounded-3xl border p-10">

<h2 className="text-2xl font-bold mb-6">

Recent Activity

</h2>

<div className="space-y-4">

<Activity

text="No recent leads"

/>

<Activity

text="No recent customers"

/>

<Activity

text="No recent jobs"

/>

</div>

</div>

</div>

)

}

function Card({

title,
value

}:{

title:string
value:number

}){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

<p className="text-slate-500">

{title}

</p>

<h2 className="
text-6xl
font-bold
mt-4
">

{value}

</h2>

</div>

)

}

function Activity({

text

}:{

text:string

}){

return(

<div className="
p-4
rounded-2xl
bg-slate-50
">

{text}

</div>

)

}