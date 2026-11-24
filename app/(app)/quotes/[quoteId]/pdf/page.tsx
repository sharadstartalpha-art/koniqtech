
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { getObjectUrl } from "@/shared/lib/storage";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    quoteId: string;
  }>;
}

export default async function QuotePdfPage({
  params,
}: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

  if (!orgId) {
    redirect("/welcome");
  }

  const { quoteId } = await params;

  // Load quote with organization isolation.
  const quote = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      orgId,
    },
    include: {
      customer: true,
      items: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!quote) {
    notFound();
  }

  // Load organization branding.
  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  });

  if (!organization) {
    notFound();
  }

  // Load signed S3 logo URL.
  let logoUrl: string | null = null;

  if (organization.logo) {
    try {
      logoUrl = await getObjectUrl(
        organization.logo,
        3600
      );
    } catch (error) {
      console.error(
        "FAILED TO LOAD QUOTE LOGO:",
        error
      );
    }
  }

  const money = (value: unknown) =>
    Number(value ?? 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const customerName =
    quote.customer.companyName ??
    [
      quote.customer.firstName,
      quote.customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  const customerAddress = [
    quote.customer.address,
    quote.customer.city,
    quote.customer.state,
    quote.customer.zip,
  ]
    .filter(Boolean)
    .join(", ");

 return (
  <>
    <style>{`
      @page {
        size: A4;
        margin: 12mm;
      }

      @media print {
        html,
        body {
          background: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        body * {
          visibility: hidden !important;
        }

        #quote-print,
        #quote-print * {
          visibility: visible !important;
        }

        #quote-print {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          box-shadow: none !important;
        }

        #quote-print table {
          width: 100%;
          border-collapse: collapse;
        }

        #quote-print tr {
          break-inside: avoid;
        }

        #quote-print img {
          max-height: 80px;
          object-fit: contain;
        }

        #quote-print h1,
        #quote-print h2,
        #quote-print h3 {
          break-after: avoid;
        }

        #quote-print .quote-section {
          break-inside: avoid;
        }
      }
    `}</style>

    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">

  <div
    id="quote-print"
    className="mx-auto max-w-4xl bg-white p-12 shadow-xl print:max-w-none print:p-0 print:shadow-none"
  >

        {/* ACTIONS */}

        <div className="mb-8 flex items-center justify-between print:hidden">

          <Link
            href={`/quotes/${quote.id}`}
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            ← Back to Quote
          </Link>

          <PrintButton />

        </div>

        {/* HEADER */}

        <div className="flex justify-between gap-8 border-b pb-8">

          <div>
            <h1 className="text-5xl font-bold">
              QUOTE
            </h1>

            <p className="mt-3 text-slate-500">
              #{quote.quoteNumber}
            </p>
          </div>

          {/* COMPANY BRANDING */}

          <div className="max-w-xs text-right">

            {logoUrl && (
              <img
                src={logoUrl}
                alt={organization.name}
                className="ml-auto mb-4 max-h-20 max-w-[220px] object-contain"
              />
            )}

            <h2 className="text-2xl font-bold">
              {organization.name}
            </h2>

            {organization.phone && (
              <p className="mt-1 text-sm text-slate-500">
                {organization.phone}
              </p>
            )}

            {organization.email && (
              <p className="text-sm text-slate-500">
                {organization.email}
              </p>
            )}

            {organization.website && (
              <p className="text-sm text-slate-500">
                {organization.website}
              </p>
            )}

            <div className="mt-2 text-sm text-slate-500">

              {organization.address && (
                <div>{organization.address}</div>
              )}

              {[
                organization.city,
                organization.state,
                organization.postalCode,
              ]
                .filter(Boolean)
                .length > 0 && (
                <div>
                  {[
                    organization.city,
                    organization.state,
                    organization.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}

              {organization.country && (
                <div>{organization.country}</div>
              )}

            </div>

          </div>

        </div>

        {/* CUSTOMER AND QUOTE INFORMATION */}

        <div className="mt-10 grid grid-cols-2 gap-10">

          <div>
            <h3 className="mb-3 font-bold">
              Prepared For
            </h3>

            <div className="space-y-1 text-slate-700">

              <div className="font-semibold">
                {customerName || "-"}
              </div>

              {quote.customer.email && (
                <div>{quote.customer.email}</div>
              )}

              {quote.customer.phone && (
                <div>{quote.customer.phone}</div>
              )}

              {customerAddress && (
                <div>{customerAddress}</div>
              )}

            </div>
          </div>

          <div className="space-y-2 text-right">

            <div>
              <span className="font-semibold">
                Status:
              </span>{" "}
              <span className="capitalize">
                {quote.status}
              </span>
            </div>

            <div>
              <span className="font-semibold">
                Created:
              </span>{" "}
              {quote.createdAt.toLocaleDateString("en-US")}
            </div>

            <div>
              <span className="font-semibold">
                Valid Until:
              </span>{" "}
              {quote.validUntil
                ? quote.validUntil.toLocaleDateString("en-US")
                : "-"}
            </div>

          </div>

        </div>

        {/* QUOTE ITEMS */}

        <div className="mt-12 overflow-hidden">

          <table className="w-full border-collapse border">

            <thead className="bg-slate-100">
              <tr>
                <th className="border p-3 text-left">
                  Item
                </th>

                <th className="border p-3 text-left">
                  Description
                </th>

                <th className="border p-3 text-right">
                  Qty
                </th>

                <th className="border p-3 text-right">
                  Price
                </th>

                <th className="border p-3 text-right">
                  Tax
                </th>

                <th className="border p-3 text-right">
                  Discount
                </th>

                <th className="border p-3 text-right">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>

              {quote.items.map((item) => (
                <tr key={item.id}>

                  <td className="border p-3 font-medium">
                    {item.itemName}
                  </td>

                  <td className="border p-3">
                    {item.description || "-"}
                  </td>

                  <td className="border p-3 text-right">
                    {Number(item.qty).toLocaleString("en-US")}
                    {item.unit ? ` ${item.unit}` : ""}
                  </td>

                  <td className="border p-3 text-right">
                    ${money(item.price)}
                  </td>

                  <td className="border p-3 text-right">
                    ${money(item.tax)}
                  </td>

                  <td className="border p-3 text-right">
                    ${money(item.discount)}
                  </td>

                  <td className="border p-3 text-right font-medium">
                    ${money(item.total)}
                  </td>

                </tr>
              ))}

              {quote.items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="border p-8 text-center text-slate-500"
                  >
                    No quote items found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* TOTALS */}

        <div className="mt-10 flex justify-end">

          <div className="w-80 space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${money(quote.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>${money(quote.discount)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>${money(quote.tax)}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-2xl font-bold">
              <span>Total</span>
              <span>${money(quote.total)}</span>
            </div>

          </div>

        </div>

        {/* NOTES */}

        {quote.notes && (
          <div className="mt-12 border-t pt-6">
            <h3 className="mb-3 font-bold">
              Notes
            </h3>

            <p className="whitespace-pre-wrap text-slate-600">
              {quote.notes}
            </p>
          </div>
        )}

        {/* TERMS */}

        {quote.terms && (
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-3 font-bold">
              Terms & Conditions
            </h3>

            <p className="whitespace-pre-wrap text-slate-600">
              {quote.terms}
            </p>
          </div>
        )}

        {/* SIGNATURE */}

        <div className="mt-16 grid grid-cols-2 gap-12">

          <div>
            <div className="border-b pb-2" />
            <p className="mt-2 text-sm text-slate-500">
              Customer Signature
            </p>
          </div>

          <div>
            <div className="border-b pb-2" />
            <p className="mt-2 text-sm text-slate-500">
              Authorized Signature
            </p>
          </div>

        </div>

        {/* FOOTER */}

        <div className="mt-16 border-t pt-8 text-center text-slate-500">
          Thank you for considering {organization.name}.
        </div>

          </div>
    </div>
  </>
  );
}