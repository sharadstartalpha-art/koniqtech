
import bcrypt from "bcryptjs"

import {
  PrismaClient,
  Prisma,
  SubscriptionPlan,
  CRMType,
  PlatformRole,
} from "@prisma/client"

const prisma = new PrismaClient()

/*
|--------------------------------------------------------------------------
| KoniqTech Seed
|--------------------------------------------------------------------------
|
| Clean baseline data for the new CRM structure.
|
| Plans:
|   Starter      = 5 employees / 1 location / no AI
|   Professional = unlimited employees / 1 location / AI
|   Enterprise   = unlimited employees / unlimited locations / AI
|
| This seed does NOT create customer CRM test data.
| It only creates platform-level configuration and the
| initial KoniqTech super-admin account.
|
|--------------------------------------------------------------------------
*/

const UNLIMITED_USERS = 2_147_483_647

async function main() {
  console.log("")
  console.log("==============================================")
  console.log("      KoniqTech Database Seed")
  console.log("==============================================")
  console.log("")

  /*
  |--------------------------------------------------------------------------
  | 1. PLANS
  |--------------------------------------------------------------------------
  */

  console.log("Creating subscription plans...")

  const plans = [
    {
      code: SubscriptionPlan.starter,
      name: "Starter",
      description:
        "For small service businesses getting started with KoniqTech CRM.",

      price: new Prisma.Decimal("99.00"),

      currency: "USD",

      billingCycle: "monthly",

      userLimit: 5,

      maxLocations: 1,

      storageLimit: 20,

      // Starter does not include AI.
      aiCredits: 0,

      active: true,

      sortOrder: 1,
    },

    {
      code: SubscriptionPlan.professional,
      name: "Professional",
      description:
        "For growing service businesses with advanced CRM and AI capabilities.",

      price: new Prisma.Decimal("199.00"),

      currency: "USD",

      billingCycle: "monthly",

      // Unlimited employees.
      userLimit: UNLIMITED_USERS,

      // Professional is limited to one location.
      maxLocations: 1,

      storageLimit: 100,

      aiCredits: 5000,

      active: true,

      sortOrder: 2,
    },

    {
      code: SubscriptionPlan.enterprise,
      name: "Enterprise",
      description:
        "For multi-location service organizations requiring centralized operations and advanced AI.",

      price: new Prisma.Decimal("499.00"),

      currency: "USD",

      billingCycle: "monthly",

      // Unlimited employees.
      userLimit: UNLIMITED_USERS,

      // Enterprise supports multiple locations.
      // We use the PostgreSQL INTEGER maximum to represent unlimited.
      maxLocations: UNLIMITED_USERS,

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
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        billingCycle: plan.billingCycle,
        userLimit: plan.userLimit,
        maxLocations: plan.maxLocations,
        storageLimit: plan.storageLimit,
        aiCredits: plan.aiCredits,
        active: plan.active,
        sortOrder: plan.sortOrder,
      },

      create: plan,
    })
  }

  console.log("✓ Starter")
  console.log("✓ Professional")
  console.log("✓ Enterprise")

  /*
  |--------------------------------------------------------------------------
  | 2. PLATFORM ORGANIZATION
  |--------------------------------------------------------------------------
  |
  | This is the internal KoniqTech organization.
  |
  | We are NOT creating customer CRM organizations here.
  |
  */

  console.log("")
  console.log("Creating KoniqTech platform organization...")

  const platform = await prisma.organization.upsert({
    where: {
      slug: "platform",
    },

    update: {
      name: "KoniqTech Platform",
      crmType: CRMType.roofing,
      plan: SubscriptionPlan.enterprise,
      active: true,
    },

    create: {
      name: "KoniqTech Platform",
      slug: "platform",
      crmType: CRMType.roofing,
      plan: SubscriptionPlan.enterprise,
      active: true,
    },
  })

  console.log("✓ Platform organization")

  /*
  |--------------------------------------------------------------------------
  | 3. PLATFORM SUPER ADMIN
  |--------------------------------------------------------------------------
  */

  console.log("")
  console.log("Creating platform super admin...")

  const passwordHash = await bcrypt.hash(
    "Admin@123",
    10
  )

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

  console.log("✓ Platform super admin")

  /*
  |--------------------------------------------------------------------------
  | 4. SUMMARY
  |--------------------------------------------------------------------------
  */

  console.log("")
  console.log("==============================================")
  console.log("          SEED COMPLETED SUCCESSFULLY")
  console.log("==============================================")
  console.log("")
  console.log("PLANS")
  console.log("----------------------------------------------")
  console.log("Starter      : $99/month")
  console.log("Employees    : 5")
  console.log("Locations    : 1")
  console.log("AI Credits   : 0")
  console.log("")
  console.log("Professional : $199/month")
  console.log("Employees    : Unlimited")
  console.log("Locations    : 1")
  console.log("AI Credits   : 5,000")
  console.log("")
  console.log("Enterprise   : $499/month")
  console.log("Employees    : Unlimited")
  console.log("Locations    : Unlimited")
  console.log("AI Credits   : 20,000")
  console.log("")
  console.log("PLATFORM ADMIN")
  console.log("----------------------------------------------")
  console.log("Email    : super_admin@koniqtech.com")
  console.log("Password : Admin@123")
  console.log("Role     : super_admin")
  console.log("")
  console.log("==============================================")
}

main()
  .catch((error) => {
    console.error("")
    console.error("==============================================")
    console.error("              SEED FAILED")
    console.error("==============================================")
    console.error(error)

    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
