import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Page(
{
params
}:{
params:Promise<{id:string}>
}
){

const { id } = await params

const lead = await prisma.lead.findUnique({

where:{
id
}

})

if(!lead){

return(

<div className="p-10">

Lead not found

</div>

)

}

return(

<div className="max-w-3xl mx-auto">

<div className="bg-white p-8 rounded-3xl border">

<h1 className="text-3xl font-bold mb-8">

Edit Lead

</h1>

<form

action={`/api/leads/${lead.id}`}

method="POST"

className="space-y-4"

>

<input
name="firstName"
defaultValue={lead.firstName ?? ""}
placeholder="First Name"
className="w-full border rounded-xl p-4"
/>

<input
name="lastName"
defaultValue={lead.lastName ?? ""}
placeholder="Last Name"
className="w-full border rounded-xl p-4"
/>

<input
name="email"
defaultValue={lead.email ?? ""}
placeholder="Email"
className="w-full border rounded-xl p-4"
/>

<input
name="phone"
defaultValue={lead.phone ?? ""}
placeholder="Phone"
className="w-full border rounded-xl p-4"
/>

<select

name="status"

defaultValue={String(lead.status)}

className="w-full border rounded-xl p-4"

>

<option value="new">

New

</option>

<option value="contacted">

Contacted

</option>

<option value="won">

Won

</option>

<option value="lost">

Lost

</option>

</select>

<button

className="bg-green-600 text-white px-6 py-3 rounded-xl"

>

Save Lead

</button>

</form>

</div>

</div>

)

}