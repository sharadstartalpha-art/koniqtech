import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const orgId = session.user.orgId

    const { id } = await params

    const body = await request.json()

    const {
      customerId,
      quoteNumber,
      status,
      validUntil,
      items,
    } = body

    if (!customerId) {
      return NextResponse.json(
        {
          error: "Customer is required.",
        },
        {
          status: 400,
        }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: "At least one line item is required.",
        },
        {
          status: 400,
        }
      )
    }

    const subtotal = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.qty) * Number(item.price),
      0
    )

    const tax = subtotal * 0.18

    const total = subtotal + tax

    const existing = await prisma.quote.findFirst({
      where: {
        id,
        orgId,
      },
    })

    if (!existing) {
      return NextResponse.json(
        {
          error: "Quote not found.",
        },
        {
          status: 404,
        }
      )
    }

    await prisma.quoteItem.deleteMany({
      where: {
        quoteId: id,
      },
    })

    const quote = await prisma.quote.update({
      where: {
        id,
      },
      data: {
        customerId,
        quoteNumber,
        status,
        validUntil: validUntil
          ? new Date(validUntil)
          : null,
        subtotal,
        tax,
        total,

        items: {
          create: items.map((item: any) => ({
            itemName: item.itemName,
            qty: Number(item.qty),
            price: Number(item.price),
            total:
              Number(item.qty) *
              Number(item.price),
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to update quote.",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const orgId = session.user.orgId

    const { id } = await params

    const quote = await prisma.quote.findFirst({
      where: {
        id,
        orgId,
      },
    })

    if (!quote) {
      return NextResponse.json(
        {
          error: "Quote not found.",
        },
        {
          status: 404,
        }
      )
    }

    await prisma.quote.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to delete quote.",
      },
      {
        status: 500,
      }
    )
  }
}