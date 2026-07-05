"use client"

import Link from "next/link"

import {
  useState,
  useTransition
} from "react"

import {
  CheckCircle2,
  ChevronDown,
  Eye,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  X,
  XCircle
} from "lucide-react"

import {
  LeadStatus
} from "@prisma/client"

import {
  changeLeadStatusAction,
  deleteLeadAction
} from "../actions"


// ============================================================
// TYPES
// ============================================================

type LeadActionsProps = {

  leadId: string

  leadName: string

  status: LeadStatus

  canEdit?: boolean

  canDelete?: boolean

  canChangeStatus?: boolean

  showView?: boolean

}


// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS: {
  value: LeadStatus
  label: string
}[] = [

  {
    value:
      LeadStatus.new,

    label:
      "New"
  },

  {
    value:
      LeadStatus.contacted,

    label:
      "Contacted"
  },

  {
    value:
      LeadStatus.estimate,

    label:
      "Estimate"
  },

  {
    value:
      LeadStatus.won,

    label:
      "Won"
  },

  {
    value:
      LeadStatus.lost,

    label:
      "Lost"
  },

  {
    value:
      LeadStatus.converted,

    label:
      "Converted"
  }

]


// ============================================================
// COMPONENT
// ============================================================

export default function LeadActions({
  leadId,
  leadName,
  status,
  canEdit = true,
  canDelete = true,
  canChangeStatus = true,
  showView = false
}: LeadActionsProps) {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [
    statusOpen,
    setStatusOpen
  ] =
    useState(false)


  const [
    deleteOpen,
    setDeleteOpen
  ] =
    useState(false)


  const [
    message,
    setMessage
  ] =
    useState<string | null>(
      null
    )


  const [
    isPending,
    startTransition
  ] =
    useTransition()


  // ----------------------------------------------------------
  // CHANGE STATUS
  // ----------------------------------------------------------

  function handleStatusChange(
    nextStatus: LeadStatus
  ) {

    if (
      nextStatus === status
    ) {

      setStatusOpen(false)

      return
    }


    setMessage(null)


    startTransition(
      async () => {

        const result =
          await changeLeadStatusAction(
            leadId,
            nextStatus
          )


        setMessage(
          result.message
        )


        if (result.success) {

          setStatusOpen(false)

        }

      }
    )

  }


  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  function handleDelete() {

    setMessage(null)


    startTransition(
      async () => {

        const result =
          await deleteLeadAction(
            leadId
          )


        /*
          Successful deletion redirects from the
          server action. This message is mainly
          relevant if the action returns an error.
        */

        if (result) {

          setMessage(
            result.message
          )

        }

      }
    )

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      <div className="space-y-3">

        {/* ================================================== */}
        {/* ACTION BUTTONS */}
        {/* ================================================== */}

        <div
          className="
            flex flex-wrap
            items-center gap-2
          "
        >

          {/* VIEW */}

          {showView && (

            <Link
              href={
                `/admin/data-entry/${leadId}`
              }
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-blue-50
                px-4
                text-sm font-medium
                text-blue-700
                transition
                hover:bg-blue-100
              "
            >
              <Eye className="h-4 w-4" />

              View
            </Link>

          )}


          {/* EDIT */}

          {canEdit && (

            <Link
              href={
                `/admin/data-entry/${leadId}/edit`
              }
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                text-sm font-medium
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
              "
            >
              <Pencil className="h-4 w-4" />

              Edit Lead
            </Link>

          )}


          {/* STATUS */}

          {canChangeStatus && (

            <button
              type="button"
              onClick={
                () =>
                  setStatusOpen(
                    true
                  )
              }
              disabled={
                isPending
              }
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-green-600
                px-4
                text-sm font-medium
                text-white
                shadow-sm
                transition
                hover:bg-green-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isPending ? (

                <Loader2
                  className="
                    h-4 w-4
                    animate-spin
                  "
                />

              ) : (

                <RefreshCw className="h-4 w-4" />

              )}

              Change Status

              <ChevronDown className="h-4 w-4" />
            </button>

          )}


          {/* DELETE */}

          {canDelete && (

            <button
              type="button"
              onClick={
                () =>
                  setDeleteOpen(
                    true
                  )
              }
              disabled={
                isPending
              }
              className="
                inline-flex h-10
                items-center justify-center
                gap-2
                rounded-lg
                bg-red-600
                px-4
                text-sm font-medium
                text-white
                shadow-sm
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Trash2 className="h-4 w-4" />

              Delete
            </button>

          )}

        </div>


        {/* ================================================== */}
        {/* ACTION MESSAGE */}
        {/* ================================================== */}

        {message && (

          <div
            className="
              flex items-start
              justify-between gap-3
              rounded-lg
              border border-blue-200
              bg-blue-50
              px-3 py-2.5
            "
          >

            <p
              className="
                text-sm
                text-blue-700
              "
            >
              {message}
            </p>


            <button
              type="button"
              onClick={
                () =>
                  setMessage(null)
              }
              className="
                shrink-0
                text-blue-500
                transition
                hover:text-blue-700
              "
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

        )}

      </div>


      {/* ==================================================== */}
      {/* STATUS MODAL */}
      {/* ==================================================== */}

      {statusOpen && (

        <ModalOverlay
          onClose={
            () => {

              if (!isPending) {

                setStatusOpen(
                  false
                )

              }

            }
          }
        >

          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div
              className="
                flex items-start
                justify-between gap-4
                border-b border-slate-200
                px-5 py-4
              "
            >

              <div
                className="
                  flex items-start gap-3
                "
              >

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-green-50
                    text-green-600
                  "
                >
                  <RefreshCw className="h-5 w-5" />
                </div>


                <div>

                  <h2
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    Change Lead Status
                  </h2>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    Update the workflow status for{" "}
                    <span
                      className="
                        font-medium
                        text-slate-700
                      "
                    >
                      {leadName}
                    </span>.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  () =>
                    setStatusOpen(
                      false
                    )
                }
                disabled={
                  isPending
                }
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-600
                "
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            {/* STATUS LIST */}

            <div
              className="
                space-y-2
                p-5
              "
            >

              {STATUS_OPTIONS.map(
                (option) => {

                  const active =
                    option.value ===
                    status


                  return (

                    <button
                      key={
                        option.value
                      }
                      type="button"
                      disabled={
                        active ||
                        isPending
                      }
                      onClick={
                        () =>
                          handleStatusChange(
                            option.value
                          )
                      }
                      className={`
                        flex w-full
                        items-center
                        justify-between gap-4
                        rounded-xl
                        border
                        px-4 py-3
                        text-left
                        transition
                        ${
                          active
                            ? "border-green-300 bg-green-50"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                        }
                        disabled:cursor-not-allowed
                      `}
                    >

                      <div
                        className="
                          flex items-center gap-3
                        "
                      >

                        <StatusIndicator
                          status={
                            option.value
                          }
                        />


                        <div>

                          <p
                            className={`
                              text-sm font-medium
                              ${
                                active
                                  ? "text-green-800"
                                  : "text-slate-800"
                              }
                            `}
                          >
                            {option.label}
                          </p>


                          <p
                            className="
                              mt-0.5
                              text-xs
                              text-slate-500
                            "
                          >
                            {
                              getStatusDescription(
                                option.value
                              )
                            }
                          </p>

                        </div>

                      </div>


                      {active && (

                        <span
                          className="
                            inline-flex
                            items-center gap-1
                            rounded-full
                            bg-green-100
                            px-2 py-1
                            text-xs font-medium
                            text-green-700
                          "
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />

                          Current
                        </span>

                      )}

                    </button>

                  )

                }
              )}

            </div>


            {/* FOOTER */}

            <div
              className="
                flex justify-end
                border-t border-slate-200
                bg-slate-50
                px-5 py-4
              "
            >

              <button
                type="button"
                onClick={
                  () =>
                    setStatusOpen(
                      false
                    )
                }
                disabled={
                  isPending
                }
                className="
                  inline-flex h-10
                  items-center justify-center
                  rounded-lg
                  bg-orange-100
                  px-4
                  text-sm font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-200
                  disabled:opacity-60
                "
              >
                Cancel
              </button>

            </div>

          </div>

        </ModalOverlay>

      )}


      {/* ==================================================== */}
      {/* DELETE MODAL */}
      {/* ==================================================== */}

      {deleteOpen && (

        <ModalOverlay
          onClose={
            () => {

              if (!isPending) {

                setDeleteOpen(
                  false
                )

              }

            }
          }
        >

          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            <div className="p-6">

              <div
                className="
                  flex h-12 w-12
                  items-center justify-center
                  rounded-xl
                  bg-red-50
                  text-red-600
                "
              >
                <Trash2 className="h-6 w-6" />
              </div>


              <h2
                className="
                  mt-4
                  text-lg font-semibold
                  text-slate-900
                "
              >
                Delete Lead?
              </h2>


              <p
                className="
                  mt-2
                  text-sm leading-6
                  text-slate-500
                "
              >
                You are about to permanently delete{" "}
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  {leadName}
                </span>.
                {" "}
                Associated notes and activity history
                will also be deleted.
              </p>


              <div
                className="
                  mt-4
                  flex items-start gap-3
                  rounded-lg
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                "
              >

                <XCircle
                  className="
                    mt-0.5
                    h-5 w-5
                    shrink-0
                    text-red-600
                  "
                />


                <p
                  className="
                    text-sm leading-6
                    text-red-700
                  "
                >
                  This action cannot be undone.
                </p>

              </div>

            </div>


            <div
              className="
                flex flex-col-reverse
                gap-3
                border-t border-slate-200
                bg-slate-50
                px-6 py-4
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={
                  () =>
                    setDeleteOpen(
                      false
                    )
                }
                disabled={
                  isPending
                }
                className="
                  inline-flex h-10
                  items-center justify-center
                  rounded-lg
                  bg-orange-100
                  px-4
                  text-sm font-medium
                  text-orange-700
                  transition
                  hover:bg-orange-200
                  disabled:opacity-60
                "
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleDelete
                }
                disabled={
                  isPending
                }
                className="
                  inline-flex h-10
                  items-center justify-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-4
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {isPending ? (

                  <>
                    <Loader2
                      className="
                        h-4 w-4
                        animate-spin
                      "
                    />

                    Deleting...
                  </>

                ) : (

                  <>
                    <Trash2 className="h-4 w-4" />

                    Delete Lead
                  </>

                )}

              </button>

            </div>

          </div>

        </ModalOverlay>

      )}

    </>
  )
}


