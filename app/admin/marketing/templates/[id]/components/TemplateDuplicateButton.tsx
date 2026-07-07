"use client"

import {
  useState,
  useTransition,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Loader2,
  X,
} from "lucide-react"

import {
  duplicateMarketingTemplateAction,
} from "../../actions"

/* =========================================================
   TYPES
========================================================= */

type TemplateDuplicateButtonProps = {
  templateId: string
  templateName: string
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TemplateDuplicateButton({
  templateId,
  templateName,
}: TemplateDuplicateButtonProps) {
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

  const [
    success,
    setSuccess,
  ] = useState<string | null>(
    null
  )

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeModal() {
    if (isPending) {
      return
    }

    setShowConfirm(false)
    setError(null)
  }

  /* =======================================================
     DUPLICATE
  ======================================================= */

  function handleDuplicate() {
    if (isPending) {
      return
    }

    setError(null)
    setSuccess(null)

    startTransition(
      async () => {
        try {
          const result =
            await duplicateMarketingTemplateAction(
              templateId
            )

          if (!result.success) {
            setError(
              result.message ||
                "Unable to duplicate template."
            )

            return
          }

          setSuccess(
            result.message ||
              "Template duplicated successfully."
          )

          /*
           * If the server action returns:
           *
           * {
           *   success: true,
           *   message: "...",
           *   templateId: duplicated.id
           * }
           *
           * redirect directly to the new copy.
           */

          if (result.templateId) {
            setShowConfirm(false)

            router.push(
              `/admin/marketing/templates/${result.templateId}`
            )

            router.refresh()

            return
          }

          /*
           * Fallback:
           * if action does not return templateId,
           * return to template library.
           */

          setShowConfirm(false)

          router.push(
            "/admin/marketing/templates"
          )

          router.refresh()
        } catch (actionError) {
          console.error(
            "Duplicate template error:",
            actionError
          )

          setError(
            "Unable to duplicate template."
          )
        }
      }
    )
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* =================================================
          MAIN BUTTON
      ================================================= */}

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null)
          setSuccess(null)
          setShowConfirm(true)
        }}
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
          shadow-sm
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Copy className="h-4 w-4" />

        Duplicate
      </button>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && !showConfirm && (
        <div
          role="status"
          className="
            mt-3
            flex
            items-start
            gap-2
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
          "
        >
          <CheckCircle2
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
            "
          />

          <span>
            {success}
          </span>
        </div>
      )}

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
            aria-labelledby="duplicate-template-title"
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
            "
          >
            {/* ===========================================
                MODAL HEADER
            =========================================== */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-slate-200
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
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <Copy className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    id="duplicate-template-title"
                    className="
                      font-bold
                      text-slate-950
                    "
                  >
                    Duplicate Template
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Create a reusable copy of this
                    template.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isPending}
                onClick={closeModal}
                aria-label="Close confirmation dialog"
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
                MODAL BODY
            =========================================== */}

            <div className="px-6 py-6">
              <div
                className="
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-blue-600
                  "
                >
                  Template to Duplicate
                </p>

                <p
                  className="
                    mt-2
                    break-words
                    font-bold
                    text-blue-950
                  "
                >
                  {templateName}
                </p>
              </div>

              <p
                className="
                  mt-5
                  text-sm
                  leading-6
                  text-slate-600
                "
              >
                A new copy of this template will
                be created. You can edit the copied
                version without changing the original
                template.
              </p>

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
                  <AlertCircle
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
                MODAL FOOTER
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
                  bg-orange-50
                  px-4
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
                disabled={isPending}
                onClick={handleDuplicate}
                className="
                  inline-flex
                  h-10
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

                    Duplicating...
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />

                    Duplicate Template
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