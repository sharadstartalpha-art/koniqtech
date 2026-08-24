import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized"
        },
        {
          status: 401
        }
      )
    }

    const orgId = session.user.orgId

    const { id } = await params

    const form = await req.formData()

    await prisma.customer.update({

      where: {
        id
      },

      data: {

        orgId,

        firstName:
          String(form.get("firstName") || ""),

        lastName:
          String(form.get("lastName") || ""),

        email:
          String(form.get("email") || "") || null,

        phone:
          String(form.get("phone") || "") || null,

        companyName:
          String(form.get("companyName") || "") || null,

        address:
          String(form.get("address") || "") || null,

        status:
          String(form.get("status") || "active"),

        source:
          String(form.get("source") || "manual")

      }

    })

    return NextResponse.redirect(
      new URL(`/customers/${id}`, req.url)
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Customer update failed"
      },
      {
        status: 500
      }
    )

  }

}

export async function DELETE(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        {
          success: false
        },
        {
          status: 401
        }
      )
    }

    const { id } = await params

    await prisma.customer.delete({

      where: {
        id
      }

    })

    return NextResponse.json({
      success: true
    })

  } catch {

    return NextResponse.json(
      {
        success: false,
        message: "Customer delete failed"
      },
      {
        status: 500
      }
    )

  }

}