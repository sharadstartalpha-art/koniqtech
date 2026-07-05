"use client"

import Link from "next/link"

import {
  useActionState,
  useMemo,
  useState
} from "react"

import {
  Building2,
  CircleDollarSign,
  FileText,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Save,
  Tag,
  UserRound,
  Users
} from "lucide-react"

import {
  Industry,
  LeadStatus
} from "@prisma/client"

import type {
  DataEntryActionState
} from "../actions"



// ============================================================
// TYPES
// ============================================================

export type LeadAssigneeOption = {
  id: string

  name: string

  email: string
}




export type LeadFormValues = {
  source: string

  firstName: string

  lastName: string

  phone: string

  email: string

  companyName: string

  address: string

  budget: string

  priority: string

  tags: string

  attachment: string

  industry: Industry | ""

  status: LeadStatus

  assignedTo: string
}


type LeadFormProps = {
  mode: "create" | "edit"

  assignees: LeadAssigneeOption[]

  initialValues?: Partial<
    LeadFormValues
  >

  action: (
    previousState:
      DataEntryActionState,

    formData:
      FormData
  ) => Promise<
    DataEntryActionState
  >

  cancelHref?: string
}


// ============================================================
// DEFAULT VALUES
// ============================================================

const INITIAL_DATA_ENTRY_STATE: DataEntryActionState = {
  success: false,
  message: "",
  errors: {}
}

const DEFAULT_VALUES:
  LeadFormValues = {

  source:
    "",

  firstName:
    "",

  lastName:
    "",

  phone:
    "",

  email:
    "",

  companyName:
    "",

  address:
    "",

  budget:
    "",

  priority:
    "Medium",

  tags:
    "",

  attachment:
    "",

  industry:
    "",

  status:
    LeadStatus.new,

  assignedTo:
    ""

}


// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [

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
// PRIORITY OPTIONS
// ============================================================

const PRIORITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Urgent"
]


// ============================================================
// COMMON SOURCES
// ============================================================

const SOURCE_SUGGESTIONS = [
  "Website",
  "Google Ads",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "Referral",
  "Cold Email",
  "Cold Call",
  "Trade Show",
  "Partner",
  "Other"
]


// ============================================================
// PAGE
// ============================================================

