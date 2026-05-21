import {
  PrismaClient,
  Industry,
  UserRole,
  SubscriptionStatus
} from "@prisma/client"

import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash(
    "admin123",
    10
  )

  /*
   ORGANIZATION
  */

  const org =
    await prisma.organization.upsert({
      where: {
        slug: "elite-roofing-us"
      },

      update: {},

      create: {
        name: "Elite Roofing Solutions",

        slug: "elite-roofing-us",

        industry:
          Industry.roofing,

        crmType: "roofing",

        plan: "pro",

        email:
          "admin@eliteroofingusa.com",

        phone:
          "+1-469-555-1000",

        address:
          "Dallas Texas USA"
      }
    })

  /*
   SUPER ADMIN
  */

  await prisma.user.upsert({
    where: {
      email:
        "superadmin@koniqtech.com"
    },

    update: {
      passwordHash
    },

    create: {
      name:
        "Koniq Super Admin",

      email:
        "superadmin@koniqtech.com",

      passwordHash,

      role:
        UserRole.super_admin,

      organization: {
        connect: {
          id: org.id
        }
      }
    }
  })

  /*
   OWNER
  */

  await prisma.user.upsert({
    where: {
      email:
        "admin@eliteroofingusa.com"
    },

    update: {
      passwordHash
    },

    create: {
      name:
        "Elite Owner",

      email:
        "admin@eliteroofingusa.com",

      passwordHash,

      role:
        UserRole.owner,

      organization: {
        connect: {
          id: org.id
        }
      }
    }
  })

  /*
   SALES USER
  */

  await prisma.user.upsert({
    where: {
      email:
        "sales@eliteroofingusa.com"
    },

    update: {},

    create: {
      name:
        "Sarah Williams",

      email:
        "sales@eliteroofingusa.com",

      passwordHash,

      role:
        UserRole.sales,

      organization: {
        connect: {
          id: org.id
        }
      }
    }
  })

  /*
   TECHNICIAN
  */

  await prisma.user.upsert({
    where: {
      email:
        "tech@eliteroofingusa.com"
    },

    update: {},

    create: {
      name:
        "David Wilson",

      email:
        "tech@eliteroofingusa.com",

      passwordHash,

      role:
        UserRole.technician,

      organization: {
        connect: {
          id: org.id
        }
      }
    }
  })

  /*
   ORGANIZATION SETTINGS
  */

  await prisma.organizationSettings.upsert({
    where: {
      orgId: org.id
    },

    update: {},

    create: {
      orgId:
        org.id,

      timezone:
        "America/Chicago",

      currency:
        "USD"
    }
  })

  /*
   SUBSCRIPTION
  */

  await prisma.subscription.upsert({
    where: {
      externalId:
        "PAYPAL-SUB-US-10001"
    },

    update: {},

    create: {
      orgId:
        org.id,

      provider:
        "paypal",

      externalId:
        "PAYPAL-SUB-US-10001",

      plan:
        "PRO",

      status:
        SubscriptionStatus.active,

      amount:
        199,

      currency:
        "USD",

      interval:
        "month"
    }
  })

  console.log(
    "SEED OK"
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })

  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })