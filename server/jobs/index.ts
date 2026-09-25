import prisma from "@/shared/lib/prisma"

export async function createJob(
  data: any
) {
  const location = await prisma.organizationLocation.findFirst({
    where: {
      orgId: data.orgId,
      active: true
    },
    orderBy: [
      { isDefault: "desc" },
      { createdAt: "asc" }
    ],
    select: {
      id: true
    }
  })

  if (!location) {
    throw new Error(
      "No active location is configured for this organization."
    )
  }

  return prisma.job.create({
    data: {
      orgId: data.orgId,
      locationId: location.id,
      customerId: data.customerId,
      title: data.title,
      status: data.status
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