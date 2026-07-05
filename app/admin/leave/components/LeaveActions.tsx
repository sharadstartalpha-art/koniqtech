"use client"

import {
  useState,
  useTransition
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  CheckCircle2,
  Edit3,
  Loader2,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  X,
  XCircle
} from "lucide-react"

import {
  LeaveStatus
} from "@prisma/client"

import {
  approveLeaveAction,
  cancelLeaveAction,
  deleteLeaveAction,
  rejectLeaveAction,
  resetLeaveToPendingAction
} from "../actions"


// ============================================================
// TYPES
// ============================================================

type LeaveActionsProps = {
  leaveId: string

  employeeName: string

  status: LeaveStatus

  canEdit: boolean

  canDelete: boolean

  canApprove: boolean

  canCancel: boolean
}


type DialogMode =
  | "approve"
  | "reject"
  | "cancel"
  | "reset"
  | "delete"
  | null


// ============================================================
// COMPONENT
// ============================================================

export default function LeaveActions({
  leaveId,
  employeeName,
  status,
  canEdit,
  canDelete,
  canApprove,
  canCancel
}: LeaveActionsProps) {

  const router =
    useRouter()


  const [
    isPending,
    startTransition
  ] = useTransition()


  const [
    menuOpen,
    setMenuOpen
  ] = useState(false)


  const [
    dialogMode,
    setDialogMode
  ] = useState<DialogMode>(
    null
  )


  const [
    remarks,
    setRemarks
  ] = useState("")


  const [
    error,
    setError
  ] = useState("")


  // ----------------------------------------------------------
  // STATUS PERMISSIONS
  // ----------------------------------------------------------

  const canDecision =
    canApprove &&
    status === LeaveStatus.pending


  const canReset =
    canApprove &&
    status !== LeaveStatus.pending


  const canEditRecord =
    canEdit &&
    status !== LeaveStatus.cancelled


  const canCancelRecord =
    canCancel &&
    status !== LeaveStatus.cancelled


  // ----------------------------------------------------------
  // OPEN DIALOG
  // ----------------------------------------------------------

  function openDialog(
    mode: Exclude<
      DialogMode,
      null
    >
  ) {

    setMenuOpen(false)

    setRemarks("")

    setError("")

    setDialogMode(mode)
  }


  // ----------------------------------------------------------
  // CLOSE DIALOG
  // ----------------------------------------------------------

  function closeDialog() {

    if (isPending) {
      return
    }


    setDialogMode(null)

    setRemarks("")

    setError("")
  }


  // ----------------------------------------------------------
  // EDIT
  // ----------------------------------------------------------

  function handleEdit() {

    setMenuOpen(false)

    router.push(
      `/admin/leave/${leaveId}/edit`
    )
  }


  // ----------------------------------------------------------
  // CONFIRM ACTION
  // ----------------------------------------------------------

  function handleConfirm() {

    if (!dialogMode) {
      return
    }


    if (
      dialogMode === "reject" &&
      !remarks.trim()
    ) {

      setError(
        "Please enter the reason for rejection."
      )

      return
    }


    setError("")


    startTransition(
      async () => {

        let response


        switch (dialogMode) {

          case "approve":

            response =
              await approveLeaveAction(
                leaveId,
                remarks
              )

            break


          case "reject":

            response =
              await rejectLeaveAction(
                leaveId,
                remarks
              )

            break


          case "cancel":

            response =
              await cancelLeaveAction(
                leaveId
              )

            break


          case "reset":

            response =
              await resetLeaveToPendingAction(
                leaveId
              )

            break


          case "delete":

            response =
              await deleteLeaveAction(
                leaveId
              )

            break


          default:

            return
        }


        if (!response.success) {

          setError(
            response.message
          )

          return
        }


        setDialogMode(null)

        setRemarks("")

        setError("")


        if (
          dialogMode === "delete"
        ) {

          router.push(
            "/admin/leave"
          )

          router.refresh()

          return
        }


        router.refresh()
      }
    )
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      <div
        className="
          flex flex-wrap
          items-center gap-2
        "
      >

        {/* ================================================== */}
        {/* PENDING DECISION BUTTONS */}
        {/* ================================================== */}

        {canDecision && (

          <>

            <button
              type="button"
              onClick={
                () =>
                  openDialog(
                    "approve"
                  )
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
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                focus:ring-offset-2
              "
            >
              <CheckCircle2 className="h-4 w-4" />

              Approve
            </button>


            <button
              type="button"
              onClick={
                () =>
                  openDialog(
                    "reject"
                  )
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
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
                focus:ring-offset-2
              "
            >
              <XCircle className="h-4 w-4" />

              Reject
            </button>

          </>

        )}


        {/* ================================================== */}
        {/* EDIT */}
        {/* ================================================== */}

        {canEditRecord && (

          <button
            type="button"
            onClick={handleEdit}
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
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Edit3 className="h-4 w-4" />

            Edit
          </button>

        )}


        {/* ================================================== */}
        {/* MORE ACTIONS */}
        {/* ================================================== */}

        {(
          canCancelRecord ||
          canReset ||
          canDelete
        ) && (

          <div className="relative">

            <button
              type="button"
              onClick={
                () =>
                  setMenuOpen(
                    (current) =>
                      !current
                  )
              }
              aria-label="More leave actions"
              aria-expanded={menuOpen}
              className="
                inline-flex h-10 w-10
                items-center justify-center
                rounded-lg
                border border-slate-300
                bg-white
                text-slate-600
                transition
                hover:bg-slate-50
                hover:text-slate-900
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:ring-offset-2
              "
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>


            {menuOpen && (

              <div
                className="
                  absolute right-0 z-30
                  mt-2 w-56
                  overflow-hidden
                  rounded-xl
                  border border-slate-200
                  bg-white
                  py-1
                  shadow-lg
                "
              >

                {/* CANCEL */}

                {canCancelRecord && (

                  <MenuButton
                    label="Cancel Leave"
                    description="Mark this request as cancelled"
                    icon={X}
                    className="
                      text-orange-700
                      hover:bg-orange-50
                    "
                    iconClassName="
                      text-orange-600
                    "
                    onClick={
                      () =>
                        openDialog(
                          "cancel"
                        )
                    }
                  />

                )}


                {/* RESET */}

                {canReset && (

                  <MenuButton
                    label="Reset to Pending"
                    description="Clear the current decision"
                    icon={RotateCcw}
                    className="
                      text-blue-700
                      hover:bg-blue-50
                    "
                    iconClassName="
                      text-blue-600
                    "
                    onClick={
                      () =>
                        openDialog(
                          "reset"
                        )
                    }
                  />

                )}


                {/* DELETE */}

                {canDelete && (

                  <>

                    {(
                      canCancelRecord ||
                      canReset
                    ) && (

                      <div
                        className="
                          my-1
                          border-t
                          border-slate-100
                        "
                      />

                    )}


                    <MenuButton
                      label="Delete Request"
                      description="Permanently remove this record"
                      icon={Trash2}
                      className="
                        text-red-700
                        hover:bg-red-50
                      "
                      iconClassName="
                        text-red-600
                      "
                      onClick={
                        () =>
                          openDialog(
                            "delete"
                          )
                      }
                    />

                  </>

                )}

              </div>

            )}

          </div>

        )}

      </div>


      {/* ==================================================== */}
      {/* MODAL */}
      {/* ==================================================== */}

      {dialogMode && (

        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/40
            p-4
            backdrop-blur-[1px]
          "
          onMouseDown={
            (event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closeDialog()
              }
            }
          }
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-action-title"
            className="
              w-full max-w-lg
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-2xl
            "
          >

            {/* ============================================== */}
            {/* MODAL HEADER */}
            {/* ============================================== */}

            <div
              className="
                flex items-start
                justify-between
                gap-4
                border-b
                border-slate-200
                px-5 py-4
              "
            >

              <div
                className="
                  flex items-start gap-3
                "
              >

                <DialogIcon
                  mode={dialogMode}
                />


                <div>

                  <h2
                    id="leave-action-title"
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    {
                      getDialogTitle(
                        dialogMode
                      )
                    }
                  </h2>


                  <p
                    className="
                      mt-1
                      text-sm
                      leading-5
                      text-slate-500
                    "
                  >
                    {
                      getDialogDescription(
                        dialogMode,
                        employeeName
                      )
                    }
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                aria-label="Close dialog"
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            {/* ============================================== */}
            {/* MODAL CONTENT */}
            {/* ============================================== */}

            <div className="px-5 py-5">

              {/* APPROVAL REMARKS */}

              {dialogMode ===
                "approve" && (

                <div>

                  <label
                    htmlFor="approval-remarks"
                    className="
                      mb-2 block
                      text-sm font-medium
                      text-slate-700
                    "
                  >
                    Manager Remarks
                    <span
                      className="
                        ml-1
                        font-normal
                        text-slate-400
                      "
                    >
                      (optional)
                    </span>
                  </label>


                  <textarea
                    id="approval-remarks"
                    value={remarks}
                    onChange={
                      (event) =>
                        setRemarks(
                          event.target.value
                        )
                    }
                    rows={4}
                    maxLength={2000}
                    disabled={isPending}
                    placeholder="Add an optional approval note..."
                    className="
                      min-h-[110px]
                      w-full resize-y
                      rounded-lg
                      border border-slate-300
                      bg-white
                      px-3 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-green-500
                      focus:ring-2
                      focus:ring-green-100
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                    "
                  />

                </div>

              )}


              {/* REJECTION REMARKS */}

              {dialogMode ===
                "reject" && (

                <div>

                  <label
                    htmlFor="rejection-remarks"
                    className="
                      mb-2 block
                      text-sm font-medium
                      text-slate-700
                    "
                  >
                    Rejection Reason

                    <span
                      className="
                        ml-1
                        text-red-500
                      "
                    >
                      *
                    </span>
                  </label>


                  <textarea
                    id="rejection-remarks"
                    value={remarks}
                    onChange={
                      (event) =>
                        setRemarks(
                          event.target.value
                        )
                    }
                    rows={4}
                    maxLength={2000}
                    disabled={isPending}
                    placeholder="Explain why this leave request is being rejected..."
                    className={`
                      min-h-[110px]
                      w-full resize-y
                      rounded-lg
                      border
                      bg-white
                      px-3 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      disabled:cursor-not-allowed
                      disabled:bg-slate-50
                      ${
                        error
                          ? `
                            border-red-300
                            focus:border-red-500
                            focus:ring-2
                            focus:ring-red-100
                          `
                          : `
                            border-slate-300
                            focus:border-red-500
                            focus:ring-2
                            focus:ring-red-100
                          `
                      }
                    `}
                  />

                </div>

              )}


              {/* CANCEL WARNING */}

              {dialogMode ===
                "cancel" && (

                <WarningBox
                  tone="orange"
                  title="Cancellation will update the request status"
                >
                  The leave request will remain in
                  the system for reporting and audit
                  history, but its status will be
                  changed to cancelled.
                </WarningBox>

              )}


              {/* RESET WARNING */}

              {dialogMode ===
                "reset" && (

                <WarningBox
                  tone="blue"
                  title="The existing decision will be cleared"
                >
                  Approval information, cancellation
                  information, and manager remarks
                  will be cleared. The request will
                  return to pending review.
                </WarningBox>

              )}


              {/* DELETE WARNING */}

              {dialogMode ===
                "delete" && (

                <WarningBox
                  tone="red"
                  title="This action cannot be undone"
                >
                  The leave request for{" "}
                  <span className="font-semibold">
                    {employeeName}
                  </span>{" "}
                  will be permanently deleted from
                  the database.
                </WarningBox>

              )}


              {/* ERROR */}

              {error && (

                <div
                  className="
                    mt-4
                    rounded-lg
                    border border-red-200
                    bg-red-50
                    px-3 py-2.5
                  "
                >
                  <p
                    className="
                      text-sm
                      text-red-700
                    "
                  >
                    {error}
                  </p>
                </div>

              )}

            </div>


            {/* ============================================== */}
            {/* MODAL ACTIONS */}
            {/* ============================================== */}

            <div
              className="
                flex flex-col-reverse
                gap-2
                border-t
                border-slate-200
                bg-slate-50/70
                px-5 py-4
                sm:flex-row
                sm:justify-end
              "
            >

              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className="
                  inline-flex h-10
                  items-center justify-center
                  rounded-lg
                  border border-slate-300
                  bg-white
                  px-4
                  text-sm font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Close
              </button>


              <button
                type="button"
                onClick={handleConfirm}
                disabled={
                  isPending ||
                  (
                    dialogMode ===
                      "reject" &&
                    !remarks.trim()
                  )
                }
                className={`
                  inline-flex h-10
                  items-center justify-center
                  gap-2
                  rounded-lg
                  px-4
                  text-sm font-medium
                  text-white
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  ${
                    getConfirmButtonClass(
                      dialogMode
                    )
                  }
                `}
              >

                {isPending ? (

                  <>
                    <Loader2
                      className="
                        h-4 w-4
                        animate-spin
                      "
                    />

                    Processing...
                  </>

                ) : (

                  <>
                    {
                      getConfirmIcon(
                        dialogMode
                      )
                    }

                    {
                      getConfirmLabel(
                        dialogMode
                      )
                    }
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


// ============================================================
// MENU BUTTON
// ============================================================

type MenuButtonProps = {
  label: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  className: string

  iconClassName: string

  onClick: () => void
}


function MenuButton({
  label,
  description,
  icon: Icon,
  className,
  iconClassName,
  onClick
}: MenuButtonProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full
        items-start gap-3
        px-3 py-2.5
        text-left
        transition
        ${className}
      `}
    >

      <Icon
        className={`
          mt-0.5
          h-4 w-4
          shrink-0
          ${iconClassName}
        `}
      />


      <span>

        <span
          className="
            block
            text-sm font-medium
          "
        >
          {label}
        </span>


        <span
          className="
            mt-0.5 block
            text-xs
            text-slate-500
          "
        >
          {description}
        </span>

      </span>

    </button>
  )
}


// ============================================================
// DIALOG ICON
// ============================================================

function DialogIcon({
  mode
}: {
  mode: Exclude<
    DialogMode,
    null
  >
}) {

  if (mode === "approve") {

    return (
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
        <CheckCircle2 className="h-5 w-5" />
      </div>
    )
  }


  if (
    mode === "reject" ||
    mode === "delete"
  ) {

    return (
      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          bg-red-50
          text-red-600
        "
      >
        {mode === "delete" ? (
          <Trash2 className="h-5 w-5" />
        ) : (
          <XCircle className="h-5 w-5" />
        )}
      </div>
    )
  }


  if (mode === "cancel") {

    return (
      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-lg
          bg-orange-50
          text-orange-600
        "
      >
        <X className="h-5 w-5" />
      </div>
    )
  }


  return (
    <div
      className="
        flex h-10 w-10
        shrink-0
        items-center justify-center
        rounded-lg
        bg-blue-50
        text-blue-600
      "
    >
      <RotateCcw className="h-5 w-5" />
    </div>
  )
}


// ============================================================
// WARNING BOX
// ============================================================

type WarningBoxProps = {
  tone:
    | "orange"
    | "blue"
    | "red"

  title: string

  children: React.ReactNode
}


function WarningBox({
  tone,
  title,
  children
}: WarningBoxProps) {

  const styles = {

    orange:
      "border-orange-200 bg-orange-50 text-orange-800",

    blue:
      "border-blue-200 bg-blue-50 text-blue-800",

    red:
      "border-red-200 bg-red-50 text-red-800"

  }


  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        ${styles[tone]}
      `}
    >

      <p
        className="
          text-sm font-semibold
        "
      >
        {title}
      </p>


      <div
        className="
          mt-1.5
          text-sm leading-6
          opacity-90
        "
      >
        {children}
      </div>

    </div>
  )
}


// ============================================================
// DIALOG TEXT HELPERS
// ============================================================

function getDialogTitle(
  mode: Exclude<
    DialogMode,
    null
  >
) {

  switch (mode) {

    case "approve":
      return "Approve Leave Request"

    case "reject":
      return "Reject Leave Request"

    case "cancel":
      return "Cancel Leave Request"

    case "reset":
      return "Reset Leave Decision"

    case "delete":
      return "Delete Leave Request"
  }
}


function getDialogDescription(
  mode: Exclude<
    DialogMode,
    null
  >,
  employeeName: string
) {

  switch (mode) {

    case "approve":
      return `Approve the leave request for ${employeeName}.`

    case "reject":
      return `Reject the leave request for ${employeeName}.`

    case "cancel":
      return `Cancel the leave request for ${employeeName}.`

    case "reset":
      return `Return ${employeeName}'s leave request to pending review.`

    case "delete":
      return `Permanently delete ${employeeName}'s leave request.`
  }
}


// ============================================================
// CONFIRM BUTTON HELPERS
// ============================================================

function getConfirmButtonClass(
  mode: Exclude<
    DialogMode,
    null
  >
) {

  switch (mode) {

    case "approve":
      return "bg-green-600 hover:bg-green-700"

    case "reject":
      return "bg-red-600 hover:bg-red-700"

    case "cancel":
      return "bg-orange-600 hover:bg-orange-700"

    case "reset":
      return "bg-blue-600 hover:bg-blue-700"

    case "delete":
      return "bg-red-600 hover:bg-red-700"
  }
}


function getConfirmLabel(
  mode: Exclude<
    DialogMode,
    null
  >
) {

  switch (mode) {

    case "approve":
      return "Approve Leave"

    case "reject":
      return "Reject Leave"

    case "cancel":
      return "Cancel Leave"

    case "reset":
      return "Reset to Pending"

    case "delete":
      return "Delete Request"
  }
}


function getConfirmIcon(
  mode: Exclude<
    DialogMode,
    null
  >
) {

  switch (mode) {

    case "approve":

      return (
        <CheckCircle2 className="h-4 w-4" />
      )


    case "reject":

      return (
        <XCircle className="h-4 w-4" />
      )


    case "cancel":

      return (
        <X className="h-4 w-4" />
      )


    case "reset":

      return (
        <RotateCcw className="h-4 w-4" />
      )


    case "delete":

      return (
        <Trash2 className="h-4 w-4" />
      )
  }
}