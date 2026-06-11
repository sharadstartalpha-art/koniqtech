"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function convert() {

    try {

      setLoading(true)

      const leadId =
        window.location.pathname.split("/")[2]

      const response = await fetch(
        `/api/leads/${leadId}/convert`,
        {
          method: "POST"
        }
      )

      const data = await response.json()

      if (!response.ok) {

        alert(data.error || "Conversion failed")

        return

      }

      router.push(
        `/customers/${data.customerId}`
      )

    } catch (error) {

      console.error(error)

      alert("Failed to convert lead")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="max-w-xl space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Convert Lead
        </h1>

        <p className="text-slate-500 mt-2">
          Create a customer from this lead
        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <button
          onClick={convert}
          disabled={loading}
          className="
          px-8
          py-4
          bg-green-600
          hover:bg-green-700
          disabled:opacity-50
          text-white
          rounded-xl
          font-medium
          "
        >
          {loading
            ? "Converting..."
            : "Convert To Customer"}
        </button>

      </div>

    </div>

  )

}