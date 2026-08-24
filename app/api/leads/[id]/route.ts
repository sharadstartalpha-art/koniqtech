import { auth } from "@/auth"
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
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  try {

    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const orgId = (session.user as any).orgId

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found",
        },
        {
          status: 401,
        }
      )
    }

    const { id } = await params

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        orgId,
      },
    })

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found",
        },
        {
          status: 404,
        }
      )
    }

    const customer = await prisma.customer.findFirst({
      where: {
        leadId: id,
        orgId,
      },
      select: {
        id: true,
      },
    })

    if (customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Converted customer cannot be deleted.",
        },
        {
          status: 400,
        }
      )
    }

    await prisma.$transaction(async (tx) => {

      await tx.leadActivity.deleteMany({
        where: {
          leadId: id,
        },
      })

      await tx.leadNote.deleteMany({
        where: {
          leadId: id,
        },
      })

      await tx.lead.delete({
        where: {
          id,
        },
      })

    })

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully.",
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Lead delete failed",
      },
      {
        status: 500,
      }
    )

  }
}