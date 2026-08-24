import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {

    const session =
      await auth()

    if (!session?.user) {
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

    const orgId =
      session.user.orgId

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization not found"
        },
        {
          status: 401
        }
      )
    }

    const { id } =
      await params

    const form =
      await req.formData()

    await prisma.opportunity.update({

      where: {
        id,
        orgId
      },

      data: {

        title:
          String(
            form.get("title") || ""
          ),

        stage:
          String(
            form.get("stage") || "new"
          ),

        value:
          form.get("value")
            ? Number(
                form.get("value")
              )
            : null,

        expectedCloseDate:
          form.get("expectedCloseDate")
            ? new Date(
                String(
                  form.get(
                    "expectedCloseDate"
                  )
                )
              )
            : null,

        description:
          String(
            form.get(
              "description"
            ) || ""
          ) || null

      }

    })

    return NextResponse.redirect(
      new URL(
        "/pipeline",
        req.url
      )
    )

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        success: false,
        message:
          "Opportunity update failed"
      },
      {
        status: 500
      }
    )

  }
}

export async function PUT(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {

    const session =
      await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false
        },
        {
          status: 401
        }
      )
    }

    const orgId =
      session.user.orgId

    const { id } =
      await params

    const body =
      await req.json()

    const opportunity =
      await prisma.opportunity.update({

        where: {
          id,
          orgId
        },

        data: {

          title:
            body.title,

          stage:
            body.stage,

          value:
            body.value,

          expectedCloseDate:
            body.expectedCloseDate
              ? new Date(
                  body.expectedCloseDate
                )
              : null,

          description:
            body.description

        }

      })

    return NextResponse.json(
      opportunity
    )

  } catch {

    return NextResponse.json(
      {
        success: false,
        message:
          "Opportunity update failed"
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
    params: Promise<{
      id: string
    }>
  }
) {
  try {

    const session =
      await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false
        },
        {
          status: 401
        }
      )
    }

    const orgId =
      session.user.orgId

    const { id } =
      await params

    await prisma.opportunity.delete({

      where: {
        id,
        orgId
      }

    })

    return NextResponse.json({
      success: true
    })

  } catch {

    return NextResponse.json(
      {
        success: false,
        message:
          "Opportunity delete failed"
      },
      {
        status: 500
      }
    )

  }
}