// ============================================================
// MODAL OVERLAY
// ============================================================

function ModalOverlay({
  children,
  onClose
}: {
  children:
    React.ReactNode

  onClose:
    () => void
}) {

  return (
    <div
      className="
        fixed inset-0
        z-50
        flex items-center
        justify-center
        overflow-y-auto
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={
        (event) => {

          if (
            event.target ===
            event.currentTarget
          ) {

            onClose()

          }

        }
      }
    >
      {children}
    </div>
  )
}


// ============================================================
// STATUS INDICATOR
// ============================================================

function StatusIndicator({
  status
}: {
  status:
    LeadStatus
}) {

  const styles:
    Record<
      LeadStatus,
      string
    > = {

    new:
      "bg-blue-500",

    contacted:
      "bg-orange-500",

    estimate:
      "bg-violet-500",

    won:
      "bg-green-500",

    lost:
      "bg-red-500",

    converted:
      "bg-emerald-500"

  }


  return (
    <span
      className={`
        h-2.5 w-2.5
        shrink-0
        rounded-full
        ${styles[status]}
      `}
    />
  )
}


// ============================================================
// STATUS DESCRIPTION
// ============================================================

function getStatusDescription(
  status: LeadStatus
) {

  const descriptions:
    Record<
      LeadStatus,
      string
    > = {

    new:
      "Newly entered lead awaiting initial contact.",

    contacted:
      "Initial communication has been completed.",

    estimate:
      "An estimate or proposal is being prepared.",

    won:
      "The opportunity has been successfully won.",

    lost:
      "The opportunity was not successfully closed.",

    converted:
      "The lead has been converted into a customer."

  }


  return descriptions[
    status
  ]
}