import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "admin@koniqtech.com",
      password,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created");
}

main();