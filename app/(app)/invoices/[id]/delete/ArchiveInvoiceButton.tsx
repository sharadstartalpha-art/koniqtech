"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  invoiceId: string
}

export default function ArchiveInvoiceButton({
  invoiceId,
}: Props) {

  const router =
    useRouter()

  const [loading, setLoading] =
    useState(false)

  async function handleArchive() {

    const confirmed =
      window.confirm(
        "Are you sure you want to archive this invoice?"
      )

    if (!confirmed) {
      return
    }

    setLoading(true)

    try {

      const response =
        await fetch(
          `/api/invoices/${invoiceId}`,
          {
            method: "DELETE",
          }
        )

      const data =
        await response.json()

      if (!response.ok) {

        throw new Error(
          data.error ??
          "Failed to archive invoice."
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
      onClick={handleArchive}
      disabled={loading}
      className="
        bg-red-600
        hover:bg-red-700
        disabled:bg-slate-400
        text-white
        px-8
        py-4
        rounded-2xl
        font-semibold
      "
    >

      {loading
        ? "Archiving..."
        : "Archive Invoice"
      }

    </button>

  )
}