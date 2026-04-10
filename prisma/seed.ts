import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  // 👑 Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@koniqtech.com" },
    update: {},
    create: {
      email: "admin@koniqtech.com",
      password,
      name: "Admin",
      role: "ADMIN",
      balance: {
        create: {
          amount: 9999,
        },
      },
    },
  });

  // 🏢 Company (avoid duplicate)
  const company = await prisma.company.upsert({
    where: { ownerId: admin.id },
    update: {},
    create: {
      name: "KoniqTech",
      ownerId: admin.id,
    },
  });

  // 🔗 Link user → company
  await prisma.user.update({
    where: { id: admin.id },
    data: {
      companyId: company.id,
    },
  });

  // 📦 Products (safe insert)
  await prisma.product.createMany({
    data: [
      { name: "Lead Finder", slug: "lead-finder", price: 1 },
      { name: "Meeting AI", slug: "meeting-ai", price: 2 },
      { name: "Automation Tool", slug: "automation-tool", price: 3 },
    ],
    skipDuplicates: true,
  });

  // 💳 PLANS (🔥 IMPORTANT)
  await prisma.plan.createMany({
    data: [
      {
        name: "Starter",
        price: 10,
        credits: 1000,
        description: "Perfect for beginners",
      },
      {
        name: "Pro",
        price: 29,
        credits: 5000,
        description: "Best for scaling users",
      },
      {
        name: "Enterprise",
        price: 99,
        credits: 20000,
        description: "For heavy usage",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed (admin + products + plans)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });