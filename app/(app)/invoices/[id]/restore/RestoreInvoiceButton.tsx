"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  invoiceId: string
}

export default function RestoreInvoiceButton({
  invoiceId,
}: Props) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  async function handleRestore() {

    const confirmed =
      window.confirm(
        "Are you sure you want to restore this invoice?"
      )

    if (!confirmed) {
      return
    }

    setLoading(true)

    try {

      const response =
        await fetch(
          `/api/invoices/${invoiceId}/restore`,
          {
            method: "POST",
          }
        )

      const data =
        await response.json()

      if (!response.ok) {

        throw new Error(
          data.error ??
          "Failed to restore invoice."
        )

      }

      router.push("/invoices")

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

    <button
      type="button"
      onClick={handleRestore}
      disabled={loading}
      className="
        bg-green-600
        hover:bg-green-700
        disabled:bg-slate-400
        text-white
        px-8
        py-4
        rounded-2xl
        font-semibold
      "
    >

      {loading
        ? "Restoring..."
        : "Restore Invoice"
      }

    </button>

  )
}