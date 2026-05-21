import prisma from "@/shared/lib/prisma"

import { cookies } from "next/headers"

export const dynamic="force-dynamic"

export const revalidate=0

export default async function Dashboard(){

const token=

(await cookies())

.get(

"token"

)?.value

const user=

await prisma.user.findUnique({

where:{

email:token

},

include:{

organization:true

}

})

if(!user){

return null

}

return(

<div className="space-y-8">

<div className="bg-white rounded-3xl border p-8">

<p className="text-slate-500">

Subscription

</p>

<h2 className="text-3xl font-bold mt-4">

{

user.organization?.plan

}

</h2>

<p className="mt-3">

$199 / month

</p>

<p>

CRM:

{

user.organization?.crmType

}

</p>

</div>

<div className="grid grid-cols-4 gap-6">

<Card
title="Revenue"
value="$82,400"
/>

<Card
title="Leads"
value="241"
/>

<Card
title="Customers"
value="112"
/>

<Card
title="Jobs"
value="43"
/>

</div>

<div className="grid grid-cols-3 gap-8">

<div className="col-span-2 bg-white rounded-3xl p-8 shadow">

<h2 className="text-xl font-bold">

Revenue Overview

</h2>

<div className="h-96 bg-slate-100 rounded-2xl mt-8 flex items-center justify-center">

Chart Area

</div>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

<h2 className="font-bold">

Recent Activity

</h2>

<div className="space-y-5 mt-6">

<Item text="Lead created"/>

<Item text="Invoice paid"/>

<Item text="Quote approved"/>

<Item text="Dispatch assigned"/>

</div>

</div>

</div>

<div className="grid grid-cols-2 gap-8">

<div className="bg-white p-8 rounded-3xl">

<h2 className="font-bold">

Pipeline

</h2>

<div className="mt-8 space-y-4">

<Stage n="22" label="New"/>

<Stage n="14" label="Quoted"/>

<Stage n="8" label="Won"/>

</div>

</div>

<div className="bg-white p-8 rounded-3xl">

<h2 className="font-bold">

Upcoming Jobs

</h2>

<div className="mt-6 space-y-4">

<Item text="Roof inspection"/>

<Item text="HVAC install"/>

<Item text="Plumbing repair"/>

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

<div className="bg-white p-8 rounded-3xl shadow">

<p className="text-slate-500">

{title}

</p>

<h2 className="text-4xl font-bold mt-3">

{value}

</h2>

</div>

)

}

function Item({

text

}:any){

return(

<div className="p-4 bg-slate-100 rounded-xl">

{text}

</div>

)

}

function Stage({

n,

label

}:any){

return(

<div className="flex justify-between bg-slate-100 p-4 rounded-xl">

<span>{label}</span>

<span>{n}</span>

</div>

)

}