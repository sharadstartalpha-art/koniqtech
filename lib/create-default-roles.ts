import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createDefaultRoles(orgId: string) {
  const roles = [
    {
      name: "Owner",
      description: "Organization owner",
    },
    {
      name: "Admin",
      description: "Administrator",
    },
    {
      name: "Manager",
      description: "Manager",
    },
    {
      name: "Sales",
      description: "Sales Representative",
    },
    {
      name: "Technician",
      description: "Technician",
    },
  ];

  for (const role of roles) {
    await prisma.organizationRole.create({
      data: {
        orgId,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });
  }
}