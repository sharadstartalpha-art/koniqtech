import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 🔐 ADMIN
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@koniqtech.com" },
    update: {},
    create: {
      email: "admin@koniqtech.com",
      password,
      role: "ADMIN",
    },
  });

  // 💰 BALANCE
  await prisma.balance.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      amount: 999999,
    },
  });

  // 💳 PLANS
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

  console.log("✅ Seed completed");
  console.log("👑 Admin: admin@koniqtech.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });