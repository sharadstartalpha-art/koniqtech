"use client"

import { useDroppable } from "@dnd-kit/core"
import JobCard from "./JobCard"

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

interface JobColumnProps {
  status: string
  jobs: Job[]
}

const STATUS_META: Record<
  string,
  {
    title: string
    color: string
  }
> = {

  scheduled: {

    title: "Scheduled",

    color:
      "bg-blue-100 text-blue-700 border-blue-200"

  },

  in_progress: {

    title: "In Progress",

    color:
      "bg-amber-100 text-amber-700 border-amber-200"

  },

  completed: {

    title: "Completed",

    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200"

  },

  cancelled: {

    title: "Cancelled",

    color:
      "bg-red-100 text-red-700 border-red-200"

  }

}

export default function JobColumn({

  status,

  jobs

}: JobColumnProps) {

  const {

    setNodeRef,

    isOver

  } = useDroppable({

    id: status

  })

  const meta =
    STATUS_META[status]

  return (

    <div
      ref={setNodeRef}
      className={`
        rounded-3xl
        border
        bg-white
        transition-all
        duration-200
        ${
          isOver
            ? "ring-2 ring-blue-500 bg-blue-50"
            : ""
        }
      `}
    >

      <div
        className="
        border-b
        p-5
        "
      >

        <div
          className="
          flex
          items-center
          justify-between
          "
        >

          <span
            className={`
              rounded-full
              border
              px-3
              py-1
              text-sm
              font-semibold
              ${meta.color}
            `}
          >

            {meta.title}

          </span>

          <span
            className="
            rounded-full
            bg-slate-100
            px-3
            py-1
            text-sm
            font-semibold
            text-slate-600
            "
          >

            {jobs.length}

          </span>

        </div>

      </div>

      <div
        className="
        min-h-[650px]
        space-y-4
        p-4
        "
      >

        {jobs.length === 0 && (

          <div
            className="
            flex
            h-40
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            text-center
            text-sm
            text-slate-400
            "
          >

            No jobs in this stage

          </div>

        )}

        {jobs.map(job => (

          <JobCard
            key={job.id}
            job={job}
          />

        ))}

      </div>

    </div>

  )

}