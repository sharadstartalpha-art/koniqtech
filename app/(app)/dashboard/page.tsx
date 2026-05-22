import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import Link from "next/link"

import { redirect } from "next/navigation"

import {

Users,
Briefcase,
UserPlus,
ArrowRight

} from "lucide-react"

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

"super_admin"

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

<div>

User not found

</div>

)

}

const [

leads,
customers,
jobs,

recentLeads,

recentCustomers,

recentJobs,

subscription

]=await Promise.all([

prisma.lead.count({

where:{
orgId:dbUser.orgId
}

}),

prisma.customer.count({

where:{
orgId:dbUser.orgId
}

}),

prisma.job.count({

where:{
orgId:dbUser.orgId
}

}),

prisma.lead.findMany({

where:{
orgId:dbUser.orgId
},

take:3,

orderBy:{
createdAt:"desc"
}

}),

prisma.customer.findMany({

where:{
orgId:dbUser.orgId
},

take:3,

orderBy:{
createdAt:"desc"
}

}),

prisma.job.findMany({

where:{
orgId:dbUser.orgId
},

take:3,

orderBy:{
id:"desc"
}

}),

prisma.subscription.findFirst({

where:{
orgId:dbUser.orgId
},

orderBy:{
renewAt:"desc"
}

})

])

const subscriptionEnds=

subscription
?.renewAt

const daysLeft=

subscriptionEnds

?

Math.ceil(

(

new Date(
subscriptionEnds
).getTime()

-

Date.now()

)

/

1000

/

60

/

60

/

24

)

:

null

return(

<div className="space-y-6">

<div>

<h1 className="
text-4xl
font-semibold
tracking-tight
">

Dashboard

</h1>

<p className="
text-sm
text-slate-500
mt-1
">

Welcome back,

{

dbUser.name

||

"User"

}

</p>

</div>

<div className="
grid

md:grid-cols-3

gap-4
">

<MetricCard

title="Leads"

value={leads}

href="/leads"

icon={<UserPlus size={16}/>}

/>

<MetricCard

title="Customers"

value={customers}

href="/customers"

icon={<Users size={16}/>}

/>

<MetricCard

title="Jobs"

value={jobs}

href="/jobs"

icon={<Briefcase size={16}/>}

/>

</div>

<div className="
bg-white

border

rounded-3xl

p-8
">

<div className="
flex
justify-between
items-start
">

<div>

<h2 className="
text-2xl
font-semibold
">

Subscription

</h2>

<div className="
mt-6
space-y-3
text-sm
">

<p>

Plan

<span className="
font-semibold
ml-2
">

{

subscription?.plan

||

"free"

}

</span>

</p>

<p>

Expires

<span className="
font-semibold
ml-2
">

{

subscriptionEnds

?

new Date(

subscriptionEnds

).toLocaleDateString()

:

"No subscription"

}

</span>

</p>

</div>

{

daysLeft && (

<div className="
mt-5

inline-flex

px-3
py-1

rounded-full

bg-green-50

text-green-700

text-sm
font-medium
">

{

daysLeft

}

days remaining

</div>

)

}

</div>

<Link

href="/billing"

className="
h-10

px-5

rounded-xl

border

text-sm

font-medium

flex
items-center
gap-2

hover:bg-slate-50
"

>

Manage

<ArrowRight
size={14}
/>

</Link>

</div>

</div>

<div className="
grid

md:grid-cols-3

gap-4
">

<ActivityCard

title="Recent Leads"

items={

recentLeads.map(

x=>

`${x.firstName} ${x.lastName}`

)

}

/>

<ActivityCard

title="Recent Customers"

items={

recentCustomers.map(

x=>

`${x.firstName} ${x.lastName}`

)

}

/>

<ActivityCard

title="Recent Jobs"

items={

recentJobs.map(

x=>

x.title

)

}

/>

</div>

</div>

)

}

function MetricCard({

title,
value,
href,
icon

}:any){

return(

<Link

href={href}

className="
bg-white

border

rounded-3xl

p-6

hover:border-slate-300

transition
"

>

<div className="
flex
justify-between
items-center
">

<p className="
text-sm
text-slate-500
">

{title}

</p>

{icon}

</div>

<h2 className="
text-5xl

font-semibold

mt-4
">

{value}

</h2>

</Link>

)

}

function ActivityCard({

title,
items

}:any){

return(

<div className="
bg-white

border

rounded-3xl

p-6
">

<h3 className="
font-medium
mb-5
">

{title}

</h3>

<div className="
space-y-2
">

{

items.length===0

?

<div className="
text-sm
text-slate-400
">

No activity

</div>

:

items.map(

(x:any,i:number)=>(

<div

key={i}

className="
text-sm

bg-slate-50

rounded-xl

px-4
py-3
"

>

{x}

</div>

)

)

}

</div>

</div>

)

}