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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const { id } = await params

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

    const payment =
      await prisma.payment.findFirst({
        where: {
          id,
          orgId: session.user.orgId,
        },
      })

    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment not found.",
        },
        {
          status: 404,
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

    const updated =
      await prisma.payment.update({
        where: {
          id,
        },
        data: {
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

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to update payment.",
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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const { id } = await params

    const payment =
      await prisma.payment.findFirst({
        where: {
          id,
          orgId: session.user.orgId,
        },
      })

    if (!payment) {
      return NextResponse.json(
        {
          error: "Payment not found.",
        },
        {
          status: 404,
        }
      )
    }

    const invoiceId =
      payment.invoiceId

    await prisma.payment.delete({
      where: {
        id,
      },
    })

    const invoice =
      await prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
      })

    if (invoice) {
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
          id: invoiceId,
        },
        data: {
          status,
          paidAt:
            status === "paid"
              ? new Date()
              : null,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to delete payment.",
      },
      {
        status: 500,
      }
    )
  }
}