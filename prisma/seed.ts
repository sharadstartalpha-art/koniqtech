import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());