import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export async function POST(
  request: NextRequest
) {

  try {

    const session =
      await auth()

    if (!session?.user) {

      return NextResponse.json(
        {
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
          message: "Organization not found."
        },
        {
          status: 400
        }
      )

    }

    const body =
      await request.json()

    const {

      customerId,
      quoteNumber,
      status,
      validUntil,
      subtotal,
      tax,
      total,
      items

    } = body

    if (
      !customerId ||
      !quoteNumber ||
      !Array.isArray(items) ||
      items.length === 0
    ) {

      return NextResponse.json(
        {
          message: "Missing required fields."
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
          orgId
        }

      })

    if (!customer) {

      return NextResponse.json(
        {
          message: "Customer not found."
        },
        {
          status: 404
        }
      )

    }

    const quote =
      await prisma.$transaction(

        async (tx) => {

          const createdQuote =
            await tx.quote.create({

              data: {

                orgId,

                customerId,

                quoteNumber,

                status,

                validUntil:
                  validUntil
                    ? new Date(validUntil)
                    : null,

                subtotal,

                tax,

                total

              }

            })

          await tx.quoteItem.createMany({

            data:

              items.map(

                (item: any) => ({

                  quoteId:
                    createdQuote.id,

                  itemName:
                    item.itemName,

                  qty:
                    Number(item.qty),

                  price:
                    Number(item.price),

                  total:
                    Number(item.qty) *
                    Number(item.price)

                })

              )

          })

          return createdQuote

        }

      )

    return NextResponse.json(
      quote
    )

  }

  catch (error) {

    console.error(error)

    return NextResponse.json(

      {
        message:
          "Failed to create quote."
      },

      {
        status: 500
      }

    )

  }

}