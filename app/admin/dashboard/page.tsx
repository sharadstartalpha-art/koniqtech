import prisma from "@/shared/lib/prisma"

export default async function AdminDashboard(){

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

return(

<div className="space-y-8">

<div>

<h1 className="text-3xl font-bold">

Super Admin Dashboard

</h1>

<p className="text-slate-500 mt-2">

Koniq SaaS Control Center

</p>

</div>

<div className="grid grid-cols-4 gap-6">

<Card
title="Organizations"
value={String(totalOrganizations)}
/>

<Card
title="Users"
value={String(totalUsers)}
/>

<Card
title="Active Plans"
value={String(activeSubs)}
/>

<Card
title="MRR"
value={`$${revenue}`}
/>

</div>

<div className="grid grid-cols-2 gap-6">

<div className="bg-white rounded-3xl border p-8 h-96">

<h2 className="font-semibold mb-6">

Latest Organizations

</h2>

</div>

<div className="bg-white rounded-3xl border p-8 h-96">

<h2 className="font-semibold mb-6">

System Health

</h2>

<div className="space-y-4">

<Item
label="API"
/>

<Item
label="Database"
/>

<Item
label="AI Workers"
/>

<Item
label="Queues"
/>

</div>

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

value:string

}){

return(

<div className="bg-white border rounded-3xl p-8">

<p className="text-slate-500">

{title}

</p>

<h2 className="text-3xl font-bold mt-4">

{value}

</h2>

</div>

)

}

function Item({

label

}:{

label:string

}){

return(

<div className="flex justify-between p-4 rounded-xl bg-slate-50">

<span>

{label}

</span>

<span className="text-green-600">

Healthy

</span>

</div>

)

}