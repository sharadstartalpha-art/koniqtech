import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Prisma } from "@prisma/client"

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params

  const quote =
    await prisma.quote.findUnique({
      where: { id }
    })

  if (!quote) {
    return <div>Quote not found</div>
  }

  async function addItem(formData: FormData) {

    "use server"

    const itemName =
      String(formData.get("itemName"))

    const qty =
      Number(formData.get("qty"))

    const price =
      Number(formData.get("price"))

    const itemTotal =
      qty * price

    await prisma.quoteItem.create({

      data: {

        quoteId: id,

        itemName,

        qty,

        price,

        total: itemTotal

      }

    })

    const items =
      await prisma.quoteItem.findMany({

        where: {
          quoteId: id
        }

      })

    const subtotal =
      items.reduce(
        (sum, item) =>
          sum + Number(item.total),
        0
      )

    const tax =
      subtotal * 0.1

    const total =
      subtotal + tax

    await prisma.quote.update({

      where: {
        id
      },

      data: {

        subtotal: new Prisma.Decimal(subtotal),

        tax: new Prisma.Decimal(tax),

        total: new Prisma.Decimal(total)

      }

    })

    redirect(`/quotes/${id}`)
  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">

      <div className="flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Add Quote Item
        </h1>

        <Link
          href={`/quotes/${quote.id}`}
          className="
          border
          px-4
          py-2
          rounded-xl
          hover:bg-slate-50
          "
        >
          ← Back To Quote
        </Link>

      </div>

      <form
        action={addItem}
        className="
        bg-white
        p-8
        rounded-3xl
        border
        space-y-4
        "
      >

        <input
          name="itemName"
          placeholder="Item Name"
          required
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        />

        <input
          name="qty"
          type="number"
          min="1"
          required
          placeholder="Quantity"
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="Price"
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
          px-6
          py-3
          rounded-xl
          "
        >
          Add Item
        </button>

      </form>

    </div>

  )

}