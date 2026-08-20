import bcrypt from "bcryptjs"
import {
  PrismaClient,
  SubscriptionPlan,
  CRMType,
  PlatformRole,
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
      description: "For small teams getting started with KoniqTech CRM.",
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
      description: "For growing businesses with automation.",
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
      description: "For large organizations.",
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
      update: plan,
      create: plan,
    })
  }

  // ==========================================================
  // PLATFORM ORGANIZATION
  // ==========================================================

  const platform = await prisma.organization.upsert({
    where: {
      slug: "platform",
    },
    update: {},
    create: {
      name: "KoniqTech Platform",
      slug: "platform",
      crmType: CRMType.roofing,
      plan: SubscriptionPlan.enterprise,
      active: true,
    },
  })

  // ==========================================================
  // PLATFORM SUPER ADMIN
  // ==========================================================

  const passwordHash = await bcrypt.hash("Admin@123", 10)

  await prisma.user.upsert({
    where: {
      email: "super_admin@koniqtech.com",
    },
    update: {
      name: "Platform Super Admin",
      passwordHash,
      role: PlatformRole.super_admin,
      orgId: platform.id,
      organizationRoleId: null,
      status: "active",
      emailVerified: true,
    },
    create: {
      name: "Platform Super Admin",
      email: "super_admin@koniqtech.com",
      passwordHash,
      role: PlatformRole.super_admin,
      orgId: platform.id,
      organizationRoleId: null,
      status: "active",
      emailVerified: true,
    },
  })

  console.log("====================================")
  console.log("KoniqTech Platform Seeded")
  console.log("------------------------------------")
  console.log("Email    : super_admin@koniqtech.com")
  console.log("Password : Admin@123")
  console.log("Role     : super_admin")
  console.log("Organization : KoniqTech Platform")
  console.log("====================================")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })