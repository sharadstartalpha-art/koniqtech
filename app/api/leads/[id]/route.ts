import prisma from "@/shared/lib/prisma"
import { LeadStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  try {
    const { id } = await params

    const form = await req.formData()

    await prisma.lead.update({
      where: {
        id,
      },

      data: {
        firstName: String(
          form.get("firstName") || ""
        ),

        lastName: String(
          form.get("lastName") || ""
        ),

        email:
          String(
            form.get("email") || ""
          ) || null,

        phone:
          String(
            form.get("phone") || ""
          ) || null,

        status: (
          String(
            form.get("status") || "new"
          )
        ) as LeadStatus,
      },
    })

    return NextResponse.redirect(
      new URL(
        "/leads",
        req.url
      )
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message: "Lead update failed",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  try {
    const { id } = await params

    const body = await req.json()

    const lead =
      await prisma.lead.update({
        where: {
          id,
        },

        data: {
          firstName:
            body.firstName ||
            body.name ||
            "Lead",

          lastName:
            body.lastName || "",

          email:
            body.email || null,

          phone:
            body.phone || null,

          status: (
            body.status || "new"
          ) as LeadStatus,

          source:
            body.source ||
            "website",

          notes:
            body.notes || null,
        },
      })

    return NextResponse.json(
      lead
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Lead update failed",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  try {
    const { id } = await params

    await prisma.lead.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Lead delete failed",
      },
      {
        status: 500,
      }
    )
  }
}