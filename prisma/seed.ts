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
EMPLOYEE ROLES
==========================================================
*/

const employeeRoles = {
  superAdmin: await prisma.employeeRole.upsert({
    where: {
      name: "Super Admin",
    },
    update: {
      description: "Full internal platform administration access",
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      canAssign: true,
      canExport: true,
    },
    create: {
      name: "Super Admin",
      description: "Full internal platform administration access",
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canApprove: true,
      canAssign: true,
      canExport: true,
    },
  }),

  platformManager: await prisma.employeeRole.upsert({
    where: {
      name: "Platform Manager",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canAssign: true,
      canExport: true,
    },
    create: {
      name: "Platform Manager",
      description: "Internal operations management and approvals",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canAssign: true,
      canExport: true,
    },
  }),

  marketing: await prisma.employeeRole.upsert({
    where: {
      name: "Marketing Executive",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: true,
    },
    create: {
      name: "Marketing Executive",
      description: "Internal marketing operations",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: true,
    },
  }),

  sales: await prisma.employeeRole.upsert({
    where: {
      name: "Sales Executive",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: true,
    },
    create: {
      name: "Sales Executive",
      description: "Internal sales operations",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: true,
    },
  }),

  accountant: await prisma.employeeRole.upsert({
    where: {
      name: "Accountant",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canAssign: false,
      canExport: true,
    },
    create: {
      name: "Accountant",
      description: "Internal accounting and finance operations",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: true,
      canAssign: false,
      canExport: true,
    },
  }),

  support: await prisma.employeeRole.upsert({
    where: {
      name: "Support Executive",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: true,
      canExport: false,
    },
    create: {
      name: "Support Executive",
      description: "Internal customer support operations",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: true,
      canExport: false,
    },
  }),

  dataEntry: await prisma.employeeRole.upsert({
    where: {
      name: "Data Entry Operator",
    },
    update: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: false,
    },
    create: {
      name: "Data Entry Operator",
      description: "Restricted internal data-entry access",
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canApprove: false,
      canAssign: false,
      canExport: false,
    },
  }),
}

console.log("✓ Employee Roles created")



  /*
  ==========================================================
  USERS
  ==========================================================
  */

 const internalAccounts = [
  {
    name: "Super Admin",
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@koniqtech.com",
    employeeCode: "KT-ADM-001",
    userRole: UserRole.super_admin,
    organizationRoleId: superAdminRole.id,
    employeeRoleId: employeeRoles.superAdmin.id,
    departmentId: management.id,
    teamId: managementTeam?.id,
    designation: "Super Administrator",
  },
  {
    name: "Platform Manager",
    firstName: "Platform",
    lastName: "Manager",
    email: "manager@koniqtech.com",
    employeeCode: "KT-MGT-001",
    userRole: UserRole.platform_manager,
    organizationRoleId: managerRole.id,
    employeeRoleId: employeeRoles.platformManager.id,
    departmentId: management.id,
    teamId: managementTeam?.id,
    designation: "Platform Manager",
  },
  {
    name: "Marketing",
    firstName: "Marketing",
    lastName: "Executive",
    email: "marketing@koniqtech.com",
    employeeCode: "KT-MKT-001",
    userRole: UserRole.marketing,
    organizationRoleId: marketingRole.id,
    employeeRoleId: employeeRoles.marketing.id,
    departmentId: marketing.id,
    teamId: marketingTeam?.id,
    designation: "Marketing Executive",
  },
  {
    name: "Sales",
    firstName: "Sales",
    lastName: "Executive",
    email: "sales@koniqtech.com",
    employeeCode: "KT-SAL-001",
    userRole: UserRole.platform_sales,
    organizationRoleId: salesRole.id,
    employeeRoleId: employeeRoles.sales.id,
    departmentId: sales.id,
    teamId: salesTeam?.id,
    designation: "Sales Executive",
  },
  {
    name: "Accountant",
    firstName: "Finance",
    lastName: "Accountant",
    email: "accounts@koniqtech.com",
    employeeCode: "KT-FIN-001",
    userRole: UserRole.finance,
    organizationRoleId: accountantRole.id,
    employeeRoleId: employeeRoles.accountant.id,
    departmentId: accounts.id,
    teamId: accountsTeam?.id,
    designation: "Accountant",
  },
  {
    name: "Support",
    firstName: "Support",
    lastName: "Executive",
    email: "support@koniqtech.com",
    employeeCode: "KT-SUP-001",
    userRole: UserRole.support,
    organizationRoleId: supportRole.id,
    employeeRoleId: employeeRoles.support.id,
    departmentId: support.id,
    teamId: supportTeam?.id,
    designation: "Support Executive",
  },
  {
    name: "Data Entry",
    firstName: "Data",
    lastName: "Entry",
    email: "dataentry@koniqtech.com",
    employeeCode: "KT-DAT-001",
    userRole: UserRole.data_entry,
    organizationRoleId: dataEntryRole.id,
    employeeRoleId: employeeRoles.dataEntry.id,
    departmentId: management.id,
    teamId: managementTeam?.id,
    designation: "Data Entry Operator",
  },
]

for (const account of internalAccounts) {
  const user = await prisma.user.upsert({
    where: {
      email: account.email,
    },

    update: {
      orgId: organization.id,
      name: account.name,
      passwordHash,
      role: account.userRole,
      organizationRoleId: account.organizationRoleId,
      departmentId: account.departmentId,
      teamId: account.teamId,
      status: "active",
      emailVerified: true,
    },

    create: {
      orgId: organization.id,
      name: account.name,
      email: account.email,
      passwordHash,
      role: account.userRole,
      organizationRoleId: account.organizationRoleId,
      departmentId: account.departmentId,
      teamId: account.teamId,
      status: "active",
      emailVerified: true,
      phoneVerified: false,
    },
  })

  await prisma.employee.upsert({
    where: {
      email: account.email,
    },

    update: {
      userId: user.id,
      employeeCode: account.employeeCode,
      firstName: account.firstName,
      lastName: account.lastName,
      departmentId: account.departmentId,
      roleId: account.employeeRoleId,
      designation: account.designation,
      active: true,
    },

    create: {
      userId: user.id,
      employeeCode: account.employeeCode,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      departmentId: account.departmentId,
      roleId: account.employeeRoleId,
      designation: account.designation,
      joiningDate: new Date(),
      employmentType: "full_time",
      salaryType: "monthly",
      active: true,
    },
  })
}

console.log("✓ Internal Users and Employees created")

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

  /*
==========================================================
ORGANIZATION SETTINGS
==========================================================
*/

await prisma.organizationSettings.upsert({
  where: {
    orgId: organization.id,
  },
  update: {},
  create: {
    orgId: organization.id,

    timezone: "Asia/Kolkata",

    currency: "USD",

    branding: {
      companyName: "KoniqTech",
      logo: "",
      primaryColor: "#2563EB",
      secondaryColor: "#0F172A",
    },

    integrations: {
      paypal: false,
      twilio: false,
      resend: false,
      openai: false,
    },
  },
});

console.log("✓ Organization Settings created");

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