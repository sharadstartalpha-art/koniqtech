import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

import {
  ArrowLeft,
  Database,
  Info,
  PencilLine
} from "lucide-react"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

import LeadForm, {
  type LeadAssigneeOption,
  type LeadFormValues
} from "../../components/LeadForm"

import {
  updateLeadAction
} from "../../actions"


// ============================================================
// TYPES
// ============================================================

type EditLeadPageProps = {

  params: Promise<{
    id: string
  }>

}


// ============================================================
// PAGE
// ============================================================

export default async function EditLeadPage({
  params
}: EditLeadPageProps) {

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
  // PARAMS
  // ----------------------------------------------------------

  const {
    id
  } =
    await params


  if (!id) {

    notFound()

  }


  // ----------------------------------------------------------
  // LOAD LEAD
  //
  // findFirst is intentional because orgId is required for
  // tenant isolation.
  // ----------------------------------------------------------

  const lead =
    await prisma.lead.findFirst({

      where: {

        id,

        orgId

      },

      select: {

        id: true,

        source: true,

        firstName: true,

        lastName: true,

        phone: true,

        email: true,

        companyName: true,

        address: true,

        budget: true,

        priority: true,

        tags: true,

        attachment: true,

        industry: true,

        status: true,

        assignedTo: true

      }

    })


  if (!lead) {

    notFound()

  }


  // ----------------------------------------------------------
  // LOAD ORGANIZATION USERS
  //
  // Current assignee is included even if their status is no
  // longer active so existing assignments remain editable.
  // ----------------------------------------------------------

  const users =
    await prisma.user.findMany({

      where: {

        orgId,

        OR: [

          {
            status:
              "active"
          },

          ...(lead.assignedTo
            ? [
                {
                  id:
                    lead.assignedTo
                }
              ]
            : [])

        ]

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

        id: true,

        name: true,

        email: true

      }

    })


  // ----------------------------------------------------------
  // MAP ASSIGNEES
  // ----------------------------------------------------------

  const assignees:
    LeadAssigneeOption[] =
    users.map(
      (user) => ({

        id:
          user.id,

        name:
          user.name,

        email:
          user.email

      })
    )


  // ----------------------------------------------------------
  // LEAD NAME
  // ----------------------------------------------------------

  const leadName =
    [
      lead.firstName,
      lead.lastName
    ]
      .filter(Boolean)
      .join(" ")
      .trim()


  // ----------------------------------------------------------
  // INITIAL VALUES
  // ----------------------------------------------------------

  const initialValues:
    LeadFormValues = {

    source:
      lead.source ??
      "",

    firstName:
      lead.firstName,

    lastName:
      lead.lastName ??
      "",

    phone:
      lead.phone ??
      "",

    email:
      lead.email ??
      "",

    companyName:
      lead.companyName ??
      "",

    address:
      lead.address ??
      "",

    budget:
      lead.budget !== null
        ? String(
            lead.budget
          )
        : "",

    priority:
      lead.priority ??
      "Medium",

    tags:
      lead.tags ??
      "",

    attachment:
      lead.attachment ??
      "",

    industry:
      lead.industry ??
      "",

    status:
      lead.status,

    assignedTo:
      lead.assignedTo ??
      ""

  }


  // ----------------------------------------------------------
  // BIND UPDATE ACTION
  // ----------------------------------------------------------

  const updateAction =
    updateLeadAction.bind(
      null,
      lead.id
    )


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ==================================================== */}
      {/* BACK NAVIGATION */}
      {/* ==================================================== */}

      <div
        className="
          flex flex-wrap
          items-center gap-4
        "
      >

        <Link
          href={
            `/admin/data-entry/${lead.id}`
          }
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

          Back to Lead Details
        </Link>


        <span
          className="
            hidden h-4 w-px
            bg-slate-300
            sm:block
          "
        />


        <Link
          href="/admin/data-entry"
          className="
            text-sm font-medium
            text-slate-500
            transition
            hover:text-blue-600
          "
        >
          All Lead Records
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
              bg-blue-50
              text-blue-600
            "
          >
            <PencilLine className="h-6 w-6" />
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
              Edit Lead
            </h1>


            <p
              className="
                mt-1
                max-w-2xl
                text-sm leading-6
                text-slate-500
              "
            >
              Update contact, company, classification,
              assignment, and opportunity information for{" "}
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


        {/* DATA ENTRY BADGE */}

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
              Edit Lead Record
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
            Editing lead record
          </p>


          <p
            className="
              mt-1
              text-sm leading-6
              text-blue-700
            "
          >
            Changes to the lead status and assignment
            are automatically recorded in the activity
            timeline. Existing notes and activity history
            are not modified by this form.
          </p>

        </div>

      </div>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <LeadForm
        mode="edit"
        assignees={
          assignees
        }
        initialValues={
          initialValues
        }
        action={
          updateAction
        }
        cancelHref={
          `/admin/data-entry/${lead.id}`
        }
      />

    </div>
  )
}