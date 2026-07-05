"use client"

import Link from "next/link"

import {
  useState,
  useTransition
} from "react"

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  Loader2,
  RotateCcw,
  Trash2,
  X
} from "lucide-react"

import {
  SalaryStatus
} from "@prisma/client"

import {
  deletePayrollAction,
  markPayrollPaidAction,
  revertPayrollToPendingAction
} from "../actions"


// ============================================================
// TYPES
// ============================================================

type PayrollActionsProps = {
  payrollId: string

  employeeName: string

  status: SalaryStatus

  canEdit: boolean

  canDelete: boolean

  canManagePayment: boolean
}


// ============================================================
// STATUS LABELS
// ============================================================

const STATUS_LABELS: Record<
  SalaryStatus,
  string
> = {

  pending:
    "Pending",

  processed:
    "Processed",

  paid:
    "Paid",

  failed:
    "Failed"

}


// ============================================================
// COMPONENT
// ============================================================

export default function PayrollActions({
  payrollId,
  employeeName,
  status,
  canEdit,
  canDelete,
  canManagePayment
}: PayrollActionsProps) {

  const [
    paymentModalOpen,
    setPaymentModalOpen
  ] = useState(false)


  const [
    deleteModalOpen,
    setDeleteModalOpen
  ] = useState(false)


  const [
    revertModalOpen,
    setRevertModalOpen
  ] = useState(false)


  const [
    error,
    setError
  ] = useState<string | null>(
    null
  )


  const [
    isPending,
    startTransition
  ] = useTransition()


  // ==========================================================
  // PERMISSIONS
  // ==========================================================

  const canMarkPaid =
    canManagePayment &&
    status !== SalaryStatus.paid


  const canRevert =
    canManagePayment &&
    status !== SalaryStatus.pending


  const canDeleteRecord =
    canDelete &&
    status !== SalaryStatus.paid


  // ==========================================================
  // REVERT TO PENDING
  // ==========================================================

  function handleRevert() {

    setError(null)


    startTransition(
      async () => {

        try {

          await revertPayrollToPendingAction(
            payrollId
          )


          setRevertModalOpen(
            false
          )


        } catch (error) {

          console.error(
            "REVERT_PAYROLL_ERROR",
            error
          )


          setError(
            error instanceof Error
              ? error.message
              : "Unable to revert payroll status."
          )
        }

      }
    )
  }


  // ==========================================================
  // DELETE PAYROLL
  // ==========================================================

  function handleDelete() {

    setError(null)


    startTransition(
      async () => {

        try {

          await deletePayrollAction(
            payrollId
          )


        } catch (error) {

          console.error(
            "DELETE_PAYROLL_ERROR",
            error
          )


          setError(
            error instanceof Error
              ? error.message
              : "Unable to delete payroll record."
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

      <div
        className="
          flex flex-wrap
          items-center gap-2
        "
      >

        {/* ================================================== */}
        {/* EDIT */}
        {/* ================================================== */}

        {canEdit && (

          <Link
            href={
              `/admin/payroll/${payrollId}/edit`
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
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            <Edit3 className="h-4 w-4" />

            Edit
          </Link>

        )}


        {/* ================================================== */}
        {/* MARK PAID */}
        {/* ================================================== */}

        {canMarkPaid && (

          <button
            type="button"
            onClick={() => {

              setError(null)

              setPaymentModalOpen(
                true
              )

            }}
            disabled={isPending}
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
              disabled:bg-green-300
            "
          >
            <CheckCircle2 className="h-4 w-4" />

            Mark Paid
          </button>

        )}


        {/* ================================================== */}
        {/* REVERT */}
        {/* ================================================== */}

        {canRevert && (

          <button
            type="button"
            onClick={() => {

              setError(null)

              setRevertModalOpen(
                true
              )

            }}
            disabled={isPending}
            className="
              inline-flex h-10
              items-center justify-center
              gap-2
              rounded-lg
              bg-orange-500
              px-4
              text-sm font-medium
              text-white
              shadow-sm
              transition
              hover:bg-orange-600
              disabled:cursor-not-allowed
              disabled:bg-orange-300
            "
          >
            <RotateCcw className="h-4 w-4" />

            Revert
          </button>

        )}


        {/* ================================================== */}
        {/* DELETE */}
        {/* ================================================== */}

        {canDeleteRecord && (

          <button
            type="button"
            onClick={() => {

              setError(null)

              setDeleteModalOpen(
                true
              )

            }}
            disabled={isPending}
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
              disabled:bg-red-300
            "
          >
            <Trash2 className="h-4 w-4" />

            Delete
          </button>

        )}

      </div>


      {/* ==================================================== */}
      {/* PAYMENT MODAL */}
      {/* ==================================================== */}

      {paymentModalOpen && (

        <ModalOverlay>

          <div
            className="
              w-full max-w-lg
              overflow-hidden
              rounded-2xl
              border border-slate-200
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
                px-6 py-5
              "
            >

              <div
                className="
                  flex items-start gap-3
                "
              >

                <div
                  className="
                    flex h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                  "
                >
                  <Banknote className="h-5 w-5" />
                </div>


                <div>

                  <h2
                    className="
                      text-lg font-semibold
                      text-slate-900
                    "
                  >
                    Mark Payroll as Paid
                  </h2>


                  <p
                    className="
                      mt-1
                      text-sm leading-6
                      text-slate-500
                    "
                  >
                    Record payment information for{" "}
                    <span
                      className="
                        font-medium
                        text-slate-700
                      "
                    >
                      {employeeName}
                    </span>.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setPaymentModalOpen(
                    false
                  )
                }
                disabled={isPending}
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                  transition
                  hover:bg-slate-200
                  hover:text-slate-700
                "
              >
                <X className="h-4 w-4" />
              </button>

            </div>


            {/* FORM */}

            <form
              action={async (
                formData
              ) => {

                setError(null)


                startTransition(
                  async () => {

                    try {

                      await markPayrollPaidAction(
                        payrollId,
                        formData
                      )


                      setPaymentModalOpen(
                        false
                      )


                    } catch (error) {

                      console.error(
                        "MARK_PAYROLL_PAID_ERROR",
                        error
                      )


                      setError(
                        error instanceof Error
                          ? error.message
                          : "Unable to mark payroll as paid."
                      )
                    }

                  }
                )

              }}
            >

              <div
                className="
                  space-y-5
                  px-6 py-5
                "
              >

                {/* CURRENT STATUS */}

                <div
                  className="
                    rounded-xl
                    border border-blue-200
                    bg-blue-50
                    p-4
                  "
                >

                  <div
                    className="
                      flex items-center gap-3
                    "
                  >

                    <Clock3
                      className="
                        h-5 w-5
                        shrink-0
                        text-blue-600
                      "
                    />


                    <div>

                      <p
                        className="
                          text-xs font-medium
                          uppercase tracking-wide
                          text-blue-600
                        "
                      >
                        Current Status
                      </p>


                      <p
                        className="
                          mt-0.5
                          text-sm font-semibold
                          text-blue-900
                        "
                      >
                        {
                          STATUS_LABELS[
                            status
                          ]
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* PAYMENT DATE */}

                <ModalField
                  label="Payment Date"
                  htmlFor="paymentDate"
                >

                  <input
                    id="paymentDate"
                    name="paymentDate"
                    type="date"
                    disabled={isPending}
                    className={INPUT_CLASS}
                  />

                </ModalField>


                {/* PAYMENT METHOD */}

                <ModalField
                  label="Payment Method"
                  htmlFor="paymentMethod"
                >

                  <div className="relative">

                    <CreditCard
                      className="
                        pointer-events-none
                        absolute left-3 top-1/2
                        h-4 w-4
                        -translate-y-1/2
                        text-slate-400
                      "
                    />


                    <input
                      id="paymentMethod"
                      name="paymentMethod"
                      type="text"
                      placeholder="Bank transfer, UPI, cheque..."
                      maxLength={100}
                      disabled={isPending}
                      className={`
                        ${INPUT_CLASS}
                        pl-10
                      `}
                    />

                  </div>

                </ModalField>


                {/* TRANSACTION ID */}

                <ModalField
                  label="Transaction ID"
                  htmlFor="transactionId"
                >

                  <input
                    id="transactionId"
                    name="transactionId"
                    type="text"
                    placeholder="Payment reference number"
                    maxLength={200}
                    disabled={isPending}
                    className={INPUT_CLASS}
                  />

                </ModalField>


                {/* ERROR */}

                {error && (

                  <ErrorMessage
                    message={error}
                  />

                )}

              </div>


              {/* FOOTER */}

              <div
                className="
                  flex flex-col-reverse gap-3
                  border-t border-slate-200
                  bg-slate-50
                  px-6 py-4
                  sm:flex-row
                  sm:justify-end
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setPaymentModalOpen(
                      false
                    )
                  }
                  disabled={isPending}
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
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={isPending}
                  className="
                    inline-flex h-10
                    items-center justify-center
                    gap-2
                    rounded-lg
                    bg-green-600
                    px-4
                    text-sm font-medium
                    text-white
                    transition
                    hover:bg-green-700
                    disabled:cursor-not-allowed
                    disabled:bg-green-300
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

                      Saving...
                    </>

                  ) : (

                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      Confirm Payment
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </ModalOverlay>

      )}


      {/* ==================================================== */}
      {/* REVERT MODAL */}
      {/* ==================================================== */}

      {revertModalOpen && (

        <ModalOverlay>

          <ConfirmationModal
            title="Revert Payroll to Pending?"
            description={
              `This will change ${employeeName}'s payroll from ${STATUS_LABELS[status]} to Pending and remove the saved payment date, payment method, and transaction ID.`
            }
            icon={RotateCcw}
            iconClassName="
              bg-orange-50
              text-orange-600
            "
            error={error}
            pending={isPending}
            confirmLabel="Revert to Pending"
            pendingLabel="Reverting..."
            confirmClassName="
              bg-orange-500
              hover:bg-orange-600
              disabled:bg-orange-300
            "
            onCancel={() =>
              setRevertModalOpen(
                false
              )
            }
            onConfirm={
              handleRevert
            }
          />

        </ModalOverlay>

      )}


      {/* ==================================================== */}
      {/* DELETE MODAL */}
      {/* ==================================================== */}

      {deleteModalOpen && (

        <ModalOverlay>

          <ConfirmationModal
            title="Delete Payroll Record?"
            description={
              `This will permanently delete the payroll record for ${employeeName}. This action cannot be undone.`
            }
            icon={Trash2}
            iconClassName="
              bg-red-50
              text-red-600
            "
            error={error}
            pending={isPending}
            confirmLabel="Delete Payroll"
            pendingLabel="Deleting..."
            confirmClassName="
              bg-red-600
              hover:bg-red-700
              disabled:bg-red-300
            "
            onCancel={() =>
              setDeleteModalOpen(
                false
              )
            }
            onConfirm={
              handleDelete
            }
          />

        </ModalOverlay>

      )}

    </>
  )
}


// ============================================================
// MODAL OVERLAY
// ============================================================

function ModalOverlay({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        overflow-y-auto
        bg-slate-950/50
        p-4
        backdrop-blur-sm
      "
    >
      {children}
    </div>
  )
}


// ============================================================
// CONFIRMATION MODAL
// ============================================================

type ConfirmationModalProps = {
  title: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  iconClassName: string

  error: string | null

  pending: boolean

  confirmLabel: string

  pendingLabel: string

  confirmClassName: string

  onCancel: () => void

  onConfirm: () => void
}


function ConfirmationModal({
  title,
  description,
  icon: Icon,
  iconClassName,
  error,
  pending,
  confirmLabel,
  pendingLabel,
  confirmClassName,
  onCancel,
  onConfirm
}: ConfirmationModalProps) {

  return (
    <div
      className="
        w-full max-w-md
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-2xl
      "
    >

      <div className="p-6">

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className={`
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              ${iconClassName}
            `}
          >
            <Icon className="h-6 w-6" />
          </div>


          <div>

            <h2
              className="
                text-lg font-semibold
                text-slate-900
              "
            >
              {title}
            </h2>


            <p
              className="
                mt-2
                text-sm leading-6
                text-slate-600
              "
            >
              {description}
            </p>

          </div>

        </div>


        {error && (

          <div className="mt-5">

            <ErrorMessage
              message={error}
            />

          </div>

        )}

      </div>


      <div
        className="
          flex flex-col-reverse gap-3
          border-t border-slate-200
          bg-slate-50
          px-6 py-4
          sm:flex-row
          sm:justify-end
        "
      >

        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          Cancel
        </button>


        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
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
            ${confirmClassName}
          `}
        >

          {pending ? (

            <>
              <Loader2
                className="
                  h-4 w-4
                  animate-spin
                "
              />

              {pendingLabel}
            </>

          ) : (

            <>
              <AlertTriangle className="h-4 w-4" />

              {confirmLabel}
            </>

          )}

        </button>

      </div>

    </div>
  )
}


// ============================================================
// MODAL FIELD
// ============================================================

type ModalFieldProps = {
  label: string

  htmlFor: string

  children: React.ReactNode
}


function ModalField({
  label,
  htmlFor,
  children
}: ModalFieldProps) {

  return (
    <div>

      <label
        htmlFor={htmlFor}
        className="
          block
          text-sm font-medium
          text-slate-700
        "
      >
        {label}
      </label>


      <div className="mt-2">
        {children}
      </div>

    </div>
  )
}


// ============================================================
// ERROR MESSAGE
// ============================================================

function ErrorMessage({
  message
}: {
  message: string
}) {

  return (
    <div
      className="
        flex items-start gap-3
        rounded-xl
        border border-red-200
        bg-red-50
        p-4
      "
    >

      <AlertTriangle
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
        {message}
      </p>

    </div>
  )
}


// ============================================================
// INPUT CLASS
// ============================================================

const INPUT_CLASS = `
  h-11 w-full
  rounded-lg
  border border-slate-300
  bg-white
  px-3
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
  disabled:cursor-not-allowed
  disabled:bg-slate-50
  disabled:text-slate-500
`