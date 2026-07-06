// app/admin/sales/demo-requests/new/page.tsx

import Link from "next/link"

import prisma from "@/shared/lib/prisma"

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  Link2,
  Presentation,
  UserRound,
} from "lucide-react"

import DemoRequestForm from "../components/DemoRequestForm"


/* ==========================================================
   PAGE
========================================================== */

export default async function NewDemoRequestPage() {

  /* --------------------------------------------------------
     COMPANIES

     Only id is selected because the exact CompanyLead
     scalar fields must match your Prisma schema.
  --------------------------------------------------------- */

  const companies =
    await prisma.companyLead.findMany({

      select: {
        id: true,
      },

      orderBy: {
        id: "asc",
      },

    })


  /* --------------------------------------------------------
     ACTIVE MARKETING EMPLOYEES
  --------------------------------------------------------- */

  const employees =
    await prisma.employee.findMany({

      where: {

        active: true,

        role: {
          name: {
            contains: "Marketing",
            mode: "insensitive",
          },
        },

      },

      select: {

        id: true,

        employeeCode: true,

        firstName: true,

        lastName: true,

        email: true,

        designation: true,

      },

      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],

    })


  /* ========================================================
     NORMALIZE FORM OPTIONS
  ======================================================== */

  const companyOptions =
    companies.map(
      (company) => ({
        id: company.id,

        name:
          `Company ${company.id.slice(
            0,
            8
          )}`,
      })
    )


  const marketingEmployees =
    employees.map(
      (employee) => ({

        id: employee.id,

        employeeCode:
          employee.employeeCode,

        firstName:
          employee.firstName,

        lastName:
          employee.lastName,

        email:
          employee.email,

        designation:
          employee.designation,

      })
    )


  return (

    <div className="space-y-6">

      {/* ====================================================
          BACK LINK
      ===================================================== */}

      <Link
        href="/admin/sales/demo-requests"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-blue-600
          transition
          hover:text-blue-700
        "
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Demo Requests
      </Link>


      {/* ====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div
          className="
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-green-50
              text-green-600
            "
          >
            <Presentation className="h-6 w-6" />
          </div>


          <div>

            <p
              className="
                text-sm
                font-medium
                text-blue-600
              "
            >
              Sales → Marketing Handoff
            </p>


            <h1
              className="
                mt-1
                text-3xl
                font-bold
                tracking-tight
                text-slate-950
              "
            >
              Schedule New Demo
            </h1>


            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Schedule a product demonstration
              for a qualified prospect and assign
              the meeting to a Marketing employee.
            </p>

          </div>

        </div>


        <div
          className="
            rounded-xl
            border
            border-blue-200
            bg-blue-50
            px-4
            py-3
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <CalendarDays
              className="
                h-5
                w-5
                text-blue-600
              "
            />


            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-blue-600
                "
              >
                Demo Request
              </p>


              <p
                className="
                  mt-0.5
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                New Appointment
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          WORKFLOW INFO
      ===================================================== */}

      <section
        className="
          rounded-2xl
          border
          border-blue-200
          bg-blue-50/60
          p-5
        "
      >

        <div
          className="
            flex
            items-start
            gap-3
          "
        >

          <Presentation
            className="
              mt-0.5
              h-5
              w-5
              shrink-0
              text-blue-600
            "
          />


          <div>

            <h2
              className="
                text-sm
                font-semibold
                text-blue-900
              "
            >
              Sales handoff workflow
            </h2>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-blue-700
              "
            >
              Create a demo request only after
              the prospect has shown interest.
              Select the company, assign the
              appropriate Marketing employee,
              and enter the agreed meeting date.
            </p>

          </div>

        </div>

      </section>


      {/* ====================================================
          PROCESS STEPS
      ===================================================== */}

      <section
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <ProcessCard
          number="01"
          title="Select Company"
          description="Choose the qualified prospect company."
          icon={
            <Building2 className="h-5 w-5" />
          }
          iconClass="
            bg-blue-50
            text-blue-600
          "
        />


        <ProcessCard
          number="02"
          title="Assign Marketing"
          description="Choose the employee responsible for the demo."
          icon={
            <UserRound className="h-5 w-5" />
          }
          iconClass="
            bg-violet-50
            text-violet-600
          "
        />


        <ProcessCard
          number="03"
          title="Set Schedule"
          description="Enter the agreed demonstration date and time."
          icon={
            <Clock3 className="h-5 w-5" />
          }
          iconClass="
            bg-orange-50
            text-orange-600
          "
        />


        <ProcessCard
          number="04"
          title="Meeting Access"
          description="Add the online meeting link when available."
          icon={
            <Link2 className="h-5 w-5" />
          }
          iconClass="
            bg-green-50
            text-green-600
          "
        />

      </section>


      {/* ====================================================
          FORM
      ===================================================== */}

      <DemoRequestForm
        companies={companyOptions}
        marketingEmployees={
          marketingEmployees
        }
      />

    </div>
  )
}


/* ==========================================================
   PROCESS CARD
========================================================== */

function ProcessCard({
  number,
  title,
  description,
  icon,
  iconClass,
}: {
  number: string
  title: string
  description: string
  icon: React.ReactNode
  iconClass: string
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl

            ${iconClass}
          `}
        >
          {icon}
        </div>


        <span
          className="
            text-xs
            font-bold
            text-slate-300
          "
        >
          {number}
        </span>

      </div>


      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-slate-950
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-1
          text-xs
          leading-5
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  )
}