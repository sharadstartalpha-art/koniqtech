import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  /* ===============================
     ✅ ADMIN
  =============================== */
  const email = "admin@koniqtech.com";

  const password = await bcrypt.hash(
    "admin123",
    10
  );

  await prisma.user.upsert({
    where: { email },

    update: {},

    create: {
      email,
      password,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ Admin created");

  /* ===============================
     ✅ PRODUCTS
  =============================== */
  const invoiceRecovery =
    await prisma.product.upsert({
      where: {
        slug: "invoice-recovery",
      },

      update: {},

      create: {
        name: "Invoice Recovery",
        slug: "invoice-recovery",
      },
    });

  const agenciesTool =
    await prisma.product.upsert({
      where: {
        slug: "agencies-tool",
      },

      update: {},

      create: {
        name: "Agencies Tool",
        slug: "agencies-tool",
      },
    });

  console.log("✅ Products created");

  /* ===============================
     ✅ FREE PLAN
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "FREE_PLAN_INVOICE_RECOVERY",
    },

    update: {
      name: "Free",
      price: 0,
      invoiceLimit: 5,
      productId: invoiceRecovery.id,
      active: true,
    },

    create: {
      name: "Free",
      price: 0,
      invoiceLimit: 5,
      productId: invoiceRecovery.id,
      paypalPlanId:
        "FREE_PLAN_INVOICE_RECOVERY",
      active: true,
    },
  });

  /* ===============================
     ✅ INVOICE RECOVERY - STARTER
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "P-3B153015G9357222TNHZ3PNA",
    },

    update: {
      name: "Starter",
      price: 19,
      invoiceLimit: 20,
      productId: invoiceRecovery.id,
      active: true,
    },

    create: {
      name: "Starter",
      price: 19,
      invoiceLimit: 20,
      productId: invoiceRecovery.id,
      paypalPlanId:
        "P-3B153015G9357222TNHZ3PNA",
      active: true,
    },
  });

  /* ===============================
     ✅ INVOICE RECOVERY - GROWTH
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "P-9BA40673FF198815YNHZ3L3I",
    },

    update: {
      name: "Growth",
      price: 39,
      invoiceLimit: 100,
      productId: invoiceRecovery.id,
      active: true,
    },

    create: {
      name: "Growth",
      price: 39,
      invoiceLimit: 100,
      productId: invoiceRecovery.id,
      paypalPlanId:
        "P-9BA40673FF198815YNHZ3L3I",
      active: true,
    },
  });

  /* ===============================
     ✅ INVOICE RECOVERY - PRO
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "P-5AE19161H3297671ANHZ3P6I",
    },

    update: {
      name: "Pro",
      price: 79,
      invoiceLimit: -1,
      productId: invoiceRecovery.id,
      active: true,
    },

    create: {
      name: "Pro",
      price: 79,
      invoiceLimit: -1,
      productId: invoiceRecovery.id,
      paypalPlanId:
        "P-5AE19161H3297671ANHZ3P6I",
      active: true,
    },
  });

  console.log(
    "✅ Invoice Recovery plans created"
  );

  /* ===============================
     ✅ AGENCIES TOOL - STARTER
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "PAYPAL_PLAN_AGENCY_STARTER",
    },

    update: {
      name: "Starter",
      price: 29,
      productId: agenciesTool.id,
      active: true,
    },

    create: {
      name: "Starter",
      price: 29,
      productId: agenciesTool.id,
      paypalPlanId:
        "PAYPAL_PLAN_AGENCY_STARTER",
      active: true,
    },
  });

  /* ===============================
     ✅ AGENCIES TOOL - PRO
  =============================== */
  await prisma.plan.upsert({
    where: {
      paypalPlanId:
        "PAYPAL_PLAN_AGENCY_PRO",
    },

    update: {
      name: "Pro",
      price: 99,
      productId: agenciesTool.id,
      active: true,
    },

    create: {
      name: "Pro",
      price: 99,
      productId: agenciesTool.id,
      paypalPlanId:
        "PAYPAL_PLAN_AGENCY_PRO",
      active: true,
    },
  });

  console.log(
    "✅ Agencies Tool plans created"
  );

  /* ===============================
     ✅ REMINDER TEMPLATES
  =============================== */
  const templates = [
    {
      name: "Friendly",
      type: "friendly",
      subject: "Friendly Reminder",
      html: `
        <p>Hi {{name}},</p>

        <p>
          Just a friendly reminder that your invoice is still unpaid.
        </p>

        <p>
          Amount Due:
          <strong>{{amount}}</strong>
        </p>

        <p>
          Please make payment at your earliest convenience.
        </p>

        <p>Thanks!</p>
      `,
    },

    {
      name: "Firm",
      type: "firm",
      subject: "Payment Reminder",
      html: `
        <p>Hi {{name}},</p>

        <p>
          Your invoice is now overdue.
        </p>

        <p>
          Amount Due:
          <strong>{{amount}}</strong>
        </p>

        <p>
          Please arrange payment immediately.
        </p>
      `,
    },

    {
      name: "Final",
      type: "final",
      subject: "Final Notice",
      html: `
        <p>
          Final reminder before further action.
        </p>

        <p>
          Outstanding Amount:
          <strong>{{amount}}</strong>
        </p>

        <p>
          Please settle this invoice immediately.
        </p>
      `,
    },
  ];

  for (const template of templates) {
    const exists =
      await prisma.reminderTemplate.findFirst({
        where: {
          name: template.name,
          type: template.type,
          isDefault: true,
        },
      });

    if (!exists) {
      await prisma.reminderTemplate.create({
        data: {
          userId: "system",
          name: template.name,
          type: template.type as any,
          subject: template.subject,
          html: template.html,
          isDefault: true,
        },
      });
    }
  }

  console.log(
    "✅ Reminder templates created"
  );

  console.log(
    "🎉 Seeding finished successfully"
  );
}

main()
  .catch((e) => {
    console.error(
      "❌ Seeding error:",
      e
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });