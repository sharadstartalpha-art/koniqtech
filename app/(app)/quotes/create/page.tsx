import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

async function createQuote(formData: FormData) {

  "use server"

  const session = await auth()

  const orgId =
    (session?.user as any)?.orgId

  const customerId =
    String(formData.get("customerId"))

  const title =
    String(formData.get("title"))

  const description =
    String(formData.get("description"))

  if (!orgId || !customerId)
    return

  const quote =
    await prisma.quote.create({

      data: {

        orgId,

        customerId,

        quoteNumber:
          `QT-${Date.now()}`,

        subtotal: 0,

        tax: 0,

        total: 0

      }

    })

  redirect(`/quotes/${quote.id}`)
}

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    customerId?: string
  }>
}) {

  const params =
    await searchParams

  const customerId =
    params.customerId

  if (!customerId)
    return <div>No customer selected</div>

  const customer =
    await prisma.customer.findUnique({

      where:{
        id: customerId
      }

    })

  if (!customer)
    return <div>Customer not found</div>

  return (

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Create Quote
      </h1>

      <form
        action={createQuote}
        className="
        bg-white
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <input
          type="hidden"
          name="customerId"
          value={customer.id}
        />

        <div>

          <label className="text-sm text-slate-500">

            Customer

          </label>

          <div
            className="
            mt-2
            border
            rounded-xl
            p-4
            bg-slate-50
            "
          >

            <div className="font-semibold">

              {customer.firstName}
              {" "}
              {customer.lastName}

            </div>

            <div className="text-sm text-slate-500">

              {customer.email}

            </div>

            <div className="text-sm text-slate-500">

              {customer.phone}

            </div>

          </div>

        </div>

        <input
          name="title"
          placeholder="Quote Title"
          required
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        />

        <textarea
          name="description"
          placeholder="Scope of work"
          rows={6}
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        />

        <button
          type="submit"
          className="
          bg-blue-600
          text-white
          px-8
          py-4
          rounded-xl
          "
        >

          Create Quote

        </button>

      </form>

    </div>

  )
}