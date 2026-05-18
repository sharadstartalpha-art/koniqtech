"use server"

import prisma from
"@/shared/lib/prisma"

export async function getCustomers(){

return prisma.customer.findMany()

}