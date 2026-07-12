"use client"

import {
  useState,
  useTransition
} from "react"

import { useRouter } from "next/navigation"

import {
  Ban,
  RefreshCcw,
  Trash2,
  X
} from "lucide-react"

import {
  cancelSmsAction,
  deleteSmsAction,
  retrySmsAction
} from "../actions"

/* =========================================================
   TYPES
========================================================= */

type SmsQueueActionsProps = {
  smsId: string
  status: string
  redirectAfterDelete?: boolean
}

type ActionResult = {
  success: boolean
  message: string
}

type ConfirmAction =
  | "retry"
  | "cancel"
  | "delete"
  | null

/* =========================================================
   COMPONENT
========================================================= */

export default function SmsQueueActions({
  smsId,
  status,
  redirectAfterDelete = false
}: SmsQueueActionsProps) {
  const router = useRouter()

  const [isPending, startTransition] =
    useTransition()

  const [confirmAction, setConfirmAction] =
    useState<ConfirmAction>(null)

  const [result, setResult] =
    useState<ActionResult | null>(null)

  const normalizedStatus =
    status.toLowerCase()

  /* =======================================================
     ACTION RULES
  ======================================================= */

  const canRetry = [
    "failed",
    "cancelled"
  ].includes(normalizedStatus)

  const canCancel = [
    "pending",
    "queued",
    "scheduled",
    "processing",
    "sending"
  ].includes(normalizedStatus)

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeModal() {
    if (isPending) {
      return
    }

    setConfirmAction(null)
  }

  /* =======================================================
     RUN ACTION
  ======================================================= */

  function runAction() {
    if (!confirmAction) {
      return
    }

    setResult(null)

    startTransition(async () => {
      let response: ActionResult

      if (confirmAction === "retry") {
        response =
          await retrySmsAction(smsId)
      } else if (
        confirmAction === "cancel"
      ) {
        response =
          await cancelSmsAction(smsId)
      } else {
        response =
          await deleteSmsAction(smsId)
      }

      setResult(response)

      if (!response.success) {
        setConfirmAction(null)
        return
      }

      if (
        confirmAction === "delete" &&
        redirectAfterDelete
      ) {
        router.push(
          "/admin/marketing/sms-queue"
        )

        router.refresh()

        return
      }

      setConfirmAction(null)

      router.refresh()
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* RETRY */}

        {canRetry && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setConfirmAction("retry")
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <RefreshCcw size={17} />

            Retry SMS
          </button>
        )}

        {/* CANCEL */}

        {canCancel && (
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setConfirmAction("cancel")
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Ban size={17} />

            Cancel SMS
          </button>
        )}

        {/* DELETE */}

        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            setConfirmAction("delete")
          }
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-red-600
            px-5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Trash2 size={17} />

          Delete
        </button>
      </div>

      {/* RESULT MESSAGE */}

      {result && (
        <div
          className={`
            mt-4
            rounded-xl
            border
            px-4
            py-3
            text-sm
            ${
              result.success
                ? `
                  border-green-200
                  bg-green-50
                  text-green-700
                `
                : `
                  border-red-200
                  bg-red-50
                  text-red-700
                `
            }
          `}
        >
          {result.message}
        </div>
      )}

      {/* CONFIRMATION MODAL */}

      {confirmAction && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              bg-white
              p-6
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  ${
                    confirmAction === "delete"
                      ? "bg-red-50 text-red-600"
                      : confirmAction === "cancel"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600"
                  }
                `}
              >
                {confirmAction === "retry" && (
                  <RefreshCcw size={22} />
                )}

                {confirmAction === "cancel" && (
                  <Ban size={22} />
                )}

                {confirmAction === "delete" && (
                  <Trash2 size={22} />
                )}
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:opacity-50
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="mt-5">
              <h2 className="text-xl font-bold text-slate-950">
                {confirmAction === "retry" &&
                  "Retry SMS?"}

                {confirmAction === "cancel" &&
                  "Cancel SMS?"}

                {confirmAction === "delete" &&
                  "Delete SMS record?"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {confirmAction === "retry" &&
                  "The SMS will be returned to the pending delivery queue for another processing attempt."}

                {confirmAction === "cancel" &&
                  "The SMS will be marked as cancelled and should no longer be processed by the SMS worker."}

                {confirmAction === "delete" &&
                  "This SMS queue record will be permanently deleted. This action cannot be undone."}
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                className="
                  h-11
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                "
              >
                Keep SMS
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={runAction}
                className={`
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  ${
                    confirmAction === "delete"
                      ? `
                        bg-red-600
                        hover:bg-red-700
                      `
                      : confirmAction === "cancel"
                        ? `
                          bg-orange-500
                          hover:bg-orange-600
                        `
                        : `
                          bg-blue-600
                          hover:bg-blue-700
                        `
                  }
                `}
              >
                {isPending ? (
                  <>
                    <RefreshCcw
                      size={16}
                      className="animate-spin"
                    />

                    Processing...
                  </>
                ) : (
                  <>
                    {confirmAction === "retry" && (
                      <>
                        <RefreshCcw size={16} />
                        Retry SMS
                      </>
                    )}

                    {confirmAction === "cancel" && (
                      <>
                        <Ban size={16} />
                        Cancel SMS
                      </>
                    )}

                    {confirmAction === "delete" && (
                      <>
                        <Trash2 size={16} />
                        Delete Record
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}