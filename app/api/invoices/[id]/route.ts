import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import {
  Prisma,
  InvoiceStatus,
} from "@prisma/client"

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

    const { id } =
      await params

    /* --------------------------------
       REQUEST BODY
    -------------------------------- */

    const body =
      await request.json()

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
       FIND EXISTING INVOICE
    -------------------------------- */

    const invoice =
      await prisma.invoice.findFirst({

        where: {
          id,
          orgId,
        },

      })

    if (!invoice) {

      return NextResponse.json(
        {
          error:
            "Invoice not found.",
        },
        {
          status: 404,
        }
      )

    }

    /* --------------------------------
       VALIDATE STATUS
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
        : invoice.status

    /* --------------------------------
       CONVERT AMOUNTS
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
       CALCULATE TOTAL AUTOMATICALLY
    -------------------------------- */

    const totalNumber =
      subtotalNumber +
      taxNumber

    /* --------------------------------
       CHECK CUSTOMER
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
       CHECK JOB
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
       CLEAN INVOICE NUMBER
    -------------------------------- */

    const cleanInvoiceNumber =
      invoiceNumber.trim()

    if (!cleanInvoiceNumber) {

      return NextResponse.json(
        {
          error:
            "Invoice number is required.",
        },
        {
          status: 400,
        }
      )

    }

    /* --------------------------------
       CHECK DUPLICATE INVOICE NUMBER
    -------------------------------- */

    const duplicate =
      await prisma.invoice.findFirst({

        where: {

          invoiceNumber:
            cleanInvoiceNumber,

          NOT: {
            id,
          },

        },

      })

    if (duplicate) {

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
       UPDATE INVOICE
    -------------------------------- */

    const updated =
      await prisma.invoice.update({

        where: {
          id,
        },

        data: {

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

          /* IMPORTANT:
             Total is calculated
             on the server.
          */

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

      })

    /* --------------------------------
       RESPONSE
    -------------------------------- */

    return NextResponse.json(
      {
        id: updated.id,

        invoiceNumber:
          updated.invoiceNumber,

        customerId:
          updated.customerId,

        jobId:
          updated.jobId,

        subtotal:
          Number(updated.subtotal),

        tax:
          Number(updated.tax),

        total:
          Number(updated.total),

        dueDate:
          updated.dueDate,

        status:
          updated.status,
      }
    )

  }

  catch (error: any) {

    console.error(
      "UPDATE INVOICE ERROR:",
      error
    )

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to update invoice.",

        code:
          error?.code || null,
      },
      {
        status: 500,
      }
    )

  }

}


/* =====================================================
   DELETE INVOICE
===================================================== */

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

    const session =
      await auth()

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

    const userId =
      session.user.id

    const { id } =
      await params

    /* --------------------------------
       FIND INVOICE
    -------------------------------- */

    const invoice =
      await prisma.invoice.findFirst({

        where: {
          id,
          orgId,
        },

      })

    if (!invoice) {

      return NextResponse.json(
        {
          error:
            "Invoice not found.",
        },
        {
          status: 404,
        }
      )

    }

    /* --------------------------------
       ALREADY ARCHIVED
    -------------------------------- */

    if (invoice.archivedAt) {

      return NextResponse.json(
        {
          error:
            "Invoice is already archived.",
        },
        {
          status: 400,
        }
      )

    }

    /* --------------------------------
       ARCHIVE
    -------------------------------- */

    const archived =
      await prisma.invoice.update({

        where: {
          id,
        },

        data: {

          archivedAt:
            new Date(),

          archivedById:
            userId,

        },

      })

    return NextResponse.json({

      success: true,

      archived: true,

      invoiceId:
        archived.id,

    })

  }

  catch (error: any) {

    console.error(
      "ARCHIVE INVOICE ERROR:",
      error
    )

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to archive invoice.",
      },
      {
        status: 500,
      }
    )

  }

}