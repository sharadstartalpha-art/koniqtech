import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

async function createLead(
formData:FormData
){

"use server"

const session=
await getServerSession()

const user=
session?.user

if(!user)return

const dbUser=
await prisma.user.findUnique({

where:{
email:user.email!
}

})

if(!dbUser)return

await prisma.lead.create({

data:{

orgId:dbUser.orgId,

firstName:
String(
formData.get(
"firstName"
)
),

lastName:
String(
formData.get(
"lastName"
)
),

email:
String(
formData.get(
"email"
)
),

phone:
String(
formData.get(
"phone"
)
),

status:"new",

source:"website"

}

})

redirect("/leads")

}

export default function Page(){

return(

<form
action={createLead}
className="
max-w-3xl
mx-auto
space-y-4
bg-white
border
p-8
rounded-3xl
"
>

<input
name="firstName"
placeholder="First name"
className="
w-full
border
p-4
rounded-xl
"
/>

<input
name="lastName"
placeholder="Last name"
className="
w-full
border
p-4
rounded-xl
"
/>

<input
name="email"
placeholder="Email"
className="
w-full
border
p-4
rounded-xl
"
/>

<input
name="phone"
placeholder="Phone"
className="
w-full
border
p-4
rounded-xl
"
/>

<button
className="
bg-black
text-white
p-4
rounded-xl
"
>

Create Lead

</button>

</form>

)

}