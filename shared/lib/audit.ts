import prisma from "./prisma"

export async function audit(

action:string,
orgId:string,
userId?:string

){

await prisma.auditLog.create({

data:{

action,

orgId,

userId

}

})

}