"use client"

import {
  useActionState,
  useMemo
} from "react"

import Link from "next/link"

import {
  Calculator,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  Landmark,
  Loader2,
  ReceiptText,
  UserRound,
  WalletCards
} from "lucide-react"

import {
  SalaryStatus,
  SalaryType
} from "@prisma/client"

import type {
  PayrollActionState
} from "../actions"


// ============================================================
// TYPES
// ============================================================

export type PayrollEmployeeOption = {
  id: string

  name: string

  email: string

  employeeCode: string

  designation?: string | null

  departmentName?: string | null
}


export type PayrollFormValues = {
  employeeId: string

  salaryType: SalaryType

  basicSalary: string

  hra: string

  allowance: string

  bonus: string

  incentive: string

  overtime: string

  deductions: string

  tax: string

  payMonth: number

  payYear: number

  paymentDate: string

  paymentMethod: string

  transactionId: string

  status: SalaryStatus

  remarks: string
}


type PayrollFormProps = {
  mode: "create" | "edit"

  employees: PayrollEmployeeOption[]

  initialValues?: PayrollFormValues

  action: (
    previousState: PayrollActionState,
    formData: FormData
  ) => Promise<PayrollActionState>
}


// ============================================================
// INITIAL ACTION STATE
// ============================================================

const INITIAL_STATE: PayrollActionState = {
  success: false,

  message: "",

  errors: {}
}


// ============================================================
// MONTHS
// ============================================================

const MONTHS = [
  {
    value: 1,
    label: "January"
  },
  {
    value: 2,
    label: "February"
  },
  {
    value: 3,
    label: "March"
  },
  {
    value: 4,
    label: "April"
  },
  {
    value: 5,
    label: "May"
  },
  {
    value: 6,
    label: "June"
  },
  {
    value: 7,
    label: "July"
  },
  {
    value: 8,
    label: "August"
  },
  {
    value: 9,
    label: "September"
  },
  {
    value: 10,
    label: "October"
  },
  {
    value: 11,
    label: "November"
  },
  {
    value: 12,
    label: "December"
  }
]


// ============================================================
// SALARY TYPE LABELS
// ============================================================

function formatEnumLabel(
  value: string
) {

  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
}


// ============================================================
// CURRENCY FORMATTER
// ============================================================

function formatCurrency(
  value: number
) {

  return new Intl.NumberFormat(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2
    }
  ).format(
    Number.isFinite(value)
      ? value
      : 0
  )
}


// ============================================================
// NUMBER PARSER
// ============================================================

function parseAmount(
  value: FormDataEntryValue | null
) {

  if (
    typeof value !== "string"
  ) {
    return 0
  }


  const normalized =
    value
      .replace(/,/g, "")
      .trim()


  const parsed =
    Number(normalized)


  if (
    !Number.isFinite(parsed)
  ) {
    return 0
  }


  return parsed
}


// ============================================================
// DEFAULT VALUES
// ============================================================

function getDefaultValues():
  PayrollFormValues {

  const now =
    new Date()


  return {

    employeeId:
      "",

    salaryType:
      Object.values(
        SalaryType
      )[0],

    basicSalary:
      "",

    hra:
      "0",

    allowance:
      "0",

    bonus:
      "0",

    incentive:
      "0",

    overtime:
      "0",

    deductions:
      "0",

    tax:
      "0",

    payMonth:
      now.getMonth() + 1,

    payYear:
      now.getFullYear(),

    paymentDate:
      "",

    paymentMethod:
      "",

    transactionId:
      "",

    status:
      SalaryStatus.pending,

    remarks:
      ""

  }
}


// ============================================================
// COMPONENT
// ============================================================

