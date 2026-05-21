"use server"

import prisma from "@/shared/lib/prisma"

export async function extend(

formData:FormData

){

const id=

formData.get("id") as string

const months=

Number(

formData.get(

"months"

)

)

const now=

new Date()

now.setMonth(

now.getMonth()+months

)

await prisma.organization.update({

where:{

id

},

data:{

subscriptionEndsAt:

now

}

})

}