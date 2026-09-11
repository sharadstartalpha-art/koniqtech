import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function POST(
  request: NextRequest
) {

  try {

    const session = await auth()

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

    const orgId = session.user.orgId

    const body = await request.json()

    const {
      customerId,
      jobId,
      invoiceNumber,
      subtotal,
      tax,
      dueDate,
      status
    } = body

    /* --------------------------------
       VALIDATION
    -------------------------------- */

    if (
      !customerId ||
      !jobId ||
      !invoiceNumber
    ) {

      return NextResponse.json(
        {
          error:
            "Customer, job and invoice number are required."
        },
        {
          status: 400
        }
      )

    }

    /* --------------------------------
       CONVERT AMOUNTS
    -------------------------------- */

    const subtotalNumber =
      Number(subtotal ?? 0)

    const taxNumber =
      Number(tax ?? 0)

    if (
      !Number.isFinite(subtotalNumber) ||
      !Number.isFinite(taxNumber)
    ) {

      return NextResponse.json(
        {
          error:
            "Subtotal and tax must be valid numbers."
        },
        {
          status: 400
        }
      )

    }

    /* --------------------------------
       CALCULATE TOTAL AUTOMATICALLY
    -------------------------------- */

    const totalNumber =
      subtotalNumber + taxNumber

    /* --------------------------------
       CHECK CUSTOMER
    -------------------------------- */

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

    /* --------------------------------
       CHECK JOB
    -------------------------------- */

    const job =
      await prisma.job.findFirst({

        where: {
          id: jobId,
          orgId,
          customerId
        }

      })

    if (!job) {

      return NextResponse.json(
        {
          error:
            "Job not found for this customer."
        },
        {
          status: 404
        }
      )

    }

    /* --------------------------------
       CHECK DUPLICATE INVOICE NUMBER
    -------------------------------- */

    const exists =
      await prisma.invoice.findUnique({

        where: {
          invoiceNumber:
            invoiceNumber.trim()
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

    /* --------------------------------
       CREATE INVOICE
    -------------------------------- */

    const invoice =
      await prisma.invoice.create({

        data: {

          orgId,

          customerId,

          jobId,

          invoiceNumber:
            invoiceNumber.trim(),

          subtotal:
            new Prisma.Decimal(
              subtotalNumber
            ),

          tax:
            new Prisma.Decimal(
              taxNumber
            ),

          total:
            new Prisma.Decimal(
              totalNumber
            ),

          dueDate:
            dueDate
              ? new Date(
                  `${dueDate}T00:00:00`
                )
              : null,

          status:
            status || "draft"

        },

        include: {

          customer: true,

          job: true

        }

      })

    return NextResponse.json(
      invoice,
      {
        status: 201
      }
    )

  }

  catch (error: any) {

    console.error(
      "CREATE INVOICE ERROR:",
      error
    )

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to create invoice.",

        code:
          error?.code || null

      },
      {
        status: 500
      }
    )

  }

}