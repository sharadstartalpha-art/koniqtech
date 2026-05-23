import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Page(){

const session=await auth()

if(!session?.user){

redirect("/login")

}

const orgId=(session.user as any)?.orgId

const customers=
await prisma.customer.findMany({

where:{
orgId
},

orderBy:{
firstName:"asc"
}

})

async function createJob(formData:FormData){

"use server"

const session=await auth()

const orgId=(session?.user as any)?.orgId

await prisma.job.create({

data:{

orgId,

customerId:
String(
formData.get(
"customerId"
)
),

title:
String(
formData.get(
"title"
)
),

status:
formData.get(
"status"
) as any

}

})

redirect("/jobs")

}

return(

<div className="max-w-5xl">

<div className="bg-white rounded-3xl border p-10">

<h1 className="text-5xl font-bold mb-10">

Create Job

</h1>

<form
action={createJob}
className="space-y-6"
>

<input

name="title"

placeholder="Job title"

required

className="
w-full
h-14
border
rounded-2xl
px-5
"

/>

<select

name="customerId"

required

className="
w-full
h-14
border
rounded-2xl
px-5
"

>

<option value="">

Select customer

</option>

{

customers.map(c=>(

<option
key={c.id}
value={c.id}
>

{c.firstName} {c.lastName}

</option>

))

}

</select>

<select

name="status"

className="
w-full
h-14
border
rounded-2xl
px-5
"

>

<option value="scheduled">

Scheduled

</option>

<option value="in_progress">

In Progress

</option>

<option value="completed">

Completed

</option>

<option value="cancelled">

Cancelled

</option>

</select>

<button

className="
px-8
h-14
bg-blue-600
text-white
rounded-2xl
"

>

Create Job

</button>

</form>

</div>

</div>

)

}