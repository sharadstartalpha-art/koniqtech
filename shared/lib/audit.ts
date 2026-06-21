import prisma from "./prisma"

export async function audit(
  action: string,
  entity: string,
  userId: string,
  orgId: string,
  entityId?: string
) {

  await prisma.auditLog.create({

    data: {

      action,
      entity,
      entityId,

      userId,
      orgId

    }

  })

}