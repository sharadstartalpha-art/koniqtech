import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const {
      customerId,
      invoiceId,
      amount,
      method,
      reference,
      notes,
      paidAt,
    } = body

    if (
      !customerId ||
      !invoiceId ||
      !amount ||
      !method
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      )
    }

    const invoice =
      await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          customerId,
          orgId: session.user.orgId,
        },
      })

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Invoice not found.",
        },
        {
          status: 404,
        }
      )
    }

    const payment =
      await prisma.payment.create({
        data: {
          orgId: session.user.orgId,

          customerId,

          invoiceId,

          amount,

          method,

          reference:
            reference || null,

          notes:
            notes || null,

          paidAt: paidAt
            ? new Date(paidAt)
            : new Date(),
        },
      })

    const totalPaid =
      await prisma.payment.aggregate({
        where: {
          invoiceId,
        },
        _sum: {
          amount: true,
        },
      })

    const paid =
      Number(
        totalPaid._sum.amount ?? 0
      )

    const invoiceTotal =
      Number(invoice.total)

    let status = "draft"

    if (paid > 0) {
      status = "partial"
    }

    if (paid >= invoiceTotal) {
      status = "paid"
    }

    await prisma.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status,
        paidAt:
          status === "paid"
            ? new Date()
            : null,
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          "Failed to record payment.",
      },
      {
        status: 500,
      }
    )
  }
}