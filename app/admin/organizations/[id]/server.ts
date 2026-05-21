"use server"

import prisma from "@/shared/lib/prisma"

export async function extendSubscription(

formData:FormData

){

const id=

formData.get(

"id"

) as string

const months=

Number(

formData.get(

"months"

)

)

const expires=

new Date()

expires.setMonth(

expires.getMonth()+months

)

await prisma.organization.update({

where:{

id

},

data:{

subscriptionEndsAt:

expires

}

})

}