import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import {
  Prisma,
  InvoiceStatus,
} from "@prisma/client"

export async function POST(
  request: NextRequest
) {

  try {

    /* --------------------------------
       AUTHENTICATION
    -------------------------------- */

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

    const orgId =
      session.user.orgId

    /* --------------------------------
       READ REQUEST
    -------------------------------- */

    const contentType =
      request.headers.get(
        "content-type"
      ) ?? ""

    let body: any

    if (
      contentType.includes(
        "application/json"
      )
    ) {

      body =
        await request.json()

    } else {

      const formData =
        await request.formData()

      body =
        Object.fromEntries(
          formData.entries()
        )

    }

    /* --------------------------------
       GET FIELDS
    -------------------------------- */

    const {
      customerId,
      jobId,
      invoiceNumber,
      subtotal,
      tax,
      dueDate,
      status,
    } = body

    /* --------------------------------
       REQUIRED FIELDS
    -------------------------------- */

    if (
      !customerId ||
      !jobId ||
      !invoiceNumber
    ) {

      return NextResponse.json(
        {
          error:
            "Customer, job and invoice number are required.",
        },
        {
          status: 400,
        }
      )

    }

    /* --------------------------------
       STATUS VALIDATION
    -------------------------------- */

    const validStatuses =
      Object.values(
        InvoiceStatus
      )

    if (
      status &&
      !validStatuses.includes(
        status as InvoiceStatus
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid invoice status.",
        },
        {
          status: 400,
        }
      )

    }

    const invoiceStatus =
      status
        ? status as InvoiceStatus
        : InvoiceStatus.draft

    /* --------------------------------
       AMOUNTS
    -------------------------------- */

    const subtotalNumber =
      Number(subtotal ?? 0)

    const taxNumber =
      Number(tax ?? 0)

    if (
      !Number.isFinite(
        subtotalNumber
      ) ||
      !Number.isFinite(
        taxNumber
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Subtotal and tax must be valid numbers.",
        },
        {
          status: 400,
        }
      )

    }

    if (
      subtotalNumber < 0 ||
      taxNumber < 0
    ) {

      return NextResponse.json(
        {
          error:
            "Subtotal and tax cannot be negative.",
        },
        {
          status: 400,
        }
      )

    }

    /* --------------------------------
       AUTOMATIC TOTAL
    -------------------------------- */

    const totalNumber =
      subtotalNumber +
      taxNumber

    /* --------------------------------
       CUSTOMER
    -------------------------------- */

    const customer =
      await prisma.customer.findFirst({

        where: {
          id: customerId,
          orgId,
        },

      })

    if (!customer) {

      return NextResponse.json(
        {
          error:
            "Customer not found.",
        },
        {
          status: 404,
        }
      )

    }

    /* --------------------------------
       JOB
    -------------------------------- */

    const job =
      await prisma.job.findFirst({

        where: {
          id: jobId,
          orgId,
          customerId,
        },

      })

    if (!job) {

      return NextResponse.json(
        {
          error:
            "Job not found for this customer.",
        },
        {
          status: 404,
        }
      )

    }

    /* --------------------------------
       DUPLICATE INVOICE NUMBER
    -------------------------------- */

    const cleanInvoiceNumber =
      invoiceNumber.trim()

    const exists =
      await prisma.invoice.findUnique({

        where: {
          invoiceNumber:
            cleanInvoiceNumber,
        },

      })

    if (exists) {

      return NextResponse.json(
        {
          error:
            "Invoice number already exists.",
        },
        {
          status: 400,
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
            cleanInvoiceNumber,

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
            invoiceStatus,

        },

        include: {

          customer: true,

          job: true,

        },

      })

    /* --------------------------------
       RESPONSE
    -------------------------------- */

    return NextResponse.json(
      {
        id: invoice.id,
        invoiceNumber:
          invoice.invoiceNumber,
        customerId:
          invoice.customerId,
        jobId:
          invoice.jobId,
        subtotal:
          Number(invoice.subtotal),
        tax:
          Number(invoice.tax),
        total:
          Number(invoice.total),
        dueDate:
          invoice.dueDate,
        status:
          invoice.status,
      },
      {
        status: 201,
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
          error?.code || null,
      },
      {
        status: 500,
      }
    )

  }

}