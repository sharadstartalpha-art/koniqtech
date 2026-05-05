import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // ===============================
  // ✅ ADMIN
  // ===============================
  const email = "admin@koniqtech.com";
  const password = await bcrypt.hash("admin123", 10);

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

  // ===============================
  // ✅ PRODUCTS
  // ===============================
  const invoiceRecovery = await prisma.product.upsert({
    where: { slug: "invoice-recovery" },
    update: {},
    create: {
      name: "Invoice Recovery",
      slug: "invoice-recovery",
    },
  });

  const agenciesTool = await prisma.product.upsert({
    where: { slug: "agencies-tool" },
    update: {},
    create: {
      name: "Agencies Tool",
      slug: "agencies-tool",
    },
  });

  console.log("✅ Products created");

  // ===============================
  // ✅ PLANS
  // ===============================

  // 🚀 Invoice Recovery Plans
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 19,
        invoiceLimit: 20,
        productId: invoiceRecovery.id,
        paypalPlanId: "P-3B153015G9357222TNHZ3PNA",
      },
      {
        name: "Growth",
        price: 39,
        invoiceLimit: 100,
        productId: invoiceRecovery.id,
        paypalPlanId: "P-9BA40673FF198815YNHZ3L3I",
      },
      {
        name: "Pro",
        price: 79,
        invoiceLimit: -1,
        productId: invoiceRecovery.id,
        paypalPlanId: "P-5AE19161H3297671ANHZ3P6I",
      },
    ],
    skipDuplicates: true,
  });

  // 🚀 Agencies Tool Plans
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 29,
        productId: agenciesTool.id,
        paypalPlanId: "PAYPAL_PLAN_AGENCY_STARTER",
      },
      {
        name: "Pro",
        price: 99,
        productId: agenciesTool.id,
        paypalPlanId: "PAYPAL_PLAN_AGENCY_PRO",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Plans created");

  // ===============================
  // ✅ REMINDER TEMPLATES
  // ===============================
  await prisma.reminderTemplate.createMany({
    data: [
      {
        userId: "system",
        name: "Friendly",
        type: "friendly",
        subject: "Friendly Reminder",
        html: "<p>Hi {{name}}, gentle reminder...</p>",
        isDefault: true,
      },
      {
        userId: "system",
        name: "Firm",
        type: "firm",
        subject: "Payment Reminder",
        html: "<p>Hi {{name}}, your invoice is overdue...</p>",
        isDefault: true,
      },
      {
        userId: "system",
        name: "Final",
        type: "final",
        subject: "Final Notice",
        html: "<p>Final reminder before action...</p>",
        isDefault: true,
      },
    ],
    skipDuplicates: true, // ✅ important
  });

  console.log("✅ Reminder templates created");

  console.log("🎉 Seeding finished successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });