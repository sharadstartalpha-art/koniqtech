"use client"

import {
  useEffect,
  useMemo,
  useState
} from "react"

import { useRouter } from "next/navigation"

interface Customer {
  id: string
  companyName: string | null
  firstName: string | null
  lastName: string | null
}

interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  total: number
}

interface PaymentData {
  id: string

  customerId: string

  invoiceId: string

  amount: number

  method: string

  reference: string

  notes: string

  paidAt: string
}

interface PaymentFormProps {

  customers: Customer[]

  invoices: Invoice[]

  payment?: PaymentData

}

const paymentMethods = [

  "cash",

  "cheque",

  "bank_transfer",

  "ach",

  "paypal",

  "stripe",

  "credit_card",

  "debit_card",

  "wire",

  "other"

]

export default function PaymentForm({

  customers,

  invoices,

  payment

}: PaymentFormProps) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  const [customerId, setCustomerId] =
    useState(
      payment?.customerId ?? ""
    )

  const [invoiceId, setInvoiceId] =
    useState(
      payment?.invoiceId ?? ""
    )

  const [amount, setAmount] =
    useState(
      payment?.amount ?? 0
    )

  const [method, setMethod] =
    useState(
      payment?.method ?? "cash"
    )

  const [reference, setReference] =
    useState(
      payment?.reference ?? ""
    )

  const [notes, setNotes] =
    useState(
      payment?.notes ?? ""
    )

  const [paidAt, setPaidAt] =
    useState(

      payment?.paidAt ??

      new Date()
        .toISOString()
        .split("T")[0]

    )

  const filteredInvoices =
    useMemo(() => {

      if (!customerId) {

        return []

      }

      return invoices.filter(

        invoice =>

          invoice.customerId ===
          customerId

      )

    }, [

      customerId,

      invoices

    ])

  const selectedInvoice =
    useMemo(() => {

      return filteredInvoices.find(

        invoice =>

          invoice.id ===
          invoiceId

      )

    }, [

      filteredInvoices,

      invoiceId

    ])

  useEffect(() => {

    if (

      invoiceId &&

      !filteredInvoices.some(

        invoice =>

          invoice.id === invoiceId

      )

    ) {

      setInvoiceId("")

    }

  }, [

    filteredInvoices,

    invoiceId

  ])

  useEffect(() => {

    if (

      selectedInvoice &&

      !payment

    ) {

      setAmount(

        selectedInvoice.total

      )

    }

  }, [

    selectedInvoice,

    payment

  ])

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

    if (!invoiceId) {

      alert(
        "Please select an invoice."
      )

      return

    }

    if (
      Number(amount) <= 0
    ) {

      alert(
        "Amount must be greater than zero."
      )

      return

    }

    setLoading(true)

    try {

      const response =
        await fetch(

          payment
            ? `/api/payments/${payment.id}`
            : "/api/payments",

          {

            method:
              payment
                ? "PUT"
                : "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              customerId,

              invoiceId,

              amount:
                Number(amount),

              method,

              reference:
                reference.trim(),

              notes:
                notes.trim(),

              paidAt:
                paidAt || null

            })

          }

        )

      const data =
        await response.json()

      if (!response.ok) {

        throw new Error(

          data.error ??

          "Unable to save payment."

        )

      }

      router.push(
        `/payments/${data.id}`
      )

      router.refresh()

    }

    catch (error: any) {

      alert(

        error.message ??

        "Something went wrong."

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

        <h2 className="text-2xl font-bold mb-8">
          Payment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Customer
            </label>

            <select
              value={customerId}
              onChange={(e) =>
                setCustomerId(e.target.value)
              }
              className="w-full border rounded-xl p-4"
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

                  {customer.companyName
                    ? customer.companyName
                    : `${customer.firstName ?? ""} ${customer.lastName ?? ""}`}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Invoice
            </label>

            <select
              value={invoiceId}
              onChange={(e) =>
                setInvoiceId(e.target.value)
              }
              className="w-full border rounded-xl p-4"
              required
            >

              <option value="">
                Select Invoice
              </option>

              {filteredInvoices.map(invoice => (

                <option
                  key={invoice.id}
                  value={invoice.id}
                >

                  {invoice.invoiceNumber}
                  {" — "}
                  ₹
                  {invoice.total.toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}

                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Payment Amount
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Number(e.target.value)
                )
              }
              className="w-full border rounded-xl p-4"
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Payment Method
            </label>

            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            >

              {paymentMethods.map(method => (

                <option
                  key={method}
                  value={method}
                >

                  {method
                    .replaceAll("_", " ")
                    .replace(
                      /\b\w/g,
                      c => c.toUpperCase()
                    )}

                </option>

              ))}

            </select>

          </div>

        </div>

      </div>
            <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-8">
          Payment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Reference Number
            </label>

            <input
              type="text"
              value={reference}
              onChange={(e) =>
                setReference(e.target.value)
              }
              placeholder="Transaction ID, Cheque No., UTR..."
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Payment Date
            </label>

            <input
              type="date"
              value={paidAt}
              onChange={(e) =>
                setPaidAt(e.target.value)
              }
              className="w-full border rounded-xl p-4"
              required
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            rows={5}
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="Internal notes about this payment..."
            className="w-full border rounded-xl p-4 resize-none"
          />

        </div>

      </div>

      <div className="bg-slate-50 border rounded-3xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Payment Summary
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span className="text-slate-500">
              Customer
            </span>

            <span className="font-medium">

              {customers.find(
                customer =>
                  customer.id === customerId
              )?.companyName ||

                `${customers.find(
                  customer =>
                    customer.id === customerId
                )?.firstName ?? ""} ${customers.find(
                  customer =>
                    customer.id === customerId
                )?.lastName ?? ""}`}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Invoice
            </span>

            <span className="font-medium">
              {selectedInvoice?.invoiceNumber || "-"}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Payment Method
            </span>

            <span className="font-medium capitalize">
              {method.replaceAll("_", " ")}
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-500">
              Payment Date
            </span>

            <span className="font-medium">
              {paidAt || "-"}
            </span>

          </div>

          <div className="border-t pt-5 flex justify-between">

            <span className="text-lg font-semibold">
              Amount
            </span>

            <span className="text-3xl font-bold text-emerald-600">

              ₹
              {Number(amount).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )}

            </span>

          </div>

        </div>

      </div>
            <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="
            px-6
            py-3
            rounded-xl
            border
            hover:bg-slate-100
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            px-8
            py-3
            rounded-xl
            bg-emerald-600
            text-white
            hover:bg-emerald-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            min-w-[170px]
          "
        >
          {loading
            ? "Saving..."
            : payment
            ? "Update Payment"
            : "Record Payment"}
        </button>

      </div>

    </form>

  )

}