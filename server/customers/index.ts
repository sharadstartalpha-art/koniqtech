import prisma from "@/shared/lib/prisma"

export async function createCustomer(
data:any
){

return prisma.customer.create({

data:{

orgId:data.orgId,

firstName:

data.firstName,

lastName:

data.lastName,

email:

data.email,

phone:

data.phone,

address:

data.address

}

})

}