"use client"

import { useTransition } from "react"

interface Customer {
  id: string
  firstName: string
  lastName: string | null
  companyName: string | null
}

interface Technician {
  id: string
  name: string
}

interface Quote {
  id: string
  quoteNumber: string
}

interface JobData {
  id?: string
  title: string
  customerId: string
  technicianId: string
  quoteId: string
  status: string
  scheduledDate: string
  completedDate: string
  notes: string
}

interface JobFormProps {
  action: (formData: FormData) => void | Promise<void>

  customers: Customer[]

  technicians: Technician[]

  quotes: Quote[]

  submitLabel: string

  job?: JobData
}

export default function JobForm({

  action,

  customers,

  technicians,

  quotes,

  submitLabel,

  job,

}: JobFormProps) {

  const [isPending, startTransition] =
    useTransition()

  return (

    <form
      action={(formData) => {

        startTransition(() => {
          action(formData)
        })

      }}
      className="space-y-8"
    >

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Job Title
          </label>

          <input
            name="title"
            required
            defaultValue={job?.title}
            placeholder="Kitchen Remodel"
            className="h-14 w-full rounded-2xl border px-5"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Customer
          </label>

          <select
            name="customerId"
            required
            defaultValue={job?.customerId ?? ""}
            className="h-14 w-full rounded-2xl border px-5"
          >

            <option value="">
              Select customer
            </option>

            {customers.map(customer => (

              <option
                key={customer.id}
                value={customer.id}
              >

                {customer.companyName ??

                  `${customer.firstName} ${customer.lastName ?? ""}`}

              </option>

            ))}

          </select>

        </div>
                <div>

          <label className="mb-2 block text-sm font-medium">
            Technician
          </label>

          <select
            name="technicianId"
            defaultValue={job?.technicianId ?? ""}
            className="h-14 w-full rounded-2xl border px-5"
          >

            <option value="">
              Unassigned
            </option>

            {technicians.map((technician) => (

              <option
                key={technician.id}
                value={technician.id}
              >
                {technician.name}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Quote
          </label>

          <select
            name="quoteId"
            defaultValue={job?.quoteId ?? ""}
            className="h-14 w-full rounded-2xl border px-5"
          >

            <option value="">
              No Quote
            </option>

            {quotes.map((quote) => (

              <option
                key={quote.id}
                value={quote.id}
              >
                {quote.quoteNumber}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            name="status"
            defaultValue={job?.status ?? "scheduled"}
            className="h-14 w-full rounded-2xl border px-5"
          >

            <option value="scheduled">
              Scheduled
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Scheduled Date
          </label>

          <input
            type="date"
            name="scheduledDate"
            defaultValue={job?.scheduledDate}
            className="h-14 w-full rounded-2xl border px-5"
          />

        </div>
      </div>
            <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Completed Date
          </label>

          <input
            type="date"
            name="completedDate"
            defaultValue={job?.completedDate}
            className="h-14 w-full rounded-2xl border px-5"
          />

        </div>

        <div className="lg:col-span-2">

          <label className="mb-2 block text-sm font-medium">
            Job Notes
          </label>

          <textarea
            name="notes"
            rows={6}
            defaultValue={job?.notes}
            placeholder="Add important notes about this job..."
            className="w-full rounded-2xl border p-5 resize-none"
          />

        </div>

      </div>

      {job?.id && (

        <input
          type="hidden"
          name="id"
          value={job.id}
        />

      )}

      <div className="flex flex-wrap justify-end gap-4 border-t pt-8">

        <a
          href="/jobs"
          className="
            rounded-2xl
            border
            px-6
            py-3
            hover:bg-slate-50
          "
        >
          Cancel
        </a>

        <button
          type="submit"
          disabled={isPending}
          className="
            rounded-2xl
            bg-blue-600
            px-8
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >

          {isPending
            ? "Saving..."
            : submitLabel}

        </button>

      </div>

    </form>

  )

}