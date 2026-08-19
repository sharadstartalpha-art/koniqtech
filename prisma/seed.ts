import bcrypt from "bcryptjs"
import {
  PrismaClient,
  SubscriptionPlan,
  CRMType,
} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // ==========================================================
  // PLANS
  // ==========================================================

  const plans = [
    {
      code: SubscriptionPlan.starter,
      name: "Starter",
      description:
        "For small teams getting started with KoniqTech CRM.",
      price: 99,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 5,
      storageLimit: 20,
      aiCredits: 1000,
      active: true,
      sortOrder: 1,
    },
    {
      code: SubscriptionPlan.professional,
      name: "Professional",
      description:
        "For growing businesses with automation.",
      price: 199,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 15,
      storageLimit: 100,
      aiCredits: 5000,
      active: true,
      sortOrder: 2,
    },
    {
      code: SubscriptionPlan.enterprise,
      name: "Enterprise",
      description:
        "For large organizations.",
      price: 499,
      currency: "USD",
      billingCycle: "monthly",
      userLimit: 50,
      storageLimit: 500,
      aiCredits: 20000,
      active: true,
      sortOrder: 3,
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: {
        code: plan.code,
      },
      update: {
        ...plan,
      },
      create: plan,
    })
  }

  // ==========================================================
  // KONIQTECH ORGANIZATION
  // ==========================================================

  const organization =
    await prisma.organization.upsert({
      where: {
        slug: "koniqtech",
      },
      update: {},
      create: {
        name: "KoniqTech",
        slug: "koniqtech",
        crmType: CRMType.roofing,
        plan: SubscriptionPlan.enterprise,
        active: true,
      },
    })

  // ==========================================================
  // SUPER ADMIN ROLE
  // ==========================================================

  const superAdminRole =
    await prisma.organizationRole.upsert({
      where: {
        orgId_name: {
          orgId: organization.id,
          name: "super_admin",
        },
      },
      update: {},
      create: {
        orgId: organization.id,
        name: "super_admin",
        description:
          "Platform Super Administrator",
        isSystem: true,
        active: true,
      },
    })

  // ==========================================================
  // SUPER ADMIN USER
  // ==========================================================

  const passwordHash =
    await bcrypt.hash("Admin@123", 10)

  await prisma.user.upsert({
    where: {
      email: "admin@koniqtech.com",
    },
    update: {
      name: "Super Admin",
      passwordHash,
      organizationRoleId: superAdminRole.id,
      status: "active",
    },
    create: {
      orgId: organization.id,
      name: "Super Admin",
      email: "admin@koniqtech.com",
      passwordHash,
      status: "active",
      organizationRoleId: superAdminRole.id,
      emailVerified: true,
    },
  })

  console.log("✅ Database seeded successfully.")
  console.log("--------------------------------")
  console.log("Email    : admin@koniqtech.com")
  console.log("Password : Admin@123")
  console.log("--------------------------------")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })