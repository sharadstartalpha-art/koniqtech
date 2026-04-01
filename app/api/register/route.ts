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
  await prisma.userCredits.create({
    data: {
      userId: user.id,
      balance: 20,
    },
  })

  return Response.json(user)
}