"use client"

import { useState } from "react"

export default function QuoteForm({
  customers
}:{
  customers:any[]
}){

  const [search,setSearch]=
    useState("")

  const filtered=
    customers.filter(c=>

      `${c.firstName}
      ${c.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())

    )

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">

        Create Quote

      </h1>

      <div className="bg-white rounded-3xl p-8 space-y-5">

        <div>

          <input
            placeholder="Search customer..."
            value={search}
            onChange={e=>
              setSearch(
                e.target.value
              )
            }
            className="
            w-full
            border
            p-4
            rounded-xl
            "
          />

        </div>

        <select
          name="customerId"
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        >

          <option value="">

            Select Customer

          </option>

          {filtered.map(customer=>(

            <option
              key={customer.id}
              value={customer.id}
            >

              {customer.firstName}
              {" "}
              {customer.lastName}
              {" - "}
              {customer.email}

            </option>

          ))}

        </select>

        <input
          placeholder="Quote Title"
          className="
          w-full
          border
          p-4
          rounded-xl
          "
        />

        <textarea
          placeholder="Description"
          className="
          w-full
          border
          p-4
          rounded-xl
          h-32
          "
        />

        <button
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

      </div>

    </div>

  )

}