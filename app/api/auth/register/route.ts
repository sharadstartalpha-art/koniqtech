import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/shared/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, password, company } = body

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (exists) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        {
          status: 400,
        }
      )
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    )

    const user = await prisma.user.create({
      data: {
        name,
        email,
        organization: company, // required field
        role: "owner",
        passwordHash,
      },
    })

    return NextResponse.json(user)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Registration failed",
      },
      {
        status: 500,
      }
    )
  }
}