import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const email = "admin@koniqtech.com";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Check if already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("⚠️ Admin already exists");
    return;
  }

  // ✅ Create admin user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,

      // 🔥 FIXED ENUM VALUE
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", user.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });