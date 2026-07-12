"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
} from "lucide-react"

import {
  retryEmailAction,
  cancelEmailAction,
  markEmailSentAction,
  deleteEmailAction,
} from "../actions"

type EmailQueue = {
  id: string
  status: string
}

type Props = {
  email: EmailQueue
}

export default function EmailQueueActions({
  email,
}: Props) {
  const router = useRouter()

  const [pending, startTransition] = useTransition()

  function run(
    action: () => Promise<{
      success: boolean
      message: string
    }>
  ) {
    startTransition(async () => {
      const result = await action()

      alert(result.message)

      if (result.success) {
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-wrap gap-3">

      {/* Retry */}

      {email.status === "failed" && (
        <button
          disabled={pending}
          onClick={() =>
            run(() => retryEmailAction(email.id))
          }
          className="
            inline-flex
            h-11
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}

          Retry
        </button>
      )}

      {/* Mark Sent */}

      {email.status !== "sent" &&
        email.status !== "delivered" && (
          <button
            disabled={pending}
            onClick={() =>
              run(() => markEmailSentAction(email.id))
            }
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-green-600
              px-5
              font-medium
              text-white
              transition
              hover:bg-green-700
              disabled:opacity-50
            "
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            Mark Sent
          </button>
        )}

      {/* Cancel */}

      {email.status !== "cancelled" &&
        email.status !== "sent" &&
        email.status !== "delivered" && (
          <button
            disabled={pending}
            onClick={() => {
              if (
                !confirm(
                  "Cancel this email?"
                )
              ) {
                return
              }

              run(() =>
                cancelEmailAction(email.id)
              )
            }}
            className="
              inline-flex
              h-11
              items-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              font-medium
              text-white
              transition
              hover:bg-orange-600
              disabled:opacity-50
            "
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}

            Cancel
          </button>
        )}

      {/* Delete */}

      <button
        disabled={pending}
        onClick={() => {
          if (
            !confirm(
              "Delete this email permanently?"
            )
          ) {
            return
          }

          startTransition(async () => {
            const result =
              await deleteEmailAction(email.id)

            alert(result.message)

            if (result.success) {
              router.push(
                "/admin/marketing/email-queue"
              )
            }
          })
        }}
        className="
          inline-flex
          h-11
          items-center
          gap-2
          rounded-xl
          bg-red-600
          px-5
          font-medium
          text-white
          transition
          hover:bg-red-700
          disabled:opacity-50
        "
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}

        Delete
      </button>

    </div>
  )
}