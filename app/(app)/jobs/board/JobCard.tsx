"use client"

import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

type Job = {
  id: string
  title: string
  status: string
  scheduledDate: Date | null

  customer: {
    id: string
    firstName: string
    lastName: string | null
    companyName: string | null
  }

  technician: {
    id: string
    name: string
  } | null

  quote: {
    id: string
    quoteNumber: string
  } | null

  invoices: {
    id: string
    invoiceNumber: string
    status: string
  }[]
}

interface JobCardProps {
  job: Job
}

export default function JobCard({
  job,
}: JobCardProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  
    isDragging,
  } = useDraggable({

    id: job.id,

    data: {
      jobId: job.id,
      status: job.status,
    },

  })

  const style = {

    transform: transform
    ? CSS.Translate.toString(transform)
    : undefined,

   

    opacity: isDragging ? 0.6 : 1,

    zIndex: isDragging ? 1000 : 1,

  }

  const customerName =
    job.customer.companyName ??
    `${job.customer.firstName} ${job.customer.lastName ?? ""}`

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="
      cursor-grab
      rounded-2xl
      border
      bg-white
      p-4
      shadow-sm
      transition
      hover:shadow-md
      active:cursor-grabbing
      "
    >

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          <Link
            href={`/jobs/${job.id}`}
            className="
            line-clamp-2
            font-semibold
            hover:text-blue-600
            "
          >
            {job.title}
          </Link>

          <p className="mt-2 text-sm text-slate-500">

            {customerName}

          </p>

        </div>

        <span
          className="
          rounded-full
          bg-slate-100
          px-2
          py-1
          text-xs
          font-medium
          whitespace-nowrap
          "
        >

          {job.status.replace("_", " ")}

        </span>

      </div>

      <div className="mt-4 space-y-2 text-sm">

        <div className="flex justify-between">

          <span className="text-slate-500">
            Technician
          </span>

          <span className="font-medium">

            {job.technician?.name ??
              "Unassigned"}

          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-500">
            Schedule
          </span>

          <span>

            {job.scheduledDate
              ? new Date(
                  job.scheduledDate
                ).toLocaleDateString()
              : "-"}

          </span>

        </div>

      </div>

      <div className="mt-5 flex flex-wrap gap-2">

        {job.quote && (

          <span
            className="
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-xs
            font-medium
            text-blue-700
            "
          >

            Quote #{job.quote.quoteNumber}

          </span>

        )}

        {job.invoices.length > 0 && (

          <span
            className="
            rounded-full
            bg-emerald-100
            px-3
            py-1
            text-xs
            font-medium
            text-emerald-700
            "
          >

            {job.invoices.length}
            {" "}
            Invoice
            {job.invoices.length > 1
              ? "s"
              : ""}

          </span>

        )}

      </div>

      <div className="mt-6 flex gap-2">

        <Link
          href={`/jobs/${job.id}`}
          className="
          flex-1
          rounded-xl
          border
          py-2
          text-center
          text-sm
          hover:bg-slate-50
          "
        >

          View

        </Link>

        <Link
          href={`/jobs/${job.id}/edit`}
          className="
          flex-1
          rounded-xl
          bg-blue-600
          py-2
          text-center
          text-sm
          text-white
          hover:bg-blue-700
          "
        >

          Edit

        </Link>

      </div>

    </div>

  )

}