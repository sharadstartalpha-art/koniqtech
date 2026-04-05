import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  })

  // 🔥 CREATE WALLET
 await prisma.userCredits.upsert({
  where: { userId: user.id },
  update: {},
  create: {
    userId: user.id,
    balance: 20,
  },
});

  return Response.json(user)
}