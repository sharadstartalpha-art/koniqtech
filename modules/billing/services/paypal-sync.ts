import prisma

from "@/shared/lib/prisma"

export async function syncPayPal(){

await prisma.subscription.updateMany({

data:{

status:"active"

}

})

}