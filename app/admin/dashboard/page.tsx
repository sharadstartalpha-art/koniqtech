import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import Link from "next/link"

import { redirect } from "next/navigation"

import {

Building2,
Users,
CreditCard,
DollarSign,
ArrowRight

}

from "lucide-react"

export const dynamic="force-dynamic"

export default async function AdminDashboard(){

const session=
await auth()

if(!session?.user){

redirect("/login")

}



const INTERNAL_PLATFORM_ROLES = new Set([
  "super_admin",
  "platform_manager",
  "support",
  "finance",
  "developer",
  "qa",
  "customer_success",
  "marketing",
  "data_entry",
])

const role = String(
  (session.user as any).role ?? ""
)
  .trim()
  .toLowerCase()

if (!INTERNAL_PLATFORM_ROLES.has(role)) {
  redirect("/dashboard")
}

const [

totalOrganizations,

totalUsers,

activeSubs,

organizations,

subscriptions

]=await Promise.all([

prisma.organization.count(),

prisma.user.count(),

prisma.subscription.count({

where:{

status:"active"

}

}),

prisma.organization.findMany({

take:5,

orderBy:{

createdAt:"desc"

}

}),

prisma.subscription.findMany({

take:5,

orderBy:{

renewAt:"desc"

},

include:{

organization:true

}

})

])

const revenue=

activeSubs*199

return(

<div className="space-y-6">

<div>

<h1 className="
text-4xl
font-semibold
tracking-tight
">

Platform Administration 

</h1>

<p className="
text-sm
text-slate-500
mt-1
">

Koniq SaaS Control Center

</p>

</div>

<div className="
grid

md:grid-cols-4

gap-4
">

<MetricCard

title="Organizations"

value={String(
totalOrganizations
)}

href="/admin/organizations"

icon={<Building2 size={16}/>}

/>

<MetricCard

title="Users"

value={String(
totalUsers
)}

href="/admin/users"

icon={<Users size={16}/>}

/>

<MetricCard

title="Active Plans"

value={String(
activeSubs
)}

href="/admin/plans"

icon={<CreditCard size={16}/>}

/>

<MetricCard

title="MRR"

value={`$${revenue}`}

href="/admin/analytics"

icon={<DollarSign size={16}/>}

/>

</div>

<div className="
grid

md:grid-cols-2

gap-4
">

<div className="
bg-white

border

rounded-3xl

p-6
">

<div className="
flex
justify-between
items-center

mb-5
">

<h2 className="
font-semibold
">

Latest Organizations

</h2>

<Link

href="/admin/organizations"

className="
text-sm

text-slate-500

flex
items-center
gap-1
"

>

View

<ArrowRight
size={14}
/>

</Link>

</div>

<div className="
space-y-3
">

{

organizations.length===0

?

<div className="
text-sm
text-slate-400
">

No organizations

</div>

:

organizations.map(

(org:any)=>(

<Link

href={`/admin/organizations/${org.id}`}

key={org.id}

className="
block

p-4

rounded-2xl

bg-slate-50

hover:bg-slate-100
"

>

<div className="
flex
justify-between
items-center
">

<div>

<p className="
font-medium
">

{org.name}

</p>

<p className="
text-xs
text-slate-500
mt-1
">

{org.plan}

</p>

</div>

<div className="
text-xs

px-3
py-1

rounded-full

bg-white

border
">

{org.crmType}

</div>

</div>

</Link>

)

)

}

</div>

</div>

<div className="
bg-white

border

rounded-3xl

p-6
">

<h2 className="
font-semibold

mb-5
">

Subscription Health

</h2>

<div className="
space-y-3
">

{

subscriptions.length===0

?

<div className="
text-sm
text-slate-400
">

No subscriptions

</div>

:

subscriptions.map(

(x:any)=>(

<div

key={x.id}

className="
p-4

rounded-2xl

bg-slate-50
"

>

<div className="
flex
justify-between
items-center
">

<div>

<p className="
font-medium
">

{

x.organization
?.name

}

</p>

<p className="
text-xs
text-slate-500
mt-1
">

{

x.plan

}

</p>

</div>

<div className="
text-xs

font-medium

text-green-700

bg-green-50

px-3
py-1

rounded-full
">

{

x.renewAt

?

new Date(

x.renewAt

).toLocaleDateString()

:

"No expiry"

}

</div>

</div>

</div>

)

)

}

</div>

</div>

</div>

<div className="
bg-white

border

rounded-3xl

p-6
">

<h2 className="
font-semibold

mb-5
">

System Health

</h2>

<div className="
grid

md:grid-cols-4

gap-3
">

<HealthCard
label="API"
/>

<HealthCard
label="Database"
/>

<HealthCard
label="AI Workers"
/>

<HealthCard
label="Queues"
/>

</div>

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

function HealthCard({

label

}:any){

return(

<div className="
bg-slate-50

rounded-2xl

p-5
">

<div className="
flex
justify-between
items-center
">

<p>

{label}

</p>

<div className="
px-3
py-1

rounded-full

text-xs

bg-green-50

text-green-700
">

Healthy

</div>

</div>

</div>

)

}