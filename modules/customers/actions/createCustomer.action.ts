"use server"

import prisma from
"@/shared/lib/prisma"

export async function createCustomer(

data:any

){

return prisma.customer.create({

data

})

}