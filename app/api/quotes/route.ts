import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function POST(
  req:Request
){

  const session=
    await auth()

  const orgId=
    (session?.user as any)
    ?.orgId

  const body=
    await req.json()

  const quote=
    await prisma.quote.create({

      data:{

        orgId,

        customerId:
          body.customerId,

        quoteNumber:
          `QT-${Date.now()}`,

        subtotal:
          body.subtotal,

        tax:
          body.tax,

        total:
          body.total

      }

    })

  return NextResponse.json(
    quote
  )

}