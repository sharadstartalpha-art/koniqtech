import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

import prisma from "@/shared/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const otp = await prisma.otpCode.findFirst({
      where: {
        email: body.email,
        code: body.code,
        verified: false,
      },
    })

    if (!otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      )
    }

    // Find the Owner role for this organization
    const ownerRole = await prisma.organizationRole.findFirst({
      where: {
        orgId: body.organizationId,
        name: "Owner",
      },
    })

    if (!ownerRole) {
      return NextResponse.json(
        { error: "Owner role not found." },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
  data: {
  name: body.name,
  email: body.email,
  passwordHash,

  organization: {
    connect: {
      id: body.organizationId,
    },
  },

  organizationRole: {
    connect: {
      id: ownerRole.id,
    },
  },
},
})

    await prisma.otpCode.update({
      where: {
        id: otp.id,
      },
      data: {
        verified: true,
      },
    })

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    )
  }
}