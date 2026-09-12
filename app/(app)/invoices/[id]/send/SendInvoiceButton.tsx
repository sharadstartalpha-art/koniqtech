"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SendInvoiceButton({
  invoiceId,
}: {
  invoiceId: string
}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  async function sendInvoice() {
    if (loading) return

    const confirmed = window.confirm(
      "Are you sure you want to send this invoice to the customer?"
    )

    if (!confirmed) return

    setLoading(true)

    try {
      const response = await fetch(
        `/api/invoices/${invoiceId}/send`,
        {
          method: "POST",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to send invoice."
        )
      }

      alert(
        "Invoice sent successfully."
      )

      router.push(
        `/invoices/${invoiceId}`
      )

      router.refresh()
    } catch (error) {
      console.error(
        "Send invoice error:",
        error
      )

      alert(
        error instanceof Error
          ? error.message
          : "Failed to send invoice."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={sendInvoice}
      disabled={loading}
      className="
        px-6
        py-3
        rounded-xl
        bg-blue-600
        text-white
        hover:bg-blue-700
        disabled:opacity-60
        disabled:cursor-not-allowed
      "
    >
      {loading
        ? "Sending..."
        : "Send Invoice"}
    </button>
  )
}