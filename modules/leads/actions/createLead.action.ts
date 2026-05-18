"use server"

import prisma from
"@/shared/lib/prisma"

export async function createLead(

data:any

){

return prisma.lead.create({

data

})

}