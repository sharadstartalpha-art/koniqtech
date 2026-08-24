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
      jobId,
      invoiceNumber,
      subtotal,
      tax,
      total,
      dueDate,
      status,
    } = body

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        orgId: session.user.orgId,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Invoice not found",
        },
        {
          status: 404,
        }
      )
    }

    const duplicate = await prisma.invoice.findFirst({
      where: {
        invoiceNumber,
        orgId: session.user.orgId,
        NOT: {
          id,
        },
      },
    })

    if (duplicate) {
      return NextResponse.json(
        {
          error: "Invoice number already exists",
        },
        {
          status: 400,
        }
      )
    }

    const updated = await prisma.invoice.update({
      where: {
        id,
      },
      data: {
        customerId,
        jobId,
        invoiceNumber,
        subtotal,
        tax,
        total,
        dueDate: dueDate
          ? new Date(dueDate)
          : null,
        status,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Failed to update invoice",
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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        orgId: session.user.orgId,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        {
          error: "Invoice not found",
        },
        {
          status: 404,
        }
      )
    }

    await prisma.invoice.delete({
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
        error: "Failed to delete invoice",
      },
      {
        status: 500,
      }
    )
  }
}