import prisma from "@/shared/lib/prisma"
import { extend } from "../actions"

export default async function OrgPage({

params

}:any){

const org=

await prisma.organization.findUnique({

where:{

id:params.id

}

})

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

{org?.name}

</h1>

<div className="bg-white p-8 rounded-3xl">

<p>

CRM:

{org?.crmType}

</p>

<p>

Users:

{org?.usersLimit}

</p>

<p>

Expires:

{

org?.subscriptionEndsAt?.toString()

}

</p>

<form

action={extend}

>

<input

hidden

name="id"

value={org?.id}

/>

<select

name="months"

className="border p-4 rounded"

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

</select>

<button>

Grant Access

</button>

</form>

</div>

</div>

)

}