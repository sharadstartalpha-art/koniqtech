import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { QuoteStatus } from "@prisma/client"
import { redirect } from "next/navigation"
import QuoteForm from "./QuoteForm"

export const dynamic = "force-dynamic"

function generateQuoteNumber() {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0")

  const day = String(
    now.getDate()
  ).padStart(2, "0")

  const random = Math.floor(
    1000 + Math.random() * 9000
  )

  return `QT-${year}${month}${day}-${random}`
}

export default async function CreateQuotePage() {

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customers =
    await prisma.customer.findMany({

      where: {
        orgId
      },

      orderBy: {
        firstName: "asc"
      },

      select: {

        id: true,

        firstName: true,

        lastName: true,

        companyName: true

      }

    })

  const quoteNumber =
    generateQuoteNumber()

  return (

    <div className="max-w-7xl mx-auto space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Create Quote
        </h1>

        <p className="text-slate-500 mt-2">
          Create a professional customer quotation.
        </p>

      </div>

      <QuoteForm

        customers={customers}

        quoteNumber={quoteNumber}

        statuses={Object.values(QuoteStatus)}

      />

    </div>

  )

}