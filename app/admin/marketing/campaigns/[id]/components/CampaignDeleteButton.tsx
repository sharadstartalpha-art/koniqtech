"use client"

import {
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react"

import {
  deleteCampaignAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type CampaignDeleteButtonProps = {
  campaignId: string
  campaignTitle: string
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignDeleteButton({
  campaignId,
  campaignTitle,
}: CampaignDeleteButtonProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false)

  const [
    confirmationText,
    setConfirmationText,
  ] = useState("")

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  /* =======================================================
     CONFIRMATION
  ======================================================= */

  const confirmationMatches =
    confirmationText.trim() ===
    campaignTitle.trim()

  /* =======================================================
     OPEN
  ======================================================= */

  function openConfirmation() {
    setError(null)
    setConfirmationText("")
    setShowConfirmation(true)
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  function closeConfirmation() {
    if (isPending) {
      return
    }

    setShowConfirmation(false)
    setConfirmationText("")
    setError(null)
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete() {
    if (!confirmationMatches) {
      setError(
        "Enter the campaign title exactly to confirm deletion."
      )

      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const result =
          await deleteCampaignAction(
            campaignId
          )

        if (!result.success) {
          setError(result.message)
          return
        }

        router.push(
          "/admin/marketing/campaigns"
        )

        router.refresh()
      } catch (actionError) {
        console.error(
          "Campaign delete error:",
          actionError
        )

        setError(
          "Unable to delete campaign."
        )
      }
    })
  }

  /* =======================================================
     CLOSED STATE
  ======================================================= */

  if (!showConfirmation) {
    return (
      <button
        type="button"
        onClick={openConfirmation}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-600
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-red-700
        "
      >
        <Trash2 className="h-4 w-4" />

        Delete Campaign
      </button>
    )
  }

  /* =======================================================
     CONFIRMATION UI
  ======================================================= */

  return (
    <div
      className="
        w-full
        max-w-xl
        overflow-hidden
        rounded-2xl
        border
        border-red-200
        bg-white
        shadow-sm
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-red-200
          bg-red-50
          px-5
          py-4
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-red-100
              text-red-600
            "
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-red-900">
              Delete Campaign
            </h3>

            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={closeConfirmation}
          className="
            inline-flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-white
            text-red-600
            ring-1
            ring-red-200
            transition
            hover:bg-red-100
            disabled:opacity-50
          "
          aria-label="Close delete confirmation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* CONTENT */}

      <div className="space-y-5 p-5">
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50/60
            p-4
          "
        >
          <p className="text-sm font-semibold text-red-900">
            Deleting this campaign will remove:
          </p>

          <ul
            className="
              mt-3
              list-inside
              list-disc
              space-y-1
              text-sm
              text-red-700
            "
          >
            <li>
              The campaign record
            </li>

            <li>
              Campaign lead attribution records
            </li>

            <li>
              Campaign conversion attribution records
            </li>
          </ul>

          <p className="mt-3 text-sm text-red-700">
            The original company lead records
            themselves are not deleted.
          </p>
        </div>

        {/* CONFIRM INPUT */}

        <div>
          <label
            htmlFor="campaign-delete-confirmation"
            className="
              block
              text-sm
              font-semibold
              text-slate-700
            "
          >
            Enter the campaign title to confirm
          </label>

          <div
            className="
              mt-2
              rounded-lg
              bg-slate-50
              px-3
              py-2
              text-sm
              font-semibold
              text-slate-700
            "
          >
            {campaignTitle}
          </div>

          <input
            id="campaign-delete-confirmation"
            type="text"
            value={confirmationText}
            disabled={isPending}
            onChange={(event) => {
              setConfirmationText(
                event.target.value
              )

              if (error) {
                setError(null)
              }
            }}
            placeholder="Enter campaign title"
            autoComplete="off"
            className="
              mt-3
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-red-400
              focus:ring-4
              focus:ring-red-50
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          />
        </div>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="
              flex
              items-start
              gap-2
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700
            "
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ACTIONS */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-end
          "
        >
          <button
            type="button"
            disabled={isPending}
            onClick={closeConfirmation}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-xl
              bg-orange-50
              px-5
              text-sm
              font-semibold
              text-orange-700
              transition
              hover:bg-orange-100
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              isPending ||
              !confirmationMatches
            }
            onClick={handleDelete}
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
              shadow-sm
              transition
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />

                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />

                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}