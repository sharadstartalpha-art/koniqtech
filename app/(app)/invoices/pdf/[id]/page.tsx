import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { getObjectUrl } from "@/shared/lib/storage"

import Link from "next/link"
import {
  notFound,
  redirect,
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function InvoicePdfPage({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {

  // -----------------------------------
  // AUTH
  // -----------------------------------

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  // -----------------------------------
  // PARAMS
  // -----------------------------------

  const { id } = await params

  // -----------------------------------
  // LOAD INVOICE
  // -----------------------------------

  const invoice =
    await prisma.invoice.findFirst({

      where: {
        id,
        orgId,
        archivedAt: null,
      },

      include: {
        customer: true,
        job: true,
        organization: true,
      },

    })

  if (!invoice) {
    notFound()
  }

  // -----------------------------------
  // CREATE SIGNED LOGO URL
  // -----------------------------------

  let logoUrl: string | null = null

  if (invoice.organization.logo) {

    try {

      logoUrl =
        await getObjectUrl(
          invoice.organization.logo,
          3600
        )

    } catch (error) {

      console.error(
        "FAILED TO LOAD INVOICE LOGO:",
        error
      )

      logoUrl = null
    }
  }

  // -----------------------------------
  // FORMAT CURRENCY
  // -----------------------------------

  const money = (value: unknown) =>
    Number(value).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )

  return (

    <div
      className="
        bg-slate-100
        min-h-screen
        py-10
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
          bg-white
          shadow-xl
          p-12
        "
      >

        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <div
          className="
            flex
            justify-between
            items-start
            border-b
            pb-8
          "
        >

          {/* LEFT */}

          <div>

            <Link
              href={`/invoices/${invoice.id}`}
              className="
                inline-flex
                items-center
                border
                px-5
                py-3
                rounded-xl
                hover:bg-slate-100
                mb-6
              "
            >
              ← Back to Invoice
            </Link>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              INVOICE
            </h1>

            <p
              className="
                text-slate-500
                mt-3
              "
            >
              #{invoice.invoiceNumber}
            </p>

          </div>

          {/* COMPANY */}

          <div className="text-right">

            {/* LOGO */}

            {logoUrl && (

              <img
                src={logoUrl}
                alt={
                  invoice.organization.name
                }
                className="
                  ml-auto
                  mb-4
                  max-h-20
                  max-w-[220px]
                  object-contain
                "
              />

            )}

            {/* COMPANY NAME */}

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              {invoice.organization.name}
            </h2>

            {/* PHONE */}

            {invoice.organization.phone && (

              <p
                className="
                  text-sm
                  text-slate-500
                  mt-1
                "
              >
                {invoice.organization.phone}
              </p>

            )}

            {/* EMAIL */}

            {invoice.organization.email && (

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {invoice.organization.email}
              </p>

            )}

            {/* WEBSITE */}

            {invoice.organization.website && (

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >
                {invoice.organization.website}
              </p>

            )}

            {/* ADDRESS */}

            {(
              invoice.organization.address ||
              invoice.organization.city ||
              invoice.organization.state ||
              invoice.organization.postalCode ||
              invoice.organization.country
            ) && (

              <div
                className="
                  text-sm
                  text-slate-500
                  mt-2
                "
              >

                {invoice.organization.address && (

                  <div>
                    {invoice.organization.address}
                  </div>

                )}

                {(
                  invoice.organization.city ||
                  invoice.organization.state ||
                  invoice.organization.postalCode
                ) && (

                  <div>

                    {[
                      invoice.organization.city,
                      invoice.organization.state,
                      invoice.organization.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}

                  </div>

                )}

                {invoice.organization.country && (

                  <div>
                    {invoice.organization.country}
                  </div>

                )}

              </div>

            )}

          </div>

        </div>

        {/* --------------------------------
            BILL TO / INVOICE INFO
        -------------------------------- */}

        <div
          className="
            grid
            grid-cols-2
            gap-10
            mt-10
          "
        >

          {/* BILL TO */}

          <div>

            <h3
              className="
                font-bold
                mb-3
              "
            >
              Bill To
            </h3>

            <div
              className="
                space-y-1
                text-slate-700
              "
            >

              {(
                invoice.customer.companyName ||
                invoice.customer.firstName ||
                invoice.customer.lastName
              ) && (

                <div
                  className="
                    font-semibold
                  "
                >

                  {invoice.customer.companyName ??
                    `${invoice.customer.firstName ?? ""} ${invoice.customer.lastName ?? ""}`.trim()
                  }

                </div>

              )}

              {invoice.customer.email && (
                <div>
                  {invoice.customer.email}
                </div>
              )}

              {invoice.customer.phone && (
                <div>
                  {invoice.customer.phone}
                </div>
              )}

              {invoice.customer.address && (
                <div>
                  {invoice.customer.address}
                </div>
              )}

              {invoice.customer.city && (
                <div>
                  {invoice.customer.city}
                </div>
              )}

              {invoice.customer.state && (
                <div>
                  {invoice.customer.state}
                </div>
              )}

              {invoice.customer.zip && (
                <div>
                  {invoice.customer.zip}
                </div>
              )}

            </div>

          </div>

          {/* INVOICE INFO */}

          <div
            className="
              text-right
              space-y-2
            "
          >

            <div>

              <span className="font-semibold">
                Status:
              </span>{" "}

              <span className="capitalize">
                {invoice.status}
              </span>

            </div>

            <div>

              <span className="font-semibold">
                Created:
              </span>{" "}

              {invoice.createdAt.toLocaleDateString()}

            </div>

            {invoice.dueDate && (

              <div>

                <span className="font-semibold">
                  Due:
                </span>{" "}

                {invoice.dueDate.toLocaleDateString()}

              </div>

            )}

          </div>

        </div>

        {/* --------------------------------
            ITEMS
        -------------------------------- */}

        <div className="mt-12">

          <table
            className="
              w-full
              border
            "
          >

            <thead className="bg-slate-100">

              <tr>

                <th
                  className="
                    text-left
                    p-4
                    border
                  "
                >
                  Description
                </th>

                <th
                  className="
                    text-right
                    p-4
                    border
                  "
                >
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td
                  className="
                    p-4
                    border
                  "
                >
                  {invoice.job.title}
                </td>

                <td
                  className="
                    p-4
                    border
                    text-right
                  "
                >
                  ${money(invoice.subtotal)}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* --------------------------------
            TOTALS
        -------------------------------- */}

        <div
          className="
            flex
            justify-end
            mt-10
          "
        >

          <div
            className="
              w-80
              space-y-3
            "
          >

            <div
              className="
                flex
                justify-between
              "
            >

              <span>
                Subtotal
              </span>

              <span>
                ${money(invoice.subtotal)}
              </span>

            </div>

            <div
              className="
                flex
                justify-between
              "
            >

              <span>
                Tax
              </span>

              <span>
                ${money(invoice.tax)}
              </span>

            </div>

            <div
              className="
                flex
                justify-between
                border-t
                pt-4
                text-2xl
                font-bold
              "
            >

              <span>
                Total
              </span>

              <span>
                ${money(invoice.total)}
              </span>

            </div>

          </div>

        </div>

        {/* --------------------------------
            FOOTER
        -------------------------------- */}

        <div
          className="
            mt-16
            border-t
            pt-8
            text-center
            text-slate-500
          "
        >
          Thank you for your business.
        </div>

      </div>

    </div>

  )
}