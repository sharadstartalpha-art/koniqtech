import prisma from "@/shared/lib/prisma"

export async function createCustomer(
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

  return prisma.customer.create({
    data: {
      orgId: data.orgId,

      locationId: location.id,

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