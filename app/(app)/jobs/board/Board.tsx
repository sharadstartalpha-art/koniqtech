"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import DndProvider from "./DndProvider"
import JobColumn from "./JobColumn"

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

type Technician = {
  id: string
  name: string
}

type Customer = {
  id: string
  firstName: string
  lastName: string | null
  companyName: string | null
}

type BoardProps = {
  jobs: Job[]
  technicians: Technician[]
  customers: Customer[]
}

const STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled"
]

export default function Board({

  jobs,

  technicians,

  customers

}: BoardProps) {

  const [search, setSearch] = useState("")

  const [technician, setTechnician] =
    useState("")

  const [customer, setCustomer] =
    useState("")

  const filteredJobs =
    useMemo(() => {

      return jobs.filter(job => {

        const customerName =
          (
            job.customer.companyName ??
            `${job.customer.firstName} ${job.customer.lastName ?? ""}`
          ).toLowerCase()

        const title =
          job.title.toLowerCase()

        const matchesSearch =
          !search ||

          title.includes(
            search.toLowerCase()
          ) ||

          customerName.includes(
            search.toLowerCase()
          )

        const matchesTechnician =
          !technician ||

          job.technician?.id ===
          technician

        const matchesCustomer =
          !customer ||

          job.customer.id ===
          customer

        return (

          matchesSearch &&
          matchesTechnician &&
          matchesCustomer

        )

      })

    }, [

      jobs,

      search,

      technician,

      customer

    ])

  return (

    <>

      <div
        className="
        rounded-3xl
        border
        bg-white
        p-6
        "
      >

        <div
          className="
          grid
          gap-4
          lg:grid-cols-4
          "
        >

          <input
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search jobs..."
            className="
            h-12
            rounded-xl
            border
            px-4
            "
          />

          <select
            value={technician}
            onChange={e =>
              setTechnician(
                e.target.value
              )
            }
            className="
            h-12
            rounded-xl
            border
            px-4
            "
          >

            <option value="">
              All Technicians
            </option>

            {technicians.map(user => (

              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>

            ))}

          </select>

          <select
            value={customer}
            onChange={e =>
              setCustomer(
                e.target.value
              )
            }
            className="
            h-12
            rounded-xl
            border
            px-4
            "
          >

            <option value="">
              All Customers
            </option>

            {customers.map(c => (

              <option
                key={c.id}
                value={c.id}
              >
                {c.companyName ??
                  `${c.firstName} ${c.lastName ?? ""}`}
              </option>

            ))}

          </select>

          <Link
            href="/jobs/create"
            className="
            flex
            h-12
            items-center
            justify-center
            rounded-xl
            bg-green-600
            font-medium
            text-white
            hover:bg-green-700
            "
          >
            + New Job
          </Link>

        </div>

      </div>

     <DndProvider>

        <div
          className="
          grid
          gap-6
          xl:grid-cols-4
          "
        >

          {STATUSES.map(status => (

            <JobColumn
              key={status}
              status={status}
              jobs={
                filteredJobs.filter(
                  job =>
                    job.status ===
                    status
                )
              }
            />

          ))}

        </div>

      </DndProvider>

    </>

  )

}