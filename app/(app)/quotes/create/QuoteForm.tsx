"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Customer = {
  id: string
  firstName: string
  lastName: string | null
  companyName: string | null
}

type QuoteItem = {
  itemName: string
  qty: number
  price: number
}

type Props = {
  customers: Customer[]
  quoteNumber: string
  statuses: string[]
}

export default function QuoteForm({
  customers,
  quoteNumber,
  statuses
}: Props) {

  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [customerId, setCustomerId] =
    useState("")

  const [status, setStatus] =
    useState("draft")

  const [validUntil, setValidUntil] =
    useState("")

  const [taxPercent, setTaxPercent] =
    useState(0)

  const [items, setItems] =
  useState<QuoteItem[]>([
    {
      itemName: "",
      qty: 1,
      price: 0
    }
  ])

  function addItem() {

    setItems(prev => [

      ...prev,

      {
        itemName: "",
        qty: 1,
        price: 0
      }

    ])

  }

  function removeItem(index: number) {

    setItems(prev => {

      if (prev.length === 1) {
        return prev
      }

      return prev.filter(
        (_, i) => i !== index
      )

    })

  }

  function updateItem(
    index: number,
    field: keyof QuoteItem,
    value: string | number
  ) {

    setItems(prev => {

      const copy = [...prev]

      copy[index] = {

        ...copy[index],

        [field]:
          field === "itemName"
            ? String(value)
            : Number(value)

      }

      return copy

    })

  }

  const subtotal = useMemo(() => {

  return items.reduce(

    (sum: number, item: QuoteItem) =>

      sum + item.qty * item.price,

    0

  )

}, [items])

  const tax = useMemo(() => {

    return subtotal *

      (taxPercent / 100)

  }, [subtotal, taxPercent])

  const total = useMemo(() => {

    return subtotal + tax

  }, [subtotal, tax])

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault()

    if (!customerId) {

      alert(
        "Please select a customer."
      )

      return

    }

    if (

     items.some((item: QuoteItem) =>

        !item.itemName ||

        item.qty <= 0 ||

        item.price < 0

      )

    ) {

      alert(
        "Please complete all quote items."
      )

      return

    }

    setLoading(true)
        try {

      const response =
        await fetch(
          "/api/quotes",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              customerId,

              quoteNumber,

              status,

              validUntil,

              subtotal,

              tax,

              total,

              items

            })

          }
        )

      if (!response.ok) {

        const error =
          await response.json()

        throw new Error(
          error.message ??
          "Failed to create quote."
        )

      }

      const quote =
        await response.json()

      router.push(
        `/quotes/${quote.id}`
      )

      router.refresh()

    }

    catch (error) {

      console.error(error)

      alert(
        "Unable to create quote."
      )

    }

    finally {

      setLoading(false)

    }

  }

  return (

    <form

      onSubmit={handleSubmit}

      className="space-y-8"

    >

      <div className="bg-white border rounded-3xl p-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">

              Customer

            </label>

            <select

              value={customerId}

              onChange={e =>

                setCustomerId(

                  e.target.value

                )

              }

              className="

              w-full

              border

              rounded-xl

              p-4

              "

              required

            >

              <option value="">

                Select Customer

              </option>

              {customers.map(customer => (

                <option

                  key={customer.id}

                  value={customer.id}

                >

                  {

                    customer.companyName ||

                    `${customer.firstName} ${customer.lastName ?? ""}`

                  }

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Quote Number

            </label>

            <input

              value={quoteNumber}

              readOnly

              className="

              w-full

              border

              rounded-xl

              p-4

              bg-slate-100

              "

            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Status

            </label>

            <select

              value={status}

              onChange={e =>

                setStatus(

                  e.target.value

                )

              }

              className="

              w-full

              border

              rounded-xl

              p-4

              "

            >

              {statuses.map(status => (

                <option

                  key={status}

                  value={status}

                >

                  {status}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Valid Until

            </label>

            <input

              type="date"

              value={validUntil}

              onChange={e =>

                setValidUntil(

                  e.target.value

                )

              }

              className="

              w-full

              border

              rounded-xl

              p-4

              "

            />

          </div>

        </div>

      </div>
            <div className="bg-white border rounded-3xl p-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">

            Quote Items

          </h2>

          <button

            type="button"

            onClick={addItem}

            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            "

          >

            + Add Item

          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left p-4">

                  Item

                </th>

                <th className="text-left p-4 w-32">

                  Qty

                </th>

                <th className="text-left p-4 w-40">

                  Unit Price

                </th>

                <th className="text-left p-4 w-40">

                  Total

                </th>

                <th className="w-24"></th>

              </tr>

            </thead>

            <tbody>

              {items.map((item: QuoteItem, index: number) => {

                const lineTotal =

                  item.qty *

                  item.price

                return(

                  <tr

                    key={index}

                    className="border-t"

                  >

                    <td className="p-4">

                      <input

                        value={item.itemName}

                        onChange={e=>

                          updateItem(

                            index,

                            "itemName",

                            e.target.value

                          )

                        }

                        placeholder="Service or Product"

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                      />

                    </td>

                    <td className="p-4">

                      <input

                        type="number"

                        min={1}

                        value={item.qty}

                        onChange={e=>

                          updateItem(

                            index,

                            "qty",

                            Number(

                              e.target.value

                            )

                          )

                        }

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                      />

                    </td>

                    <td className="p-4">

                      <input

                        type="number"

                        min={0}

                        step="0.01"

                        value={item.price}

                        onChange={e=>

                          updateItem(

                            index,

                            "price",

                            Number(

                              e.target.value

                            )

                          )

                        }

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                      />

                    </td>

                    <td className="p-4 font-semibold">

                      $

                      {lineTotal.toLocaleString(

                        undefined,

                        {

                          minimumFractionDigits:2,

                          maximumFractionDigits:2

                        }

                      )}

                    </td>

                    <td className="p-4 text-right">

                      <button

                        type="button"

                        onClick={()=>

                          removeItem(index)

                        }

                        className="
                        text-red-600
                        hover:text-red-700
                        "

                      >

                        Remove

                      </button>

                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      </div>
            <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-6">

          Quote Summary

        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div>

            <label className="block mb-2 font-medium">

              Tax Percentage

            </label>

            <input

              type="number"

              min={0}

              step="0.01"

              value={taxPercent}

              onChange={e=>

                setTaxPercent(

                  Number(e.target.value)

                )

              }

              className="
              w-full
              border
              rounded-xl
              p-4
              "

            />

            <p className="text-sm text-slate-500 mt-3">

              Enter your sales tax percentage.

            </p>

          </div>

          <div className="bg-slate-50 rounded-2xl p-6">

            <div className="flex justify-between py-2">

              <span className="text-slate-600">

                Subtotal

              </span>

              <span className="font-semibold">

                $

                {subtotal.toLocaleString(

                  undefined,

                  {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                  }

                )}

              </span>

            </div>

            <div className="flex justify-between py-2">

              <span className="text-slate-600">

                Tax

              </span>

              <span className="font-semibold">

                $

                {tax.toLocaleString(

                  undefined,

                  {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                  }

                )}

              </span>

            </div>

            <hr className="my-5"/>

            <div className="flex justify-between">

              <span className="text-xl font-bold">

                Total

              </span>

              <span className="text-2xl font-bold text-orange-600">

                $

                {total.toLocaleString(

                  undefined,

                  {

                    minimumFractionDigits:2,

                    maximumFractionDigits:2

                  }

                )}

              </span>

            </div>

          </div>

        </div>

      </div>
            <div className="flex items-center justify-end gap-4">

        <button

          type="button"

          onClick={() => router.back()}

          disabled={loading}

          className="
          border
          border-slate-300
          px-8
          py-4
          rounded-2xl
          hover:bg-slate-50
          disabled:opacity-50
          "

        >

          Cancel

        </button>

        <button

          type="submit"

          disabled={loading}

          className="
          bg-orange-600
          hover:bg-orange-700
          disabled:bg-orange-400
          text-white
          px-10
          py-4
          rounded-2xl
          font-semibold
          transition
          "

        >

          {loading
            ? "Creating Quote..."
            : "Create Quote"}

        </button>

      </div>

    </form>

  )

}