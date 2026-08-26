import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import Link from "next/link"

import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

const statusColors = {

  scheduled:
    "bg-blue-100 text-blue-700",

  in_progress:
    "bg-amber-100 text-amber-700",

  completed:
    "bg-emerald-100 text-emerald-700",

  cancelled:
    "bg-red-100 text-red-700"

} as const

export default async function JobDetailsPage({

  params

}: {

  params: Promise<{

    id: string

  }>

}) {

  const session =
    await auth()

  if (!session?.user) {

    redirect("/login")

  }

  const orgId =
    session.user.orgId

  if (!orgId) {

    redirect("/welcome")

  }

  const { id } =
    await params

  const job =
    await prisma.job.findFirst({

      where: {

        id,

        orgId

      },

      include: {

        customer: true,

        technician: true,

        quote: true,

        invoices: {

          orderBy: {

            createdAt: "desc"

          }

        },

        tasks: {

          orderBy: {

            createdAt: "asc"

          }

        },

        milestones: {

          orderBy: {

            createdAt: "asc"

          }

        },

        materials: true,

        purchaseOrders: true,

        crewAssignments: {

          include: {

            crew: true

          }

        },

        changeOrders: true,

        punchItems: true,

        closeout: true

      }

    })

  if (!job) {

    notFound()

  }

  const completedTasks =
    job.tasks.filter(

      task =>

        task.status ===
        "completed"

    ).length

  const completedMilestones =
    job.milestones.filter(

      milestone =>

        milestone.completed

    ).length

  const completedPunchItems =
    job.punchItems.filter(

      item =>

        item.completed

    ).length

  const totalItems =

    job.tasks.length +

    job.milestones.length +

    job.punchItems.length

  const completedItems =

    completedTasks +

    completedMilestones +

    completedPunchItems

  const progress =

    totalItems === 0

      ? 0

      : Math.round(

          (completedItems /
            totalItems) *
            100

        )

  const latestInvoice =
    job.invoices[0] ?? null

  const totalMaterialRequests =
    job.materials.length

  const totalPurchaseOrders =
    job.purchaseOrders.length

  const totalCrew =
    job.crewAssignments.length

  const totalChangeOrders =
    job.changeOrders.length

      return (

    <div className="space-y-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Link
              href="/jobs"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Jobs
            </Link>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusColors[
                  job.status as keyof typeof statusColors
                ]
              }`}
            >
              {job.status.replaceAll("_", " ")}
            </span>

          </div>

          <h1 className="mt-4 text-4xl font-bold">
            {job.title}
          </h1>

          <p className="mt-2 text-slate-500">

            Job ID

            <span className="ml-2 rounded bg-slate-100 px-2 py-1 font-mono text-slate-700">

              {job.id.slice(0, 8).toUpperCase()}

            </span>

          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href={`/jobs/${job.id}/edit`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Edit Job
          </Link>

          <Link
            href={`/jobs/${job.id}/delete`}
            className="rounded-xl border border-red-200 px-5 py-3 text-red-600 hover:bg-red-50"
          >
            Delete
          </Link>

          <Link
            href={`/jobs/${job.id}/invoices/create`}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
          >
            Generate Invoice
          </Link>

        </div>

      </div>

      <div className="rounded-3xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-semibold">

              Job Progress

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Based on completed tasks,
              milestones and punch items.

            </p>

          </div>

          <div className="text-right">

            <p className="text-3xl font-bold">

              {progress}%

            </p>

            <p className="text-sm text-slate-500">

              Overall Completion

            </p>

          </div>

        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${progress}%`
            }}
          />

        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">

            Tasks

          </p>

          <p className="mt-2 text-3xl font-bold">

            {completedTasks}

            <span className="text-lg text-slate-400">

              / {job.tasks.length}

            </span>

          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">

            Milestones

          </p>

          <p className="mt-2 text-3xl font-bold">

            {completedMilestones}

            <span className="text-lg text-slate-400">

              / {job.milestones.length}

            </span>

          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">

            Crew Members

          </p>

          <p className="mt-2 text-3xl font-bold">

            {totalCrew}

          </p>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">

            Material Requests

          </p>

          <p className="mt-2 text-3xl font-bold">

            {totalMaterialRequests}

          </p>

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

                <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Job Overview
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Job Title
                </p>

                <p className="mt-1 font-semibold">
                  {job.title}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    statusColors[
                      job.status as keyof typeof statusColors
                    ]
                  }`}
                >
                  {job.status.replaceAll("_", " ")}
                </span>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Scheduled Date
                </p>

                <p className="mt-1 font-semibold">

                  {job.scheduledDate

                    ? new Date(
                        job.scheduledDate
                      ).toLocaleDateString()

                    : "Not Scheduled"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Completed Date
                </p>

                <p className="mt-1 font-semibold">

                  {job.completedDate

                    ? new Date(
                        job.completedDate
                      ).toLocaleDateString()

                    : "-"}

                </p>

              </div>

              <div className="sm:col-span-2">

                <p className="text-sm text-slate-500">
                  Notes
                </p>

                <p className="mt-1 whitespace-pre-wrap">

                  {job.notes ||
                    "No notes available."}

                </p>

              </div>

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Customer
              </h2>

              <Link
                href={`/customers/${job.customer.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View Customer
              </Link>

            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="mt-1 font-semibold">

                  {job.customer.companyName ||

                    `${job.customer.firstName} ${job.customer.lastName ?? ""}`}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-1">

                  {job.customer.phone ||
                    "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1">

                  {job.customer.email ||
                    "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Address
                </p>

                <p className="mt-1">

                  {job.customer.address ||
                    "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  City
                </p>

                <p className="mt-1">

                  {job.customer.city ||
                    "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  State / ZIP
                </p>

                <p className="mt-1">

                  {job.customer.state || "-"}

                  {job.customer.zip &&
                    ` ${job.customer.zip}`}

                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          <div className="rounded-3xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Technician
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              <div>

                <p className="text-sm text-slate-500">
                  Assigned Technician
                </p>

                <p className="mt-1 font-semibold">

                  {job.technician?.name ||
                    "Unassigned"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="mt-1">

                  {job.technician?.email ||
                    "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="mt-1">

                  {job.technician?.phone ||
                    "-"}

                </p>

              </div>

            </div>

          </div>
                    <div className="rounded-3xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Quote
              </h2>

              {job.quote && (

                <Link
                  href={`/quotes/${job.quote.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Quote
                </Link>

              )}

            </div>

            {job.quote ? (

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-sm text-slate-500">
                    Quote Number
                  </p>

                  <p className="mt-1 font-semibold">
                    {job.quote.quoteNumber}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 capitalize">
                    {job.quote.status}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    ₹
                    {Number(job.quote.total).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Valid Until
                  </p>

                  <p className="mt-1">

                    {job.quote.validUntil

                      ? new Date(
                          job.quote.validUntil
                        ).toLocaleDateString()

                      : "-"}

                  </p>

                </div>

              </div>

            ) : (

              <p className="mt-6 text-slate-500">
                No quote linked to this job.
              </p>

            )}

          </div>

          <div className="rounded-3xl border bg-white p-6">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Latest Invoice
              </h2>

              {latestInvoice ? (

                <Link
                  href={`/invoices/${latestInvoice.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Invoice
                </Link>

              ) : (

                <Link
                  href={`/jobs/${job.id}/invoices/create`}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Create Invoice
                </Link>

              )}

            </div>

            {latestInvoice ? (

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>

                  <p className="text-sm text-slate-500">
                    Invoice Number
                  </p>

                  <p className="mt-1 font-semibold">
                    {latestInvoice.invoiceNumber}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm capitalize">
                    {latestInvoice.status}
                  </span>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    ₹
                    {Number(
                      latestInvoice.total
                    ).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Due Date
                  </p>

                  <p className="mt-1">

                    {latestInvoice.dueDate

                      ? new Date(
                          latestInvoice.dueDate
                        ).toLocaleDateString()

                      : "-"}

                  </p>

                </div>

              </div>

            ) : (

              <div className="mt-6 rounded-xl border border-dashed p-6 text-center">

                <p className="text-slate-500">
                  No invoice has been created yet.
                </p>

              </div>

            )}

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border bg-white p-6">

              <p className="text-sm text-slate-500">
                Purchase Orders
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalPurchaseOrders}
              </p>

            </div>

            <div className="rounded-2xl border bg-white p-6">

              <p className="text-sm text-slate-500">
                Change Orders
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalChangeOrders}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

                <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Tasks
            </h2>

            <Link
              href={`/jobs/${job.id}/tasks`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Tasks
            </Link>

          </div>

          {job.tasks.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No tasks have been created.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.tasks.map(task => (

                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        task.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {task.status === "completed"
                        ? "✓"
                        : ""}
                    </div>

                    <div>

                      <p className="font-medium">
                        {task.title}
                      </p>

                      {task.dependsOnId && (

                        <p className="mt-1 text-xs text-slate-500">
                          Depends on another task
                        </p>

                      )}

                    </div>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      task.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : task.status === "in_progress"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.status.replaceAll("_", " ")}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Milestones
            </h2>

            <Link
              href={`/jobs/${job.id}/milestones`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Milestones
            </Link>

          </div>

          {job.milestones.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No milestones available.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.milestones.map(milestone => (

                <div
                  key={milestone.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        milestone.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {milestone.completed
                        ? "✓"
                        : ""}
                    </div>

                    <div>

                      <p className="font-medium">
                        {milestone.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">

                        {milestone.dueDate

                          ? `Due ${new Date(
                              milestone.dueDate
                            ).toLocaleDateString()}`

                          : "No due date"}

                      </p>

                    </div>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      milestone.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {milestone.completed
                      ? "Completed"
                      : milestone.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Material Requests
            </h2>

            <Link
              href={`/jobs/${job.id}/materials`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Materials
            </Link>

          </div>

          {job.materials.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No material requests found.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.materials.map(material => (

                <div
                  key={material.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div>

                    <p className="font-semibold">
                      {material.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Quantity:{" "}
                      {Number(material.quantity)}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      material.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : material.status === "received"
                        ? "bg-blue-100 text-blue-700"
                        : material.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {material.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Purchase Orders
            </h2>

            <Link
              href="/purchase-orders"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          {job.purchaseOrders.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No purchase orders linked to this job.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.purchaseOrders.map(po => (

                <div
                  key={po.id}
                  className="rounded-xl border p-4"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold">
                        {po.orderNumber}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">

                        {po.expectedDate
                          ? `Expected ${new Date(
                              po.expectedDate
                            ).toLocaleDateString()}`
                          : "No expected date"}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-lg font-bold text-emerald-600">

                        ₹
                        {Number(
                          po.total
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}

                      </p>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">

                        {po.status}

                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

                <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Crew Assignments
            </h2>

            <Link
              href={`/jobs/${job.id}/crew`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Crew
            </Link>

          </div>

          {job.crewAssignments.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No crew members assigned.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.crewAssignments.map((assignment) => (

                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div>

                    <p className="font-semibold">
                      {assignment.crew.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      Assigned{" "}

                      {new Date(
                        assignment.assignedAt
                      ).toLocaleDateString()}

                    </p>

                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">

                    Active

                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Change Orders
            </h2>

            <Link
              href={`/jobs/${job.id}/change-orders`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Change Orders
            </Link>

          </div>

          {job.changeOrders.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No change orders found.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.changeOrders.map((changeOrder) => (

                <div
                  key={changeOrder.id}
                  className="rounded-xl border p-4"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold">
                        {changeOrder.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500 capitalize">
                        {changeOrder.status}
                      </p>

                    </div>

                    <p className="text-lg font-bold text-emerald-600">

                      ₹
                      {Number(
                        changeOrder.amount
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Punch List
            </h2>

            <Link
              href={`/jobs/${job.id}/punch-list`}
              className="text-sm text-blue-600 hover:underline"
            >
              Manage Punch List
            </Link>

          </div>

          {job.punchItems.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                No punch list items.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {job.punchItems.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.completed ? "✓" : ""}
                    </div>

                    <p className="font-medium">
                      {item.title}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.completed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.completed
                      ? "Completed"
                      : "Pending"}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Closeout Package
            </h2>

            <Link
              href={`/jobs/${job.id}/closeout`}
              className="text-sm text-blue-600 hover:underline"
            >
              View Details
            </Link>

          </div>

          {!job.closeout ? (

            <div className="mt-6 rounded-xl border border-dashed p-8 text-center">

              <p className="text-slate-500">
                Closeout package has not been created.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Final Inspection</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.finalInspectionPassed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.closeout.finalInspectionPassed
                    ? "Passed"
                    : "Pending"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Customer Sign Off</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.customerSignOff
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.closeout.customerSignOff
                    ? "Completed"
                    : "Pending"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Warranty Uploaded</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.warrantyUploaded
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.closeout.warrantyUploaded
                    ? "Yes"
                    : "No"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Photos Uploaded</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.photosUploaded
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.closeout.photosUploaded
                    ? "Yes"
                    : "No"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Invoice Paid</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.invoicePaid
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {job.closeout.invoicePaid
                    ? "Paid"
                    : "Outstanding"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Completion Certificate</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    job.closeout.completionCertificate
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.closeout.completionCertificate
                    ? "Available"
                    : "Missing"}
                </span>

              </div>

              <div className="flex items-center justify-between rounded-xl border p-4">

                <span>Completion Date</span>

                <span className="font-medium">

                  {job.closeout.completionDate
                    ? new Date(
                        job.closeout.completionDate
                      ).toLocaleDateString()
                    : "-"}

                </span>

              </div>

            </div>

          )}

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border bg-white p-6">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Job Notes
            </h2>

            <Link
              href={`/jobs/${job.id}/edit`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit Notes
            </Link>

          </div>

          <div className="mt-6">

            {job.notes ? (

              <div className="rounded-xl bg-slate-50 p-5 whitespace-pre-wrap">

                {job.notes}

              </div>

            ) : (

              <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">

                No notes have been added for this job.

              </div>

            )}

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6">

          <h2 className="text-xl font-semibold">
            Project Summary
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Tasks
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.tasks.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Milestones
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.milestones.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Materials
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.materials.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Purchase Orders
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.purchaseOrders.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Crew Members
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.crewAssignments.length}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Punch Items
              </p>

              <p className="mt-2 text-2xl font-bold">
                {job.punchItems.length}
              </p>

            </div>

          </div>

          <div className="mt-8">

            <h3 className="text-lg font-semibold">
              Quick Actions
            </h3>

            <div className="mt-4 grid gap-3">

              <Link
                href={`/jobs/${job.id}/edit`}
                className="rounded-xl border p-4 hover:bg-slate-50"
              >
                Edit Job
              </Link>

              <Link
                href={`/jobs/${job.id}/tasks`}
                className="rounded-xl border p-4 hover:bg-slate-50"
              >
                Manage Tasks
              </Link>

              <Link
                href={`/jobs/${job.id}/milestones`}
                className="rounded-xl border p-4 hover:bg-slate-50"
              >
                Manage Milestones
              </Link>

              <Link
                href={`/jobs/${job.id}/invoices/create`}
                className="rounded-xl bg-emerald-600 p-4 text-center font-medium text-white hover:bg-emerald-700"
              >
                Generate Invoice
              </Link>

              <Link
                href={`/purchase-orders/create?jobId=${job.id}`}
                className="rounded-xl border p-4 hover:bg-slate-50"
              >
                Create Purchase Order
              </Link>

            </div>

          </div>

        </div>

      </div>

            <div className="rounded-3xl border bg-white p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold">
            Activity Timeline
          </h2>

          <span className="text-sm text-slate-500">
            Latest Job Activity
          </span>

        </div>

        <div className="mt-6 space-y-5">

          <div className="flex gap-4">

            <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

            <div>

              <p className="font-medium">
                Job Created
              </p>

              <p className="text-sm text-slate-500">

                {new Date(
                  job.createdAt
                ).toLocaleString()}

              </p>

            </div>

          </div>

          {job.scheduledDate && (

            <div className="flex gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />

              <div>

                <p className="font-medium">
                  Job Scheduled
                </p>

                <p className="text-sm text-slate-500">

                  {new Date(
                    job.scheduledDate
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          )}

          {job.completedDate && (

            <div className="flex gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />

              <div>

                <p className="font-medium">
                  Job Completed
                </p>

                <p className="text-sm text-slate-500">

                  {new Date(
                    job.completedDate
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          )}

          {latestInvoice && (

            <div className="flex gap-4">

              <div className="mt-1 h-3 w-3 rounded-full bg-purple-600" />

              <div>

                <p className="font-medium">
                  Invoice Generated
                </p>

                <p className="text-sm text-slate-500">

                  {latestInvoice.invoiceNumber}

                </p>

              </div>

            </div>

          )}

        </div>

      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4">

        <Link
          href="/jobs"
          className="rounded-xl border px-5 py-3 hover:bg-slate-50"
        >
          Back to Jobs
        </Link>

        <Link
          href={`/jobs/${job.id}/edit`}
          className="rounded-xl border px-5 py-3 hover:bg-slate-50"
        >
          Edit Job
        </Link>

        <Link
          href={`/jobs/${job.id}/invoices/create`}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
        >
          Generate Invoice
        </Link>

      </div>

    </div>

  )

}