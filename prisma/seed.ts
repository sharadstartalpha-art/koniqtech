import {
  PrismaClient,
  Prisma,
  CRMType,
  UserRole,
  SubscriptionStatus,
  BillingCycle,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const passwordHash = await bcrypt.hash("admin123", 10);

  /*
  ==========================================================
  ORGANIZATION
  ==========================================================
  */

  const organization = await prisma.organization.upsert({
    where: {
      slug: "koniqtech",
    },
    update: {},
    create: {
      name: "KoniqTech",
      slug: "koniqtech",

      crmType: CRMType.roofing,

      plan: "enterprise",

      email: "admin@koniqtech.com",

      website: "https://koniqtech.com",

      phone: "+91-9999999999",

      city: "Bengaluru",

      state: "Karnataka",

      country: "India",

      timezone: "Asia/Kolkata",

      currency: "USD",

      language: "en",

      active: true,

      usersLimit: 100,
    },
  });

  console.log("✓ Organization created");

  /*
  ==========================================================
  SUBSCRIPTION
  ==========================================================
  */

  await prisma.subscription.upsert({
    where: {
      orgId: organization.id,
    },
    update: {},
    create: {
      orgId: organization.id,

      provider: "development",

      externalId: null,

      customerId: "DEV-CUSTOMER",

      plan: "Enterprise",

      status: SubscriptionStatus.active,

      billingCycle: BillingCycle.monthly,

      amount: new Prisma.Decimal(0),

      currency: "USD",

      interval: "month",

      userLimit: 100,

      storageLimit: 500,

      aiCredits: 100000,
    },
  });

  console.log("✓ Subscription created");

  /*
  ==========================================================
  DEPARTMENTS
  ==========================================================
  */

  const management = await prisma.department.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Management",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Management",
      code: "MGMT",
      color: "#2563EB",
    },
  });

  const sales = await prisma.department.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Sales",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Sales",
      code: "SALES",
      color: "#059669",
    },
  });

  const marketing = await prisma.department.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Marketing",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Marketing",
      code: "MKT",
      color: "#EA580C",
    },
  });

  const accounts = await prisma.department.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Accounts",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Accounts",
      code: "ACC",
      color: "#7C3AED",
    },
  });

  const support = await prisma.department.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Support",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Support",
      code: "SUP",
      color: "#0891B2",
    },
  });

  console.log("✓ Departments created");

  /*
  ==========================================================
  TEAMS
  ==========================================================
  */

  await prisma.team.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Management Team",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      departmentId: management.id,
      name: "Management Team",
      description: "Executive team",
    },
  });

  await prisma.team.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Sales Team",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      departmentId: sales.id,
      name: "Sales Team",
      description: "Sales department",
    },
  });

  await prisma.team.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Marketing Team",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      departmentId: marketing.id,
      name: "Marketing Team",
      description: "Marketing department",
    },
  });

  await prisma.team.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Accounts Team",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      departmentId: accounts.id,
      name: "Accounts Team",
      description: "Accounts department",
    },
  });

  await prisma.team.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Support Team",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      departmentId: support.id,
      name: "Support Team",
      description: "Support department",
    },
  });

  console.log("✓ Teams created");

  // ==========================
  // PART 2 STARTS HERE
  // ==========================

    /*
  ==========================================================
  ORGANIZATION ROLES
  ==========================================================
  */

  const superAdminRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Super Admin",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Super Admin",
      description: "System Super Administrator",
      isSystem: true,
    },
  });

  const managerRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Platform Manager",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Platform Manager",
      description: "Platform Manager",
    },
  });

  const marketingRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Marketing",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Marketing",
      description: "Marketing Department",
    },
  });

  const salesRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Sales",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Sales",
      description: "Sales Department",
    },
  });

  const accountantRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Accountant",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Accountant",
      description: "Finance Department",
    },
  });

  const supportRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Support",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Support",
      description: "Support Team",
    },
  });

  const dataEntryRole = await prisma.organizationRole.upsert({
    where: {
      orgId_name: {
        orgId: organization.id,
        name: "Data Entry",
      },
    },
    update: {},
    create: {
      orgId: organization.id,
      name: "Data Entry",
      description: "Data Entry Operator",
    },
  });

  console.log("✓ Organization Roles created");

  /*
  ==========================================================
  FETCH TEAMS
  ==========================================================
  */

  const managementTeam = await prisma.team.findFirst({
    where: {
      orgId: organization.id,
      name: "Management Team",
    },
  });

  const salesTeam = await prisma.team.findFirst({
    where: {
      orgId: organization.id,
      name: "Sales Team",
    },
  });

  const marketingTeam = await prisma.team.findFirst({
    where: {
      orgId: organization.id,
      name: "Marketing Team",
    },
  });

  const accountsTeam = await prisma.team.findFirst({
    where: {
      orgId: organization.id,
      name: "Accounts Team",
    },
  });

  const supportTeam = await prisma.team.findFirst({
    where: {
      orgId: organization.id,
      name: "Support Team",
    },
  });

  /*
  ==========================================================
  USERS
  ==========================================================
  */

  const users = [
    {
      name: "Super Admin",
      email: "superadmin@koniqtech.com",
      role: UserRole.super_admin,
      orgRole: superAdminRole.id,
      department: management.id,
      team: managementTeam?.id,
    },
    {
      name: "Platform Manager",
      email: "manager@koniqtech.com",
      role: UserRole.manager,
      orgRole: managerRole.id,
      department: management.id,
      team: managementTeam?.id,
    },
    {
      name: "Marketing",
      email: "marketing@koniqtech.com",
      role: UserRole.marketing,
      orgRole: marketingRole.id,
      department: marketing.id,
      team: marketingTeam?.id,
    },
    {
      name: "Sales",
      email: "sales@koniqtech.com",
      role: UserRole.sales,
      orgRole: salesRole.id,
      department: sales.id,
      team: salesTeam?.id,
    },
    {
      name: "Accountant",
      email: "accounts@koniqtech.com",
      role: UserRole.accountant,
      orgRole: accountantRole.id,
      department: accounts.id,
      team: accountsTeam?.id,
    },
    {
      name: "Support",
      email: "support@koniqtech.com",
      role: UserRole.support,
      orgRole: supportRole.id,
      department: support.id,
      team: supportTeam?.id,
    },
    {
      name: "Data Entry",
      email: "dataentry@koniqtech.com",
      role: UserRole.data_entry,
      orgRole: dataEntryRole.id,
      department: management.id,
      team: managementTeam?.id,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        passwordHash,
        role: user.role,
        organizationRoleId: user.orgRole,
        departmentId: user.department,
        teamId: user.team,
      },
      create: {
        orgId: organization.id,
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        status: "active",
        emailVerified: true,
        phoneVerified: true,
        departmentId: user.department,
        teamId: user.team,
        organizationRoleId: user.orgRole,
      },
    });
  }

  console.log("✓ Users created");

  /*
  ==========================================================
  LOGIN DETAILS
  ==========================================================
  */

  console.log("");
  console.log("=======================================");
  console.log("Development Accounts");
  console.log("=======================================");
  console.log("superadmin@koniqtech.com");
  console.log("manager@koniqtech.com");
  console.log("marketing@koniqtech.com");
  console.log("sales@koniqtech.com");
  console.log("accounts@koniqtech.com");
  console.log("support@koniqtech.com");
  console.log("dataentry@koniqtech.com");
  console.log("");
  console.log("Password : admin123");
  console.log("=======================================");

  // Part 3 will contain the closing of main(),
  // disconnect, error handling, and optional seed data.

    /*
  ==========================================================
  OPTIONAL DEFAULT SETTINGS
  ==========================================================
  */

  await prisma.organizationSettings.upsert({
    where: {
      orgId: organization.id,
    },
    update: {},
    create: {
      orgId: organization.id,

      companyName: organization.name,

      companyEmail: organization.email,

      companyPhone: organization.phone,

      timezone: "Asia/Kolkata",

      currency: "USD",

      language: "en",
    },
  }).catch(() => {
    console.log("OrganizationSettings skipped.");
  });

  console.log("✓ Organization Settings");

  /*
  ==========================================================
  SUMMARY
  ==========================================================
  */

  console.log("");
  console.log("==============================================");
  console.log("      KoniqTech Seed Completed Successfully");
  console.log("==============================================");
  console.log("");

  console.table([
    {
      Role: "Super Admin",
      Email: "superadmin@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Platform Manager",
      Email: "manager@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Marketing",
      Email: "marketing@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Sales",
      Email: "sales@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Accountant",
      Email: "accounts@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Support",
      Email: "support@koniqtech.com",
      Password: "admin123",
    },
    {
      Role: "Data Entry",
      Email: "dataentry@koniqtech.com",
      Password: "admin123",
    },
  ]);

  console.log("");
  console.log("Organization :", organization.name);
  console.log("CRM Type     :", organization.crmType);
  console.log("Plan         :", organization.plan);
  console.log("==============================================");
}

main()
  .then(async () => {
    console.log("🌱 Seed finished successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("");
    console.error("❌ Seed failed");
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });