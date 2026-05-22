import prisma from "@/shared/lib/prisma"

export async function createJob(

data:any

){

return prisma.job.create({

data:{

orgId:data.orgId,

customerId:

data.customerId,

title:

data.title,

status:

data.status

}

})

}

export async function getJob(
id:string
){

return prisma.job.findUnique({

where:{
id
}

})

}

export async function updateJob(

id:string,

data:any

){

return prisma.job.update({

where:{
id
},

data

})

}

export async function deleteJob(
id:string
){

return prisma.job.delete({

where:{
id
}

})

}