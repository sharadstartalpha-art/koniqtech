"use server"

import prisma from
"@/shared/lib/prisma"

export async function getLeads(){

return prisma.lead.findMany({

orderBy:{
createdAt:"desc"
}

})

}