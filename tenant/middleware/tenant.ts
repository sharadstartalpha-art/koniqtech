import prisma from
"@/shared/lib/prisma"

export async function getTenant(

orgId:string

){

return prisma.organization
.findUnique({

where:{
id:orgId
}

})

}