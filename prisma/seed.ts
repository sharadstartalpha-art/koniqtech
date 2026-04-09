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

  // 🏢 Company
  const company = await prisma.company.create({
    data: {
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

  // 📦 Products
  await prisma.product.createMany({
    data: [
      { name: "Lead Finder", slug: "lead-finder", price: 1 },
      { name: "Meeting AI", slug: "meeting-ai", price: 2 },
      { name: "Automation Tool", slug: "automation-tool", price: 3 },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });