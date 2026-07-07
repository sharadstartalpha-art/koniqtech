"use client"

import {
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  CheckCircle2,
  Loader2,
  Trash2,
  X,
} from "lucide-react"

import {
  markCampaignLeadConvertedAction,
  removeCampaignLeadAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type CampaignLeadActionsProps = {
  campaignId: string
  companyLeadId: string
  companyName: string
  converted: boolean
}

/* =========================================================
   COMPONENT
========================================================= */

export default function CampaignLeadActions({
  campaignId,
  companyLeadId,
  companyName,
  converted,
}: CampaignLeadActionsProps) {
  const router = useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    activeAction,
    setActiveAction,
  ] = useState<
    "convert" | "remove" | null
  >(null)

  const [
    showRemoveConfirm,
    setShowRemoveConfirm,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<string | null>(null)

  /* =======================================================
     MARK CONVERTED
  ======================================================= */

  function handleMarkConverted() {
    setError(null)
    setActiveAction("convert")

    startTransition(async () => {
      try {
        const result =
          await markCampaignLeadConvertedAction(
            campaignId,
            companyLeadId
          )

        if (!result.success) {
          setError(result.message)
          setActiveAction(null)
          return
        }

        router.refresh()
        setActiveAction(null)
      } catch (actionError) {
        console.error(
          "Campaign conversion error:",
          actionError
        )

        setError(
          "Unable to mark lead as converted."
        )

        setActiveAction(null)
      }
    })
  }

  /* =======================================================
     REMOVE LEAD
  ======================================================= */

  function handleRemove() {
    setError(null)
    setActiveAction("remove")

    startTransition(async () => {
      try {
        const result =
          await removeCampaignLeadAction(
            campaignId,
            companyLeadId
          )

        if (!result.success) {
          setError(result.message)
          setActiveAction(null)
          return
        }

        setShowRemoveConfirm(false)

        router.refresh()

        setActiveAction(null)
      } catch (actionError) {
        console.error(
          "Campaign lead removal error:",
          actionError
        )

        setError(
          "Unable to remove lead from campaign."
        )

        setActiveAction(null)
      }
    })
  }

  /* =======================================================
     CONFIRMATION STATE
  ======================================================= */

  if (showRemoveConfirm) {
    return (
      <div
        className="
          min-w-[280px]
          rounded-xl
          border
          border-red-200
          bg-red-50
          p-3
        "
      >
        <p className="text-xs font-semibold text-red-900">
          Remove from campaign?
        </p>

        <p className="mt-1 line-clamp-1 text-xs text-red-700">
          {companyName}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-red-600
              px-3
              py-2
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-red-700
              disabled:opacity-50
            "
          >
            {isPending &&
            activeAction === "remove" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}

            Remove
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setShowRemoveConfirm(false)
            }
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-600
              ring-1
              ring-slate-200
              transition
              hover:bg-slate-50
              disabled:opacity-50
            "
          >
            <X className="h-3.5 w-3.5" />

            Cancel
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    )
  }

  /* =======================================================
     NORMAL ACTIONS
  ======================================================= */

  return (
    <div className="space-y-2">
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        {!converted && (
          <button
            type="button"
            onClick={
              handleMarkConverted
            }
            disabled={isPending}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-green-50
              px-3
              py-2
              text-xs
              font-semibold
              text-green-700
              transition
              hover:bg-green-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isPending &&
            activeAction === "convert" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}

            Mark Converted
          </button>
        )}

        {converted && (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-green-50
              px-3
              py-2
              text-xs
              font-semibold
              text-green-700
            "
          >
            <CheckCircle2 className="h-3.5 w-3.5" />

            Converted
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            setError(null)
            setShowRemoveConfirm(true)
          }}
          disabled={isPending}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-lg
            bg-red-50
            px-3
            py-2
            text-xs
            font-semibold
            text-red-700
            transition
            hover:bg-red-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Trash2 className="h-3.5 w-3.5" />

          Remove
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}