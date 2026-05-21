import prisma from "@/shared/lib/prisma"
import { extendSubscription } from "./server"

export default async function OrgPage({

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

return <div>Not found</div>

}

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

{org.name}

</h1>

<div className="bg-white rounded-3xl p-8">

<p>

CRM:

{org.crmType}

</p>

<p>

Plan:

{org.plan}

</p>

<p>

Users limit:

{org.usersLimit}

</p>

<p>

Expires:

{

org.subscriptionEndsAt?.toDateString()

}

</p>

<form

action={extendSubscription}

className="mt-8 flex gap-4"

>

<input

hidden

name="id"

value={org.id}

/>

<select

name="months"

className="border p-4 rounded"

>

<option value="1">

1 Month

</option>

<option value="3">

3 Months

</option>

<option value="6">

6 Months

</option>

<option value="12">

12 Months

</option>

</select>

<button className="bg-blue-600 text-white px-8 rounded">

Grant Access

</button>

</form>

</div>

</div>

)

}