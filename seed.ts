import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@koniqtech.com";
  const password = "admin123"; // ⚠️ change in production

  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("⚠️ Admin already exists");
    return;
  }

  await prisma.user.create({
    data: {
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin", // ✅ if you have role field
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());