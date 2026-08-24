import { NextResponse } from "next/server"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

// =====================================================
// GET CUSTOMER NOTES
// =====================================================

export async function GET(
  _req: Request,
  {
    params
  }: RouteContext
) {

  try {

    const session =
      await auth()

    if (
      !session?.user?.id ||
      !session.user.orgId
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized."
        },
        {
          status: 401
        }
      )

    }

    const {
      id: customerId
    } = await params

    const customer =
      await prisma.customer.findFirst({

        where: {
          id: customerId,
          orgId: session.user.orgId
        },

        select: {
          id: true
        }

      })

    if (!customer) {

      return NextResponse.json(
        {
          success: false,
          message: "Customer not found."
        },
        {
          status: 404
        }
      )

    }

    const notes =
      await prisma.customerNote.findMany({

        where: {
          customerId
        },

        orderBy: {
          createdAt: "desc"
        },

        include: {

          author: {

            select: {

              id: true,

              name: true,

              email: true,

              avatar: true

            }

          }

        }

      })

    return NextResponse.json({

      success: true,

      notes

    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load customer notes."
      },
      {
        status: 500
      }
    )

  }

}

// =====================================================
// CREATE CUSTOMER NOTE
// =====================================================

export async function POST(
  req: Request,
  {
    params
  }: RouteContext
) {

  try {

    const session =
      await auth()

    if (
      !session?.user?.id ||
      !session.user.orgId
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized."
        },
        {
          status: 401
        }
      )

    }

    const {
      id: customerId
    } = await params

    const body =
      await req.json()

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : ""

    if (!content) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Note content is required."
        },
        {
          status: 400
        }
      )

    }

    if (
      content.length > 5000
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Maximum 5000 characters allowed."
        },
        {
          status: 400
        }
      )

    }

    const customer =
      await prisma.customer.findFirst({

        where: {

          id: customerId,

          orgId:
            session.user.orgId

        },

        select: {

          id: true

        }

      })

    if (!customer) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Customer not found."
        },
        {
          status: 404
        }
      )

    }

    const note =
      await prisma.$transaction(
        async (tx) => {

          const createdNote =
            await tx.customerNote.create({

              data: {

                customerId,
                orgId: session.user.orgId,
                content,

                createdBy:
                  session.user.id

              },

              include: {

                author: {

                  select: {

                    id: true,

                    name: true,

                    email: true,

                    avatar: true

                  }

                }

              }

            })

          await tx.customerActivity.create({

            data: {

              customerId,

              title:
                "Customer note added",

              description:
                content.slice(0, 150)

            }

          })

          return createdNote

        }
      )

    return NextResponse.json(
      {
        success: true,
        note
      },
      {
        status: 201
      }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create note."
      },
      {
        status: 500
      }
    )

  }

}