import prisma from "@/shared/lib/prisma"

import { auth } from "@/auth"

import { redirect } from "next/navigation"

export const dynamic="force-dynamic"

export default async function AdminDashboard(){

const session=
await auth()

if(!session?.user){

redirect("/login")

}

const role=

(session.user as any)
?.role

if(

role!==

"super_admin"

){

redirect("/dashboard")

}

const totalOrganizations=

await prisma.organization.count()

const totalUsers=

await prisma.user.count()

const activeSubs=

await prisma.subscription.count({

where:{

status:"active"

}

})

const revenue=

activeSubs*199

const organizations=

await prisma.organization.findMany({

take:5,

orderBy:{

createdAt:"desc"

}

})

return(

<div className="space-y-8">

<div>

<h1 className="text-5xl font-bold">

Super Admin Dashboard

</h1>

<p className="text-slate-500 mt-3">

Koniq SaaS Control Center

</p>

</div>

<div className="grid grid-cols-4 gap-6">

<Card

title="Organizations"

value={
String(
totalOrganizations
)
}

/>

<Card

title="Users"

value={
String(
totalUsers
)
}

/>

<Card

title="Active Plans"

value={
String(
activeSubs
)
}

/>

<Card

title="MRR"

value={`$${revenue}`}

/>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="bg-white border rounded-3xl p-8">

<h2 className="font-bold text-xl mb-6">

Latest Organizations

</h2>

<div className="space-y-4">

{

organizations.map(

(org:any)=>(

<div

key={org.id}

className="
p-4
rounded-xl
bg-slate-50
"

>

<p className="font-semibold">

{org.name}

</p>

<p className="text-sm text-slate-500">

{org.plan}

</p>

</div>

)

)

}

</div>

</div>

<div className="bg-white border rounded-3xl p-8">

<h2 className="font-bold text-xl mb-6">

System Health

</h2>

<div className="space-y-4">

<Item label="API"/>

<Item label="Database"/>

<Item label="AI Workers"/>

<Item label="Queues"/>

</div>

</div>

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

<p className="text-slate-500">

{title}

</p>

<h2 className="text-5xl font-bold mt-4">

{value}

</h2>

</div>

)

}

function Item({

label

}:any){

return(

<div className="bg-slate-50 p-4 rounded-xl flex justify-between">

<span>

{label}

</span>

<span className="text-green-600">

Healthy

</span>

</div>

)

}