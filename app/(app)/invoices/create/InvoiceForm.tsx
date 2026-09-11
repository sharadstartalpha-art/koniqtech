"use client"

import {
  useMemo,
  useState,
  useEffect,
} from "react"

import { useRouter } from "next/navigation"
import { InvoiceStatus } from "@prisma/client"
interface Customer {
  id: string
  firstName: string | null
  lastName: string | null
  companyName: string | null
}

interface Job {
  id: string
  title: string
  customerId: string
}

interface InvoiceData {
  id: string
  customerId: string
  jobId: string
  invoiceNumber: string
  subtotal: number
  tax: number
  total: number
  dueDate: string
 status: InvoiceStatus
}

interface InvoiceFormProps {
  customers: Customer[]
  jobs: Job[]
  invoice?: InvoiceData
}

export default function InvoiceForm({
  customers,
  jobs,
  invoice,
}: InvoiceFormProps) {

  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [customerId, setCustomerId] =
    useState(
      invoice?.customerId ?? ""
    )

  const [jobId, setJobId] =
    useState(
      invoice?.jobId ?? ""
    )

  const [invoiceNumber, setInvoiceNumber] =
    useState(
      invoice?.invoiceNumber ??
      `INV-${Date.now()}`
    )

 const [status, setStatus] =
  useState<InvoiceStatus>(
    invoice?.status ??
    InvoiceStatus.draft
  )

  const [dueDate, setDueDate] =
    useState(
      invoice?.dueDate ?? ""
    )

  const [subtotal, setSubtotal] =
    useState(
      invoice?.subtotal ?? 0
    )

  const [tax, setTax] =
    useState(
      invoice?.tax ?? 0
    )

  /* --------------------------------
     AUTOMATIC TOTAL
  -------------------------------- */

  const total = useMemo(() => {

    return (
      Number(subtotal || 0) +
      Number(tax || 0)
    )

  }, [
    subtotal,
    tax,
  ])

  /* --------------------------------
     FILTER JOBS BY CUSTOMER
  -------------------------------- */

  const filteredJobs =
    useMemo(() => {

      if (!customerId) {
        return []
      }

      return jobs.filter(
        (job) =>
          job.customerId === customerId
      )

    }, [
      jobs,
      customerId,
    ])

  /* --------------------------------
     CLEAR JOB WHEN CUSTOMER CHANGES
  -------------------------------- */

  useEffect(() => {

    if (
      jobId &&
      !filteredJobs.some(
        (job) =>
          job.id === jobId
      )
    ) {

      setJobId("")

    }

  }, [
    filteredJobs,
    jobId,
  ])

  /* --------------------------------
     SUBMIT
  -------------------------------- */

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

    if (!jobId) {

      alert(
        "Please select a job."
      )

      return

    }

    if (!invoiceNumber.trim()) {

      alert(
        "Invoice number is required."
      )

      return

    }

    setLoading(true)

    try {

      const response =
        await fetch(
          invoice
            ? `/api/invoices/${invoice.id}`
            : "/api/invoices",
          {
            method:
              invoice
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({

                customerId,

                jobId,

                invoiceNumber:
                  invoiceNumber.trim(),

                status,

                dueDate:
                  dueDate || null,

                subtotal:
                  Number(subtotal || 0),

                tax:
                  Number(tax || 0),

              }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {

        throw new Error(
          data.error ??
          "Unable to save invoice."
        )

      }

      router.push(
        `/invoices/${data.id}`
      )

      router.refresh()

    }
    catch (error: any) {

      alert(
        error?.message ??
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

      {/* --------------------------------
          INVOICE DETAILS
      -------------------------------- */}

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-8
        "
      >

        <h2 className="text-2xl font-bold mb-8">
          Invoice Details
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {/* CUSTOMER */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Customer
            </label>

            <select
              value={customerId}
              onChange={(e) =>
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

              {customers.map(
                (customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >

                    {customer.companyName
                      ? customer.companyName
                      : `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim()
                    }

                  </option>

                )
              )}

            </select>

          </div>

          {/* JOB */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Job
            </label>

            <select
              value={jobId}
              onChange={(e) =>
                setJobId(
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
              disabled={!customerId}
            >

              <option value="">

                {!customerId
                  ? "Select customer first"
                  : filteredJobs.length === 0
                  ? "No jobs for this customer"
                  : "Select Job"
                }

              </option>

              {filteredJobs.map(
                (job) => (

                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title}
                  </option>

                )
              )}

            </select>

          </div>

          {/* INVOICE NUMBER */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Invoice Number
            </label>

            <input
              value={invoiceNumber}
              onChange={(e) =>
                setInvoiceNumber(
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
            />

          </div>

          {/* STATUS */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
  setStatus(
    e.target.value as InvoiceStatus
  )
}
              className="
                w-full
                border
                rounded-xl
                p-4
              "
            >

              <option value="draft">
                Draft
              </option>

              <option value="sent">
                Sent
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          {/* DUE DATE */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
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

      {/* --------------------------------
          AMOUNTS
      -------------------------------- */}

      <div
        className="
          bg-white
          border
          rounded-3xl
          p-8
        "
      >

        <h2 className="text-2xl font-bold mb-8">
          Invoice Amounts
        </h2>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-6
          "
        >

          {/* SUBTOTAL */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Subtotal
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={subtotal}
              onChange={(e) =>
                setSubtotal(
                  Number(
                    e.target.value || 0
                  )
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

          {/* TAX */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Tax
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={tax}
              onChange={(e) =>
                setTax(
                  Number(
                    e.target.value || 0
                  )
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

          {/* TOTAL */}

          <div>

            <label
              className="
                block
                mb-2
                font-medium
              "
            >
              Total
            </label>

            <input
              type="text"
              value={total.toFixed(2)}
              readOnly
              className="
                w-full
                border
                rounded-xl
                p-4
                bg-slate-100
                font-bold
                cursor-not-allowed
              "
            />

          </div>

        </div>

        {/* SUMMARY */}

        <div
          className="
            mt-10
            border
            rounded-2xl
            bg-slate-50
            p-8
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Invoice Summary
          </h3>

          <div className="space-y-4">

            <div
              className="
                flex
                justify-between
              "
            >

              <span className="text-slate-600">
                Subtotal
              </span>

              <span className="font-semibold">
                $
                {Number(subtotal).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div
              className="
                flex
                justify-between
              "
            >

              <span className="text-slate-600">
                Tax
              </span>

              <span className="font-semibold">
                $
                {Number(tax).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

            <div
              className="
                border-t
                pt-4
                flex
                justify-between
              "
            >

              <span
                className="
                  text-xl
                  font-bold
                "
              >
                Total
              </span>

              <span
                className="
                  text-2xl
                  font-bold
                  text-green-600
                "
              >
                $
                {total.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* --------------------------------
          BUTTONS
      -------------------------------- */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <button
          type="submit"
          disabled={loading}
          className="
            bg-orange-600
            hover:bg-orange-700
            disabled:bg-slate-400
            disabled:cursor-not-allowed
            text-white
            px-8
            py-4
            rounded-2xl
            font-semibold
            transition
          "
        >

          {loading
            ? "Saving..."
            : invoice
            ? "Update Invoice"
            : "Create Invoice"
          }

        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/invoices")
          }
          disabled={loading}
          className="
            border
            border-slate-300
            hover:bg-slate-100
            px-8
            py-4
            rounded-2xl
            font-semibold
            transition
          "
        >
          Cancel
        </button>

      </div>

    </form>

  )
}