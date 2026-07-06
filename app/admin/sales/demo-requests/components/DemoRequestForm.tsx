"use client"

import {
  useActionState,
} from "react"

import {
  Building2,
  CalendarDays,
  Clock3,
  FileText,
  Link2,
  Loader2,
  Presentation,
  Save,
  UserRound,
} from "lucide-react"

import {
  createDemoRequestAction,
} from "../actions"


/* ==========================================================
   TYPES
========================================================== */

type CompanyOption = {
  id: string
  name: string
}


type MarketingEmployee = {
  id: string

  employeeCode: string

  firstName: string

  lastName: string

  email: string

  designation: string | null
}


type ActionState = {
  success: boolean

  message: string
}


type Props = {
  companies: CompanyOption[]

  marketingEmployees: MarketingEmployee[]
}


/* ==========================================================
   INITIAL STATE
========================================================== */

const initialState: ActionState = {
  success: false,

  message: "",
}


/* ==========================================================
   COMPONENT
========================================================== */

export default function DemoRequestForm({
  companies,
  marketingEmployees,
}: Props) {

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    createDemoRequestAction,
    initialState
  )


  return (

    <form
      action={formAction}
      className="space-y-6"
    >

      {/* ====================================================
          DEMO DETAILS
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-slate-200
            bg-slate-50
            px-6
            py-5
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Presentation className="h-5 w-5" />
          </div>


          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Demo Information
            </h2>


            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Select the prospect and Marketing employee.
            </p>

          </div>

        </div>


        {/* BODY */}

        <div
          className="
            grid
            gap-6
            p-6
            lg:grid-cols-2
          "
        >

          {/* COMPANY */}

          <div className="space-y-2">

            <label
              htmlFor="companyId"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Prospect Company
              <span className="text-red-500">
                {" "}*
              </span>
            </label>


            <div className="relative">

              <Building2
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <select
                id="companyId"
                name="companyId"
                required
                defaultValue=""
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              >

                <option value="">
                  Select prospect company
                </option>


                {companies.map(
                  (company) => (

                    <option
                      key={company.id}
                      value={company.id}
                    >
                      {company.name}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* MARKETING EMPLOYEE */}

          <div className="space-y-2">

            <label
              htmlFor="marketingEmployeeId"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Marketing Employee
              <span className="text-red-500">
                {" "}*
              </span>
            </label>


            <div className="relative">

              <UserRound
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <select
                id="marketingEmployeeId"
                name="marketingEmployeeId"
                required
                defaultValue=""
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              >

                <option value="">
                  Assign Marketing employee
                </option>


                {marketingEmployees.map(
                  (employee) => {

                    const fullName =
                      `${employee.firstName} ${employee.lastName}`

                    return (

                      <option
                        key={employee.id}
                        value={employee.id}
                      >
                        {fullName}
                        {" — "}
                        {employee.email}
                      </option>

                    )
                  }
                )}

              </select>

            </div>


            {marketingEmployees.length === 0 && (

              <p
                className="
                  text-xs
                  text-orange-600
                "
              >
                No active Marketing employees were found.
              </p>

            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          MEETING SCHEDULE
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-slate-200
            bg-slate-50
            px-6
            py-5
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-orange-50
              text-orange-600
            "
          >
            <CalendarDays className="h-5 w-5" />
          </div>


          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Meeting Schedule
            </h2>


            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Enter the agreed date, time, and meeting link.
            </p>

          </div>

        </div>


        <div
          className="
            grid
            gap-6
            p-6
            lg:grid-cols-2
          "
        >

          {/* MEETING DATE */}

          <div className="space-y-2">

            <label
              htmlFor="meetingDate"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Meeting Date & Time
              <span className="text-red-500">
                {" "}*
              </span>
            </label>


            <div className="relative">

              <Clock3
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="meetingDate"
                name="meetingDate"
                type="datetime-local"
                required
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>

          </div>


          {/* MEETING LINK */}

          <div className="space-y-2">

            <label
              htmlFor="meetingLink"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Meeting Link
            </label>


            <div className="relative">

              <Link2
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  h-4
                  w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />


              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                placeholder="https://meet.google.com/..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          NOTES
      ===================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-slate-200
            bg-slate-50
            px-6
            py-5
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-violet-50
              text-violet-600
            "
          >
            <FileText className="h-5 w-5" />
          </div>


          <div>

            <h2
              className="
                font-semibold
                text-slate-950
              "
            >
              Sales Handoff Notes
            </h2>


            <p
              className="
                mt-0.5
                text-sm
                text-slate-500
              "
            >
              Give Marketing useful context before the demo.
            </p>

          </div>

        </div>


        <div className="p-6">

          <label
            htmlFor="notes"
            className="
              text-sm
              font-medium
              text-slate-700
            "
          >
            Notes
          </label>


          <textarea
            id="notes"
            name="notes"
            rows={6}
            placeholder="Add prospect requirements, pain points, preferred CRM industry, objections, budget discussion, and other relevant information..."
            className="
              mt-2
              w-full
              resize-y
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

      </section>


      {/* ====================================================
          ACTION MESSAGE
      ===================================================== */}

      {state.message && (

        <div
          className={`
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-medium

            ${
              state.success
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
          {state.message}
        </div>

      )}


      {/* ====================================================
          ACTIONS
      ===================================================== */}

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
          type="reset"
          disabled={pending}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            rounded-xl
            border
            border-orange-300
            bg-orange-50
            px-5
            text-sm
            font-semibold
            text-orange-700
            transition
            hover:bg-orange-100
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Reset
        </button>


        <button
          type="submit"
          disabled={pending}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-green-600
            px-6
            text-sm
            font-semibold
            text-white
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
                  h-4
                  w-4
                  animate-spin
                "
              />

              Scheduling...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              Schedule Demo
            </>
          )}

        </button>

      </div>

    </form>
  )
}