export default function PayrollForm({
  mode,
  employees,
  initialValues,
  action
}: PayrollFormProps) {

  const values =
    initialValues ??
    getDefaultValues()


  const [
    state,
    formAction,
    pending
  ] = useActionState(
    action,
    INITIAL_STATE
  )


  // ----------------------------------------------------------
  // FORM CALCULATION
  // ----------------------------------------------------------

  const calculationId =
    useMemo(
      () =>
        `payroll-calculation-${mode}`,
      [mode]
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      action={formAction}
      className="space-y-6"
    >

      {/* ==================================================== */}
      {/* ACTION ERROR */}
      {/* ==================================================== */}

      {state.message && !state.success && (

        <div
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm
            text-red-700
          "
        >
          {state.message}
        </div>

      )}


      {/* ==================================================== */}
      {/* EMPLOYEE AND PERIOD */}
      {/* ==================================================== */}

      <FormSection
        title="Employee & Pay Period"
        description="Select the employee, salary structure, and payroll period."
        icon={UserRound}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          {/* ================================================= */}
          {/* EMPLOYEE */}
          {/* ================================================= */}

          <FormField
            label="Employee"
            htmlFor="employeeId"
            required
            error={
              state.errors
                ?.employeeId
            }
          >

            <select
              id="employeeId"
              name="employeeId"
              defaultValue={
                values.employeeId
              }
              disabled={
                pending ||
                mode === "edit"
              }
              required
              className={getInputClass(
                Boolean(
                  state.errors
                    ?.employeeId
                )
              )}
            >

              <option value="">
                Select employee
              </option>


              {employees.map(
                (employee) => (

                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name}
                    {" — "}
                    {employee.employeeCode}
                    {employee.departmentName
                      ? ` — ${employee.departmentName}`
                      : ""}
                  </option>

                )
              )}

            </select>


            {/* Disabled controls are not submitted */}

            {mode === "edit" && (

              <input
                type="hidden"
                name="employeeId"
                value={
                  values.employeeId
                }
              />

            )}

          </FormField>


          {/* ================================================= */}
          {/* SALARY TYPE */}
          {/* ================================================= */}

          <FormField
            label="Salary Type"
            htmlFor="salaryType"
            required
            error={
              state.errors
                ?.salaryType
            }
          >

            <select
              id="salaryType"
              name="salaryType"
              defaultValue={
                values.salaryType
              }
              disabled={pending}
              required
              className={getInputClass(
                Boolean(
                  state.errors
                    ?.salaryType
                )
              )}
            >

              {Object.values(
                SalaryType
              ).map(
                (salaryType) => (

                  <option
                    key={salaryType}
                    value={salaryType}
                  >
                    {
                      formatEnumLabel(
                        salaryType
                      )
                    }
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* ================================================= */}
          {/* PAY MONTH */}
          {/* ================================================= */}

          <FormField
            label="Pay Month"
            htmlFor="payMonth"
            required
            error={
              state.errors
                ?.payMonth
            }
          >

            <select
              id="payMonth"
              name="payMonth"
              defaultValue={
                String(
                  values.payMonth
                )
              }
              disabled={pending}
              required
              className={getInputClass(
                Boolean(
                  state.errors
                    ?.payMonth
                )
              )}
            >

              {MONTHS.map(
                (month) => (

                  <option
                    key={month.value}
                    value={month.value}
                  >
                    {month.label}
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* ================================================= */}
          {/* PAY YEAR */}
          {/* ================================================= */}

          <FormField
            label="Pay Year"
            htmlFor="payYear"
            required
            error={
              state.errors
                ?.payYear
            }
          >

            <input
              id="payYear"
              name="payYear"
              type="number"
              min={2000}
              max={2200}
              step={1}
              defaultValue={
                values.payYear
              }
              disabled={pending}
              required
              className={getInputClass(
                Boolean(
                  state.errors
                    ?.payYear
                )
              )}
            />

          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* EARNINGS */}
      {/* ==================================================== */}

      <FormSection
        title="Salary Earnings"
        description="Enter the employee's base salary and all earnings components."
        icon={CircleDollarSign}
      >

        <div
          className="
            grid gap-5
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          <AmountField
            name="basicSalary"
            label="Basic Salary"
            defaultValue={
              values.basicSalary
            }
            required
            pending={pending}
            error={
              state.errors
                ?.basicSalary
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="hra"
            label="HRA"
            defaultValue={
              values.hra
            }
            pending={pending}
            error={
              state.errors
                ?.hra
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="allowance"
            label="Allowance"
            defaultValue={
              values.allowance
            }
            pending={pending}
            error={
              state.errors
                ?.allowance
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="bonus"
            label="Bonus"
            defaultValue={
              values.bonus
            }
            pending={pending}
            error={
              state.errors
                ?.bonus
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="incentive"
            label="Incentive"
            defaultValue={
              values.incentive
            }
            pending={pending}
            error={
              state.errors
                ?.incentive
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="overtime"
            label="Overtime"
            defaultValue={
              values.overtime
            }
            pending={pending}
            error={
              state.errors
                ?.overtime
            }
            calculationId={
              calculationId
            }
          />

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* DEDUCTIONS */}
      {/* ==================================================== */}

      <FormSection
        title="Deductions & Tax"
        description="Enter deductions and applicable tax amounts for this payroll period."
        icon={ReceiptText}
      >

        <div
          className="
            grid gap-5
            sm:grid-cols-2
          "
        >

          <AmountField
            name="deductions"
            label="Other Deductions"
            defaultValue={
              values.deductions
            }
            pending={pending}
            error={
              state.errors
                ?.deductions
            }
            calculationId={
              calculationId
            }
          />


          <AmountField
            name="tax"
            label="Tax"
            defaultValue={
              values.tax
            }
            pending={pending}
            error={
              state.errors
                ?.tax
            }
            calculationId={
              calculationId
            }
          />

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* LIVE CALCULATION */}
      {/* ==================================================== */}

      <PayrollCalculation
        calculationId={
          calculationId
        }
        initialValues={
          values
        }
      />


      {/* ==================================================== */}
      {/* PAYMENT INFORMATION */}
      {/* ==================================================== */}

      <FormSection
        title="Payment Information"
        description="Set payroll status and optional payment transaction details."
        icon={CreditCard}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          {/* STATUS */}

          <FormField
            label="Payroll Status"
            htmlFor="status"
            required
            error={
              state.errors
                ?.status
            }
          >

            <select
              id="status"
              name="status"
              defaultValue={
                values.status
              }
              disabled={pending}
              required
              className={getInputClass(
                Boolean(
                  state.errors
                    ?.status
                )
              )}
            >

              {Object.values(
                SalaryStatus
              ).map(
                (status) => (

                  <option
                    key={status}
                    value={status}
                  >
                    {
                      formatEnumLabel(
                        status
                      )
                    }
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* PAYMENT DATE */}

          <FormField
            label="Payment Date"
            htmlFor="paymentDate"
            error={
              state.errors
                ?.paymentDate
            }
          >

            <div className="relative">

              <CalendarDays
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="paymentDate"
                name="paymentDate"
                type="date"
                defaultValue={
                  values.paymentDate
                }
                disabled={pending}
                className={`
                  ${getInputClass(
                    Boolean(
                      state.errors
                        ?.paymentDate
                    )
                  )}
                  pl-10
                `}
              />

            </div>

          </FormField>


          {/* PAYMENT METHOD */}

          <FormField
            label="Payment Method"
            htmlFor="paymentMethod"
            error={
              state.errors
                ?.paymentMethod
            }
          >

            <div className="relative">

              <Landmark
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
                defaultValue={
                  values.paymentMethod
                }
                disabled={pending}
                placeholder="Bank transfer, UPI, cheque..."
                maxLength={100}
                className={`
                  ${getInputClass(
                    Boolean(
                      state.errors
                        ?.paymentMethod
                    )
                  )}
                  pl-10
                `}
              />

            </div>

          </FormField>


          {/* TRANSACTION ID */}

          <FormField
            label="Transaction ID"
            htmlFor="transactionId"
            error={
              state.errors
                ?.transactionId
            }
          >

            <div className="relative">

              <WalletCards
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="transactionId"
                name="transactionId"
                type="text"
                defaultValue={
                  values.transactionId
                }
                disabled={pending}
                placeholder="Payment reference or transaction ID"
                maxLength={200}
                className={`
                  ${getInputClass(
                    Boolean(
                      state.errors
                        ?.transactionId
                    )
                  )}
                  pl-10
                `}
              />

            </div>

          </FormField>

        </div>


        {/* ================================================== */}
        {/* REMARKS */}
        {/* ================================================== */}

        <div className="mt-5">

          <FormField
            label="Remarks"
            htmlFor="remarks"
            error={
              state.errors
                ?.remarks
            }
          >

            <textarea
              id="remarks"
              name="remarks"
              rows={4}
              defaultValue={
                values.remarks
              }
              disabled={pending}
              placeholder="Add payroll notes or internal remarks..."
              maxLength={2000}
              className={`
                ${getInputClass(
                  Boolean(
                    state.errors
                      ?.remarks
                  )
                )}
                min-h-28 py-3
              `}
            />

          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* FORM ERROR */}
      {/* ==================================================== */}

      {state.errors?.form && (

        <div
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm
            text-red-700
          "
        >
          {state.errors.form}
        </div>

      )}


      {/* ==================================================== */}
      {/* FORM ACTIONS */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col-reverse gap-3
          rounded-xl
          border border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >

        <Link
          href="/admin/payroll"
          className="
            inline-flex h-11
            items-center justify-center
            rounded-lg
            border border-orange-200
            bg-orange-50
            px-5
            text-sm font-medium
            text-orange-700
            transition
            hover:bg-orange-100
          "
        >
          Cancel
        </Link>


        <button
          type="submit"
          disabled={pending}
          className="
            inline-flex h-11
            items-center justify-center
            gap-2
            rounded-lg
            bg-green-600
            px-5
            text-sm font-medium
            text-white
            shadow-sm
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:bg-green-300
          "
        >

          {pending ? (

            <>
              <Loader2
                className="
                  h-4 w-4
                  animate-spin
                "
              />

              {mode === "create"
                ? "Creating Payroll..."
                : "Saving Changes..."}
            </>

          ) : (

            <>
              <CircleDollarSign className="h-4 w-4" />

              {mode === "create"
                ? "Create Payroll"
                : "Save Changes"}
            </>

          )}

        </button>

      </div>

    </form>
  )
}


// ============================================================
// LIVE PAYROLL CALCULATION
// ============================================================

type PayrollCalculationProps = {
  calculationId: string

  initialValues: PayrollFormValues
}


function PayrollCalculation({
  calculationId,
  initialValues
}: PayrollCalculationProps) {

  const initialGross =
    parseNumericString(
      initialValues.basicSalary
    ) +
    parseNumericString(
      initialValues.hra
    ) +
    parseNumericString(
      initialValues.allowance
    ) +
    parseNumericString(
      initialValues.bonus
    ) +
    parseNumericString(
      initialValues.incentive
    ) +
    parseNumericString(
      initialValues.overtime
    )


  const initialDeductions =
    parseNumericString(
      initialValues.deductions
    ) +
    parseNumericString(
      initialValues.tax
    )


  const initialNet =
    initialGross -
    initialDeductions


  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border border-blue-200
        bg-blue-50
      "
    >

      <div
        className="
          flex items-start gap-3
          border-b border-blue-200
          px-5 py-4
        "
      >

        <div
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-lg
            bg-blue-100
            text-blue-700
          "
        >
          <Calculator className="h-5 w-5" />
        </div>


        <div>

          <h2
            className="
              font-semibold
              text-blue-950
            "
          >
            Salary Calculation
          </h2>


          <p
            className="
              mt-0.5
              text-sm
              text-blue-700
            "
          >
            Live payroll estimate. Final net salary
            is recalculated securely on the server.
          </p>

        </div>

      </div>


      <div
        className="
          grid gap-4
          p-5
          md:grid-cols-3
        "
        id={calculationId}
        data-payroll-calculator
      >

        <CalculationCard
          label="Gross Earnings"
          value={
            formatCurrency(
              initialGross
            )
          }
          valueId={
            `${calculationId}-gross`
          }
        />


        <CalculationCard
          label="Total Deductions"
          value={
            formatCurrency(
              initialDeductions
            )
          }
          valueId={
            `${calculationId}-deductions`
          }
        />


        <CalculationCard
          label="Estimated Net Salary"
          value={
            formatCurrency(
              initialNet
            )
          }
          valueId={
            `${calculationId}-net`
          }
          highlighted
        />

      </div>


      {/* ==================================================== */}
      {/* CLIENT-SIDE CALCULATOR */}
      {/* ==================================================== */}

      <PayrollCalculationScript
        calculationId={
          calculationId
        }
      />

    </section>
  )
}


// ============================================================
// CALCULATION SCRIPT
// ============================================================

function PayrollCalculationScript({
  calculationId
}: {
  calculationId: string
}) {

  const script = `
    (() => {
      const root = document.getElementById(
        ${JSON.stringify(calculationId)}
      );

      if (!root) return;

      const form = root.closest("form");

      if (!form) return;

      const earningNames = [
        "basicSalary",
        "hra",
        "allowance",
        "bonus",
        "incentive",
        "overtime"
      ];

      const deductionNames = [
        "deductions",
        "tax"
      ];

      const formatter =
        new Intl.NumberFormat(
          "en-IN",
          {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        );

      const readValue = (name) => {
        const field =
          form.elements.namedItem(name);

        if (
          !field ||
          !("value" in field)
        ) {
          return 0;
        }

        const normalized =
          String(field.value)
            .replace(/,/g, "")
            .trim();

        const number =
          Number(normalized);

        return Number.isFinite(number)
          ? number
          : 0;
      };

      const update = () => {
        const gross =
          earningNames.reduce(
            (total, name) =>
              total + readValue(name),
            0
          );

        const deductions =
          deductionNames.reduce(
            (total, name) =>
              total + readValue(name),
            0
          );

        const net =
          gross - deductions;

        const grossElement =
          document.getElementById(
            ${JSON.stringify(
              `${calculationId}-gross`
            )}
          );

        const deductionsElement =
          document.getElementById(
            ${JSON.stringify(
              `${calculationId}-deductions`
            )}
          );

        const netElement =
          document.getElementById(
            ${JSON.stringify(
              `${calculationId}-net`
            )}
          );

        if (grossElement) {
          grossElement.textContent =
            formatter.format(gross);
        }

        if (deductionsElement) {
          deductionsElement.textContent =
            formatter.format(deductions);
        }

        if (netElement) {
          netElement.textContent =
            formatter.format(net);
        }
      };

      const names = [
        ...earningNames,
        ...deductionNames
      ];

      names.forEach((name) => {
        const field =
          form.elements.namedItem(name);

        if (
          field &&
          "addEventListener" in field
        ) {
          field.addEventListener(
            "input",
            update
          );
        }
      });

      update();
    })();
  `


  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          script
      }}
    />
  )
}


// ============================================================
// FORM SECTION
// ============================================================

type FormSectionProps = {
  title: string

  description: string

  icon: React.ComponentType<{
    className?: string
  }>

  children: React.ReactNode
}


function FormSection({
  title,
  description,
  icon: Icon,
  children
}: FormSectionProps) {

  return (
    <section
      className="
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          flex items-start gap-3
          border-b border-slate-200
          bg-slate-50/70
          px-5 py-4
        "
      >

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
          <Icon className="h-5 w-5" />
        </div>


        <div>

          <h2
            className="
              font-semibold
              text-slate-900
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-0.5
              text-sm leading-6
              text-slate-500
            "
          >
            {description}
          </p>

        </div>

      </div>


      <div className="p-5">
        {children}
      </div>

    </section>
  )
}


// ============================================================
// FORM FIELD
// ============================================================

type FormFieldProps = {
  label: string

  htmlFor: string

  required?: boolean

  error?: string

  children: React.ReactNode
}


function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children
}: FormFieldProps) {

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

        {required && (

          <span
            className="
              ml-1
              text-red-500
            "
          >
            *
          </span>

        )}

      </label>


      <div className="mt-2">
        {children}
      </div>


      {error && (

        <p
          className="
            mt-1.5
            text-xs
            text-red-600
          "
        >
          {error}
        </p>

      )}

    </div>
  )
}


