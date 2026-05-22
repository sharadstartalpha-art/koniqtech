import prisma from "@/shared/lib/prisma"
import Link from "next/link"

export const dynamic="force-dynamic"

async function extendSubscription(
formData:FormData
){

"use server"

const orgId=
String(
formData.get("orgId")
)

const months=
Number(
formData.get("months")
)

const org=
await prisma.organization.findUnique({

where:{
id:orgId
}

})

if(!org)return

const current=

org.subscriptionEndsAt &&
org.subscriptionEndsAt>
new Date()

?org.subscriptionEndsAt

:new Date()

const expires=
new Date(current)

expires.setMonth(

expires.getMonth()+months

)

await prisma.organization.update({

where:{
id:orgId
},

data:{

subscriptionEndsAt:
expires,

active:true

}

})

}

export default async function Page({

params

}:any){

const org=
await prisma.organization.findUnique({

where:{
id:params.id
},

include:{

users:true

}

})

if(!org){

return(

<div className="p-10">

Organization not found

</div>

)

}

return(

<div className="max-w-7xl mx-auto p-10 space-y-8">

<div className="flex justify-between">

<div>

<h1 className="text-5xl font-bold">

{org.name}

</h1>

<p className="text-slate-500 mt-2">

{org.email}

</p>

</div>

<div className="flex gap-4">

<Link

href={`/admin/organizations/${org.id}/users`}

className="border rounded-xl px-6 py-3"

>

Users

</Link>

<Link

href={`/admin/organizations/${org.id}/billing`}

className="border rounded-xl px-6 py-3"

>

Billing

</Link>

</div>

</div>

<div className="grid grid-cols-4 gap-6">

<div className="border rounded-3xl bg-white p-8">

<p className="text-slate-500">

CRM

</p>

<h2 className="text-2xl font-bold mt-2">

{org.crmType}

</h2>

</div>

<div className="border rounded-3xl bg-white p-8">

<p className="text-slate-500">

Plan

</p>

<h2 className="text-2xl font-bold mt-2">

{org.plan}

</h2>

</div>

<div className="border rounded-3xl bg-white p-8">

<p className="text-slate-500">

Users

</p>

<h2 className="text-2xl font-bold mt-2">

{org.users.length}

</h2>

</div>

<div className="border rounded-3xl bg-white p-8">

<p className="text-slate-500">

Expires

</p>

<h2 className="font-bold mt-2">

{

org.subscriptionEndsAt

?.toDateString()

||

"No subscription"

}

</h2>

</div>

</div>

<div className="bg-white border rounded-3xl p-8">

<h2 className="text-3xl font-bold mb-8">

Grant Subscription Access

</h2>

<form

action={extendSubscription}

className="flex gap-4"

>

<input

hidden

name="orgId"

value={org.id}

/>

<select

name="months"

className="border rounded-xl p-4"

>

<option value="1">

1 month

</option>

<option value="3">

3 months

</option>

<option value="6">

6 months

</option>

<option value="12">

12 months

</option>

<option value="24">

24 months

</option>

</select>

<button

className="bg-black text-white rounded-xl px-8"

>

Grant Access

</button>

</form>

</div>

<div className="bg-white border rounded-3xl overflow-hidden">

<div className="p-8 border-b">

<h2 className="text-3xl font-bold">

Organization Users

</h2>

</div>

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="text-left p-5">

Name

</th>

<th>

Email

</th>

<th>

Role

</th>

</tr>

</thead>

<tbody>

{

org.users.map(

(user)=>(

<tr

key={user.id}

className="border-t"

>

<td className="p-5">

{user.name}

</td>

<td>

{user.email}

</td>

<td>

{user.role}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

</div>

)

}