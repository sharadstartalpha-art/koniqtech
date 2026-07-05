import Link from "next/link"

import {
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Database,
  Info,
  PlusCircle
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import LeadForm, {
  type LeadAssigneeOption
} from "../components/LeadForm"

import {
  createLeadAction
} from "../actions"


// ============================================================
// PAGE
// ============================================================

export default async function NewDataEntryLeadPage() {

  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.orgId
  ) {

    redirect(
      "/login"
    )

  }


  const orgId =
    session.user.orgId


  // ----------------------------------------------------------
  // LOAD ORGANIZATION USERS
  //
  // These users are available for lead assignment.
  // ----------------------------------------------------------

  const users =
    await prisma.user.findMany({

      where: {

        orgId

      },

      orderBy: [

        {
          name:
            "asc"
        },

        {
          email:
            "asc"
        }

      ],

      select: {

        id:
          true,

        name:
          true,

        email:
          true

      }

    })


  // ----------------------------------------------------------
  // MAP ASSIGNEE OPTIONS
  //
  // Client components should receive simple serializable data.
  // ----------------------------------------------------------

  const assignees:
    LeadAssigneeOption[] =
    users.map(
      (user) => ({

        id:
          user.id,

        name:
          user.name?.trim() ||
          user.email,

        email:
          user.email

      })
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK NAVIGATION */}
      {/* ==================================================== */}

      <div>

        <Link
          href="/admin/data-entry"
          className="
            inline-flex
            items-center gap-2
            text-sm font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Data Entry
        </Link>

      </div>


      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        <div
          className="
            flex items-start gap-4
          "
        >

          <div
            className="
              flex h-12 w-12
              shrink-0
              items-center justify-center
              rounded-xl
              bg-green-50
              text-green-600
            "
          >
            <PlusCircle className="h-6 w-6" />
          </div>


          <div>

            <h1
              className="
                text-2xl
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              Add New Lead
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Create a new lead record with contact,
              company, classification, and assignment
              information.
            </p>

          </div>

        </div>


        <div
          className="
            inline-flex
            items-center gap-3
            self-start
            rounded-xl
            border border-blue-200
            bg-blue-50
            px-4 py-3
          "
        >

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              bg-blue-100
              text-blue-600
            "
          >
            <Database className="h-4 w-4" />
          </div>


          <div>

            <p
              className="
                text-xs font-medium
                uppercase tracking-wide
                text-blue-600
              "
            >
              Data Entry
            </p>


            <p
              className="
                mt-0.5
                text-sm font-semibold
                text-blue-950
              "
            >
              New Lead Record
            </p>

          </div>

        </div>

      </div>


      {/* ==================================================== */}
      {/* INFORMATION */}
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

        <Info
          className="
            mt-0.5
            h-5 w-5
            shrink-0
            text-blue-600
          "
        />


        <div>

          <p
            className="
              text-sm font-medium
              text-blue-900
            "
          >
            Lead data entry
          </p>


          <p
            className="
              mt-1
              text-sm leading-6
              text-blue-700
            "
          >
            Enter accurate lead information before saving.
            Only the first name is mandatory, but adding
            contact details, source, industry, and assignment
            information will make the lead easier to process
            through the sales workflow.
          </p>

        </div>

      </div>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <LeadForm
        mode="create"
        assignees={
          assignees
        }
        action={
          createLeadAction
        }
        cancelHref="/admin/data-entry"
      />

    </div>
  )
}