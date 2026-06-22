"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function SecurityToast({
  error,
  success
}:{
  error?: string
  success?: string
}) {

  useEffect(() => {

    if (error) {
      toast.error(error)
    }

    if (success) {
      toast.success(success)
    }

  }, [error, success])

  return null
}