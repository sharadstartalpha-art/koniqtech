import prisma from "@/shared/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

async function createCustomer(
formData:FormData
){

"use server"

const session=
await getServerSession()

const user=
session?.user as any

if(!user)return

await prisma.customer.create({

data:{

orgId:user.orgId,

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

address:
String(
formData.get(
"address"
)
)

}

})

redirect(
"/customers"
)

}

export default function Page(){

return(

<form

action={createCustomer}

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

<h1 className="
text-4xl
font-bold
">

Create Customer

</h1>

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

<textarea
name="address"
placeholder="Address"
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
px-8
py-4
rounded-xl
"
>

Create

</button>

</form>

)

}