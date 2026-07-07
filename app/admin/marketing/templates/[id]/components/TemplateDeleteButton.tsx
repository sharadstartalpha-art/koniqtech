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
  deleteMarketingTemplateAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type TemplateDeleteButtonProps = {
  templateId: string
  templateName: string
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TemplateDeleteButton({
  templateId,
  templateName,
}: TemplateDeleteButtonProps) {
  const router =
    useRouter()

  const [
    isPending,
    startTransition,
  ] = useTransition()

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  )

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  function openModal() {
    if (isPending) {
      return
    }

    setError(null)
    setShowConfirm(true)
  }

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeModal() {
    if (isPending) {
      return
    }

    setError(null)
    setShowConfirm(false)
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete() {
    if (isPending) {
      return
    }

    setError(null)

    startTransition(async () => {
      try {
        const result =
          await deleteMarketingTemplateAction(
            templateId
          )

        if (!result.success) {
          setError(
            result.message ||
              "Unable to delete template."
          )

          return
        }

        setShowConfirm(false)

        router.push(
          "/admin/marketing/templates"
        )

        router.refresh()
      } catch (actionError) {
        console.error(
          "Delete template error:",
          actionError
        )

        setError(
          "Unable to delete template."
        )
      }
    })
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* =================================================
          DELETE BUTTON
      ================================================= */}

      <button
        type="button"
        disabled={isPending}
        onClick={openModal}
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
        <Trash2 className="h-4 w-4" />

        Delete
      </button>

      {/* =================================================
          CONFIRMATION MODAL
      ================================================= */}

      {showConfirm && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal()
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-template-title"
            aria-describedby="delete-template-description"
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-red-200
              bg-white
              shadow-2xl
            "
          >
            {/* ===========================================
                HEADER
            =========================================== */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-red-100
                px-6
                py-5
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-red-600
                  "
                >
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="delete-template-title"
                    className="
                      font-bold
                      text-slate-950
                    "
                  >
                    Delete Template
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                aria-label="Close delete confirmation"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                  transition
                  hover:bg-red-50
                  hover:text-red-600
                  disabled:opacity-50
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ===========================================
                BODY
            =========================================== */}

            <div className="px-6 py-6">
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-red-600
                  "
                >
                  Template to Delete
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    font-bold
                    text-red-950
                  "
                >
                  {templateName}
                </p>
              </div>

              <p
                id="delete-template-description"
                className="
                  mt-5
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                The template will be permanently
                removed from your marketing template
                library. It will no longer be available
                for campaigns, newsletters, outreach,
                demo reminders, or other workflows.
              </p>

              {/* =========================================
                  WARNING
              ========================================= */}

              <div
                className="
                  mt-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-orange-200
                  bg-orange-50
                  px-4
                  py-3
                "
              >
                <AlertTriangle
                  className="
                    mt-0.5
                    h-4
                    w-4
                    shrink-0
                    text-orange-600
                  "
                />

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-orange-800
                    "
                  >
                    Consider archiving instead
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-orange-700
                    "
                  >
                    If you may need this template
                    later, archive it instead of
                    permanently deleting it.
                  </p>
                </div>
              </div>

              {/* =========================================
                  ERROR
              ========================================= */}

              {error && (
                <div
                  role="alert"
                  className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >
                  <AlertTriangle
                    className="
                      mt-0.5
                      h-4
                      w-4
                      shrink-0
                    "
                  />

                  <span>
                    {error}
                  </span>
                </div>
              )}
            </div>

            {/* ===========================================
                FOOTER
            =========================================== */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-slate-200
                bg-slate-50
                px-6
                py-4
                sm:flex-row
                sm:justify-end
              "
            >
              {/* CANCEL */}

              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  px-4
                  text-sm
                  font-semibold
                  text-blue-700
                  transition
                  hover:bg-blue-100
                  disabled:opacity-50
                "
              >
                Keep Template
              </button>

              {/* CONFIRM DELETE */}

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="
                  inline-flex
                  h-10
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
                  disabled:opacity-50
                "
              >
                {isPending ? (
                  <>
                    <Loader2
                      className="
                        h-4
                        w-4
                        animate-spin
                      "
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />

                    Delete Permanently
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