// ============================================================
// AMOUNT FIELD
// ============================================================

type AmountFieldProps = {
  name: string

  label: string

  defaultValue: string

  required?: boolean

  pending: boolean

  error?: string

  calculationId: string
}


function AmountField({
  name,
  label,
  defaultValue,
  required = false,
  pending,
  error,
  calculationId
}: AmountFieldProps) {

  return (
    <FormField
      label={label}
      htmlFor={
        `${calculationId}-${name}`
      }
      required={required}
      error={error}
    >

      <div className="relative">

        <span
          className="
            pointer-events-none
            absolute left-3 top-1/2
            -translate-y-1/2
            text-sm font-medium
            text-slate-500
          "
        >
          ₹
        </span>


        <input
          id={
            `${calculationId}-${name}`
          }
          name={name}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          defaultValue={
            defaultValue
          }
          disabled={pending}
          required={required}
          className={`
            ${getInputClass(
              Boolean(error)
            )}
            pl-8
          `}
        />

      </div>

    </FormField>
  )
}


// ============================================================
// CALCULATION CARD
// ============================================================

type CalculationCardProps = {
  label: string

  value: string

  valueId: string

  highlighted?: boolean
}


function CalculationCard({
  label,
  value,
  valueId,
  highlighted = false
}: CalculationCardProps) {

  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        ${
          highlighted
            ? `
              border-green-200
              bg-green-50
            `
            : `
              border-blue-200
              bg-white/70
            `
        }
      `}
    >

      <p
        className={`
          text-xs font-semibold
          uppercase tracking-wide
          ${
            highlighted
              ? "text-green-700"
              : "text-blue-700"
          }
        `}
      >
        {label}
      </p>


      <p
        id={valueId}
        className={`
          mt-2
          text-xl font-semibold
          tracking-tight
          ${
            highlighted
              ? "text-green-950"
              : "text-blue-950"
          }
        `}
      >
        {value}
      </p>

    </div>
  )
}


// ============================================================
// INPUT CLASS
// ============================================================

function getInputClass(
  hasError: boolean
) {

  return `
    h-11 w-full
    rounded-lg
    border
    bg-white
    px-3
    text-sm
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    disabled:cursor-not-allowed
    disabled:bg-slate-50
    disabled:text-slate-500
    ${
      hasError
        ? `
          border-red-300
          focus:border-red-500
          focus:ring-2
          focus:ring-red-100
        `
        : `
          border-slate-300
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        `
    }
  `
}


// ============================================================
// NUMERIC STRING PARSER
// ============================================================

function parseNumericString(
  value: string
) {

  return parseAmount(
    value
  )
}