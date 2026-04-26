import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const existing = await prisma.user.findUnique({
    where: { email: "admin@koniqtech.com" },
  });

  if (existing) {
    console.log("⚠️ Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      email: "admin@koniqtech.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());