import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
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

    const { id } =
      await params

    /* --------------------------------
       FIND ARCHIVED INVOICE
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
       CHECK ARCHIVED
    -------------------------------- */

    if (!invoice.archivedAt) {

      return NextResponse.json(
        {
          error:
            "Invoice is not archived.",
        },
        {
          status: 400,
        }
      )

    }

    /* --------------------------------
       RESTORE
    -------------------------------- */

    const restored =
      await prisma.invoice.update({

        where: {
          id,
        },

        data: {

          archivedAt: null,

          archivedById: null,

        },

      })

    return NextResponse.json({

      success: true,

      restored: true,

      invoiceId:
        restored.id,

    })

  }

  catch (error: any) {

    console.error(
      "RESTORE INVOICE ERROR:",
      error
    )

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to restore invoice.",
      },
      {
        status: 500,
      }
    )

  }

}