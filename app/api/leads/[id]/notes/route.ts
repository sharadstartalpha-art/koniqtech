import {
  NextResponse
} from "next/server"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

type RouteContext = {

  params: Promise<{
    id: string
  }>

}


// ============================================================
// GET LEAD NOTES
// ============================================================

export async function GET(
  _req: Request,
  {
    params
  }: RouteContext
) {

  try {

    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const session =
      await auth()


    if (
      !session?.user?.id ||
      !session.user.orgId
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Unauthorized."
        },
        {
          status: 401
        }
      )

    }


    const userId =
      session.user.id


    const orgId =
      session.user.orgId


    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const {
      id: leadId
    } =
      await params


    // --------------------------------------------------------
    // VERIFY USER
    // --------------------------------------------------------

    const user =
      await prisma.user.findFirst({

        where: {

          id:
            userId,

          orgId

        },

        select: {

          id:
            true

        }

      })


    if (!user) {

      return NextResponse.json(
        {
          success: false,

          message:
            "User not found."
        },
        {
          status: 401
        }
      )

    }


    // --------------------------------------------------------
    // VERIFY LEAD OWNERSHIP
    // --------------------------------------------------------

    const lead =
      await prisma.lead.findFirst({

        where: {

          id:
            leadId,

          orgId

        },

        select: {

          id:
            true

        }

      })


    if (!lead) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Lead not found."
        },
        {
          status: 404
        }
      )

    }


    // --------------------------------------------------------
    // LOAD NOTES
    // --------------------------------------------------------

    const notes =
      await prisma.leadNote.findMany({

        where: {

          leadId

        },

        orderBy: {

          createdAt:
            "desc"

        },

        select: {

          id:
            true,

          leadId:
            true,

          content:
            true,

          createdAt:
            true,

          createdBy:
            true,

          author: {

            select: {

              id:
                true,

              name:
                true,

              email:
                true,

              avatar:
                true

            }

          }

        }

      })


    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        notes
      }
    )

  } catch (error) {

    console.error(
      "GET LEAD NOTES ERROR:",
      error
    )


    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load lead notes."
      },
      {
        status: 500
      }
    )

  }

}


// ============================================================
// CREATE LEAD NOTE
// ============================================================

export async function POST(
  req: Request,
  {
    params
  }: RouteContext
) {

  try {

    // --------------------------------------------------------
    // AUTH
    // --------------------------------------------------------

    const session =
      await auth()


    if (
      !session?.user?.id ||
      !session.user.orgId
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Unauthorized."
        },
        {
          status: 401
        }
      )

    }


    const userId =
      session.user.id


    const orgId =
      session.user.orgId


    // --------------------------------------------------------
    // PARAMS
    // --------------------------------------------------------

    const {
      id: leadId
    } =
      await params


    // --------------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------------

    const body =
      await req.json()


    const content =
      typeof body.content ===
      "string"
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
      content.length >
      5000
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Note cannot exceed 5000 characters."
        },
        {
          status: 400
        }
      )

    }


    // --------------------------------------------------------
    // VERIFY USER
    // --------------------------------------------------------

    const user =
      await prisma.user.findFirst({

        where: {

          id:
            userId,

          orgId

        },

        select: {

          id:
            true

        }

      })


    if (!user) {

      return NextResponse.json(
        {
          success: false,

          message:
            "User not found."
        },
        {
          status: 401
        }
      )

    }


    // --------------------------------------------------------
    // VERIFY LEAD OWNERSHIP
    // --------------------------------------------------------

    const lead =
      await prisma.lead.findFirst({

        where: {

          id:
            leadId,

          orgId

        },

        select: {

          id:
            true

        }

      })


    if (!lead) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Lead not found."
        },
        {
          status: 404
        }
      )

    }


    // --------------------------------------------------------
    // CREATE NOTE + ACTIVITY
    // --------------------------------------------------------

    const note =
      await prisma.$transaction(
        async (tx) => {

          const createdNote =
            await tx.leadNote.create({

              data: {

                leadId,

                content,

                createdBy:
                  userId

              },

              select: {

                id:
                  true,

                leadId:
                  true,

                content:
                  true,

                createdAt:
                  true,

                createdBy:
                  true,

                author: {

                  select: {

                    id:
                      true,

                    name:
                      true,

                    email:
                      true,

                    avatar:
                      true

                  }

                }

              }

            })


          await tx.leadActivity.create({

            data: {

              leadId,

              type:
                "note",

              title:
                "A new note was added"

            }

          })


          return createdNote

        }
      )


    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Note added successfully.",

        note
      },
      {
        status: 201
      }
    )

  } catch (error) {

    console.error(
      "CREATE LEAD NOTE ERROR:",
      error
    )


    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to create lead note."
      },
      {
        status: 500
      }
    )

  }

}