export default function LeadForm({
  mode,
  assignees,
  initialValues,
  action,
  cancelHref = "/admin/data-entry"
}: LeadFormProps) {

  // ----------------------------------------------------------
  // ACTION STATE
  // ----------------------------------------------------------

  const [
    state,
    formAction,
    pending
  ] =
    useActionState(
      action,
      INITIAL_DATA_ENTRY_STATE
    )


  // ----------------------------------------------------------
  // VALUES
  // ----------------------------------------------------------

  const values:
    LeadFormValues = {

    ...DEFAULT_VALUES,

    ...initialValues

  }


  // ----------------------------------------------------------
  // BUDGET PREVIEW
  // ----------------------------------------------------------

  const [
    budget,
    setBudget
  ] =
    useState(
      values.budget
    )


  const formattedBudget =
    useMemo(
      () => {

        if (!budget.trim()) {
          return null
        }


        const value =
          Number(
            budget.replace(
              /,/g,
              ""
            )
          )


        if (
          !Number.isFinite(value)
        ) {
          return null
        }


        return new Intl.NumberFormat(
          "en-US",
          {
            style:
              "currency",

            currency:
              "USD",

            maximumFractionDigits:
              2
          }
        ).format(value)

      },
      [
        budget
      ]
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      action={
        formAction
      }
      className="space-y-6"
    >

      {/* ==================================================== */}
      {/* GLOBAL ERROR */}
      {/* ==================================================== */}

      {!state.success &&
        state.message && (

        <div
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
          "
        >

          <p
            className="
              text-sm font-medium
              text-red-800
            "
          >
            {state.message}
          </p>


          {state.errors?.form && (

            <p
              className="
                mt-1
                text-sm
                text-red-700
              "
            >
              {state.errors.form}
            </p>

          )}

        </div>

      )}


      {/* ==================================================== */}
      {/* PERSONAL INFORMATION */}
      {/* ==================================================== */}

      <FormSection
        title="Lead Information"
        description="Enter the primary identity and contact information for this lead."
        icon={UserRound}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          <FormField
            label="First Name"
            htmlFor="firstName"
            required
            error={
              state.errors?.firstName
            }
          >

            <InputWithIcon
              icon={UserRound}
              id="firstName"
              name="firstName"
              defaultValue={
                values.firstName
              }
              placeholder="Enter first name"
              required
              autoComplete="given-name"
            />

          </FormField>


          <FormField
            label="Last Name"
            htmlFor="lastName"
            error={
              state.errors?.lastName
            }
          >

            <InputWithIcon
              icon={UserRound}
              id="lastName"
              name="lastName"
              defaultValue={
                values.lastName
              }
              placeholder="Enter last name"
              autoComplete="family-name"
            />

          </FormField>


          <FormField
            label="Email Address"
            htmlFor="email"
            error={
              state.errors?.email
            }
          >

            <InputWithIcon
              icon={Mail}
              id="email"
              name="email"
              type="email"
              defaultValue={
                values.email
              }
              placeholder="lead@example.com"
              autoComplete="email"
            />

          </FormField>


          <FormField
            label="Phone Number"
            htmlFor="phone"
            error={
              state.errors?.phone
            }
          >

            <InputWithIcon
              icon={Phone}
              id="phone"
              name="phone"
              type="tel"
              defaultValue={
                values.phone
              }
              placeholder="+1 555 123 4567"
              autoComplete="tel"
            />

          </FormField>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* COMPANY INFORMATION */}
      {/* ==================================================== */}

      <FormSection
        title="Company & Location"
        description="Add company and location information when applicable."
        icon={Building2}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          <FormField
            label="Company Name"
            htmlFor="companyName"
            error={
              state.errors?.companyName
            }
          >

            <InputWithIcon
              icon={Building2}
              id="companyName"
              name="companyName"
              defaultValue={
                values.companyName
              }
              placeholder="Enter company name"
              autoComplete="organization"
            />

          </FormField>


          <FormField
            label="Industry"
            htmlFor="industry"
            error={
              state.errors?.industry
            }
          >

            <div className="relative">

              <Globe2
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <select
                id="industry"
                name="industry"
                defaultValue={
                  values.industry
                }
                className={`
                  ${INPUT_CLASS}
                  pl-10
                `}
              >

                <option value="">
                  Select industry
                </option>


                {Object.values(
                  Industry
                ).map(
                  (industry) => (

                    <option
                      key={
                        industry
                      }
                      value={
                        industry
                      }
                    >
                      {
                        formatLabel(
                          industry
                        )
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          </FormField>


          <div className="md:col-span-2">

            <FormField
              label="Address"
              htmlFor="address"
              error={
                state.errors?.address
              }
            >

              <div className="relative">

                <MapPin
                  className="
                    pointer-events-none
                    absolute left-3 top-3.5
                    h-4 w-4
                    text-slate-400
                  "
                />


                <textarea
                  id="address"
                  name="address"
                  defaultValue={
                    values.address
                  }
                  rows={3}
                  placeholder="Street, city, state, postal code and country"
                  autoComplete="street-address"
                  className={`
                    ${TEXTAREA_CLASS}
                    pl-10
                  `}
                />

              </div>

            </FormField>

          </div>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* LEAD CLASSIFICATION */}
      {/* ==================================================== */}

      <FormSection
        title="Lead Classification"
        description="Classify the lead by source, priority, status, budget, and tags."
        icon={Tag}
      >

        <div
          className="
            grid gap-5
            md:grid-cols-2
          "
        >

          {/* SOURCE */}

          <FormField
            label="Lead Source"
            htmlFor="source"
            error={
              state.errors?.source
            }
          >

            <div className="relative">

              <Globe2
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="source"
                name="source"
                list="lead-source-options"
                defaultValue={
                  values.source
                }
                placeholder="Website, Referral, Google Ads..."
                className={`
                  ${INPUT_CLASS}
                  pl-10
                `}
              />


              <datalist id="lead-source-options">

                {SOURCE_SUGGESTIONS.map(
                  (source) => (

                    <option
                      key={
                        source
                      }
                      value={
                        source
                      }
                    />

                  )
                )}

              </datalist>

            </div>

          </FormField>


          {/* PRIORITY */}

          <FormField
            label="Priority"
            htmlFor="priority"
            error={
              state.errors?.priority
            }
          >

            <select
              id="priority"
              name="priority"
              defaultValue={
                values.priority
              }
              className={
                INPUT_CLASS
              }
            >

              {PRIORITY_OPTIONS.map(
                (priority) => (

                  <option
                    key={
                      priority
                    }
                    value={
                      priority
                    }
                  >
                    {priority}
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* STATUS */}

          <FormField
            label="Lead Status"
            htmlFor="status"
            error={
              state.errors?.status
            }
          >

            <select
              id="status"
              name="status"
              defaultValue={
                values.status
              }
              className={
                INPUT_CLASS
              }
            >

              {STATUS_OPTIONS.map(
                (status) => (

                  <option
                    key={
                      status.value
                    }
                    value={
                      status.value
                    }
                  >
                    {status.label}
                  </option>

                )
              )}

            </select>

          </FormField>


          {/* BUDGET */}

          <FormField
            label="Estimated Budget"
            htmlFor="budget"
            error={
              state.errors?.budget
            }
            hint={
              formattedBudget
                ? `Preview: ${formattedBudget}`
                : "Enter the estimated opportunity value."
            }
          >

            <div className="relative">

              <CircleDollarSign
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="0.01"
                value={
                  budget
                }
                onChange={
                  (event) =>
                    setBudget(
                      event.target.value
                    )
                }
                placeholder="0.00"
                className={`
                  ${INPUT_CLASS}
                  pl-10
                `}
              />

            </div>

          </FormField>


          {/* TAGS */}

          <div className="md:col-span-2">

            <FormField
              label="Tags"
              htmlFor="tags"
              error={
                state.errors?.tags
              }
              hint="Separate multiple tags with commas."
            >

              <InputWithIcon
                icon={Tag}
                id="tags"
                name="tags"
                defaultValue={
                  values.tags
                }
                placeholder="high-value, commercial, follow-up"
              />

            </FormField>

          </div>

        </div>

      </FormSection>


      {/* ==================================================== */}
      {/* ASSIGNMENT */}
      {/* ==================================================== */}

      <FormSection
        title="Sales Assignment"
        description="Assign this lead to the salesperson responsible for customer contact and follow-up."
        icon={Users}
      >

        <FormField
          label="Sales Person"
          htmlFor="assignedTo"
          error={
            state.errors?.assignedTo
          }
        >

          <div className="relative">

            <Users
              className="
                pointer-events-none
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />


            <select
              id="assignedTo"
              name="assignedTo"
              defaultValue={
                values.assignedTo
              }
              className={`
                ${INPUT_CLASS}
                pl-10
              `}
            >

              <option value="">
                Select sales person
              </option>


              {assignees.map(
                (assignee) => (

                  <option
                    key={
                      assignee.id
                    }
                    value={
                      assignee.id
                    }
                  >
                    {
                      assignee.name
                    }{" "}
                    ({assignee.email})
                  </option>

                )
              )}

            </select>

          </div>

        </FormField>

      </FormSection>


      {/* ==================================================== */}
      {/* ATTACHMENT */}
      {/* ==================================================== */}

      <FormSection
        title="Attachment"
        description="Store a URL or object-storage path for a document associated with the lead."
        icon={Paperclip}
      >

        <FormField
          label="Attachment URL"
          htmlFor="attachment"
          error={
            state.errors?.attachment
          }
          hint="Use a valid uploaded file URL or storage object path."
        >

          <InputWithIcon
            icon={Paperclip}
            id="attachment"
            name="attachment"
            defaultValue={
              values.attachment
            }
            placeholder="https://... or storage/path/document.pdf"
          />

        </FormField>

      </FormSection>


      {/* ==================================================== */}
      {/* FORM INFORMATION */}
      {/* ==================================================== */}

      <div
        className="
          flex items-start gap-3
          rounded-xl
          border border-blue-200
          bg-blue-50
          px-4 py-3
        "
      >

        <FileText
          className="
            mt-0.5
            h-5 w-5
            shrink-0
            text-blue-600
          "
        />


        <p
          className="
            text-sm leading-6
            text-blue-700
          "
        >
          Lead notes and activity history are managed
          from the lead detail page. Saving this form
          automatically records the relevant lead activity.
        </p>

      </div>


      {/* ==================================================== */}
      {/* ACTIONS */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col-reverse gap-3
          border-t border-slate-200
          pt-6
          sm:flex-row
          sm:items-center
          sm:justify-end
        "
      >

        <Link
          href={
            cancelHref
          }
          className="
            inline-flex h-11
            items-center justify-center
            rounded-lg
            bg-orange-100
            px-5
            text-sm font-medium
            text-orange-700
            transition
            hover:bg-orange-200
          "
        >
          Cancel
        </Link>


        <button
          type="submit"
          disabled={
            pending
          }
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
            disabled:opacity-60
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
                ? "Creating Lead..."
                : "Saving Changes..."}
            </>

          ) : (

            <>
              <Save className="h-4 w-4" />

              {mode === "create"
                ? "Create Lead"
                : "Save Changes"}
            </>

          )}

        </button>

      </div>

    </form>
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

  hint?: string

  children: React.ReactNode
}


function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children
}: FormFieldProps) {

  return (
    <div>

      <label
        htmlFor={
          htmlFor
        }
        className="
          mb-2
          block
          text-sm font-medium
          text-slate-700
        "
      >
        {label}

        {required && (

          <span className="ml-1 text-red-500">
            *
          </span>

        )}

      </label>


      {children}


      {error ? (

        <p
          className="
            mt-1.5
            text-xs font-medium
            text-red-600
          "
        >
          {error}
        </p>

      ) : hint ? (

        <p
          className="
            mt-1.5
            text-xs
            text-slate-400
          "
        >
          {hint}
        </p>

      ) : null}

    </div>
  )
}


// ============================================================
// INPUT WITH ICON
// ============================================================

type InputWithIconProps = {

  icon: React.ComponentType<{
    className?: string
  }>

  id: string

  name: string

  type?: string

  defaultValue?: string

  placeholder?: string

  required?: boolean

  autoComplete?: string

}


function InputWithIcon({
  icon: Icon,
  id,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  autoComplete
}: InputWithIconProps) {

  return (
    <div className="relative">

      <Icon
        className="
          pointer-events-none
          absolute left-3 top-1/2
          h-4 w-4
          -translate-y-1/2
          text-slate-400
        "
      />


      <input
        id={
          id
        }
        name={
          name
        }
        type={
          type
        }
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        required={
          required
        }
        autoComplete={
          autoComplete
        }
        className={`
          ${INPUT_CLASS}
          pl-10
        `}
      />

    </div>
  )
}


// ============================================================
// LABEL FORMATTER
// ============================================================

function formatLabel(
  value: string
) {

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    )
}


// ============================================================
// INPUT STYLES
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


const TEXTAREA_CLASS = `
  w-full
  resize-y
  rounded-lg
  border border-slate-300
  bg-white
  px-3 py-3
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
`