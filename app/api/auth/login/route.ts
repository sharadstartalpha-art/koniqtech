import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/shared/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(
      password,
      user.passwordHash
    )

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      redirect: "/dashboard",
    })

    response.cookies.set(
      "auth",
      user.id,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    )

    response.cookies.set(
      "tenant",
      user.orgId,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    )

    return response

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}