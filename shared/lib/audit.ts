import prisma from "./prisma"

export async function audit(

action:string,
userId:string,
orgId:string

){

await prisma.auditLog.create({

data:{

action,

userId,

orgId

}

})

}