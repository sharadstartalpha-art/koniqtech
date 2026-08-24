import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest
) {
  try {

    const session =
      await auth()

    if (!session?.user?.orgId) {

      return NextResponse.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      )

    }

    const orgId =
      session.user.orgId

    const body =
      await request.json()

    const {

      customerId,

      jobId,

      invoiceNumber,

      subtotal,

      tax,

      total,

      dueDate,

      status

    } = body

    if (
      !customerId ||
      !jobId ||
      !invoiceNumber
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields."
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
          error:
            "Customer not found."
        },
        {
          status: 404
        }
      )

    }

    const job =
      await prisma.job.findFirst({

        where: {

          id: jobId,

          orgId

        }

      })

    if (!job) {

      return NextResponse.json(
        {
          error:
            "Job not found."
        },
        {
          status: 404
        }
      )

    }

    const exists =
      await prisma.invoice.findUnique({

        where: {

          invoiceNumber

        }

      })

    if (exists) {

      return NextResponse.json(
        {
          error:
            "Invoice number already exists."
        },
        {
          status: 400
        }
      )

    }

    const invoice =
      await prisma.invoice.create({

        data: {

          orgId,

          customerId,

          jobId,

          invoiceNumber,

          subtotal,

          tax,

          total,

          dueDate:
            dueDate
              ? new Date(dueDate)
              : null,

          status

        },

        include: {

          customer: true,

          job: true

        }

      })

    return NextResponse.json(
      invoice
    )

  }

  catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        error:
          "Failed to create invoice."
      },
      {
        status: 500
      }
    )

  }

}