import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    quoteId: string;
  }>;
}

export default async function QuoteDetailsPage({
  params,
}: PageProps) {

  const { quoteId } = await params;

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  const quote =
    await prisma.quote.findFirst({

      where: {

        id: quoteId,

        orgId,

      },

      include: {

        customer: {

          select: {

            id: true,

            companyName: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

            address: true,

            city: true,

            state: true,

            zip: true,

          },

        },

        createdBy: {

          select: {

            id: true,

            name: true,

            email: true,

          },

        },

        updatedBy: {

          select: {

            id: true,

            name: true,

            email: true,

          },

        },

        items: {

          orderBy: {

            sortOrder: "asc",

          },

        },

        jobs: {

          select: {

            id: true,

            title: true,

            status: true,

          },

        },

      },

    });

  if (!quote) {
    notFound();
  }

  const customerName =
    quote.customer.companyName ??
    [
      quote.customer.firstName,
      quote.customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");

  const subtotal =
    Number(quote.subtotal);

  const tax =
    Number(quote.tax);

  const discount =
    Number(quote.discount ?? 0);

  const total =
    Number(quote.total);

      return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-4xl font-bold">

              {quote.quoteNumber}

            </h1>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                ${
                  quote.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : quote.status === "sent"
                    ? "bg-blue-100 text-blue-700"
                    : quote.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : quote.status === "expired"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {quote.status}
            </span>

          </div>

          <p className="mt-2 text-slate-600">
            Quote Details
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <Link
            href="/quotes"
            className="rounded-xl border px-5 py-3 hover:bg-slate-50"
          >
            Back
          </Link>

          <Link
            href={`/quotes/${quote.id}/edit`}
            className="rounded-xl bg-orange-500 px-5 py-3 text-white hover:bg-orange-600"
          >
            Edit Quote
          </Link>

          <Link
            href={`/quotes/${quote.id}/delete`}
            className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Delete
          </Link>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="rounded-3xl border bg-white p-7">

          <h2 className="text-xl font-semibold">
            Customer
          </h2>

          <div className="mt-6 space-y-3">

            <div>

              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="font-medium">
                {customerName}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p>
                {quote.customer.email ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p>
                {quote.customer.phone ?? "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Address
              </p>

              <p>

                {[
                  quote.customer.address,
                  quote.customer.city,
                  quote.customer.state,
                  quote.customer.zip,
                ]
                  .filter(Boolean)
                  .join(", ") || "-"}

              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <h2 className="text-xl font-semibold">
            Quote Information
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Valid Until
              </span>

              <span>

                {quote.validUntil
                  ? quote.validUntil.toLocaleDateString()
                  : "-"}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Created
              </span>

              <span>
                {quote.createdAt.toLocaleDateString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Created By
              </span>

              <span>
                {quote.createdBy.name ??
                  quote.createdBy.email}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Updated By
              </span>

              <span>

                {quote.updatedBy
                  ? quote.updatedBy.name ??
                    quote.updatedBy.email
                  : "-"}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Last Updated
              </span>

              <span>
                {quote.updatedAt.toLocaleDateString()}
              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <h2 className="text-xl font-semibold">
            Totals
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between">

              <span>Subtotal</span>

              <span>
                ${subtotal.toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Discount</span>

              <span>
                ${discount.toLocaleString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Tax</span>

              <span>
                ${tax.toLocaleString()}
              </span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">

              <span>Total</span>

              <span>
                ${total.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </div>
            <div className="rounded-3xl border bg-white overflow-hidden">

        <div className="border-b px-7 py-5">

          <h2 className="text-2xl font-semibold">
            Quote Items
          </h2>

        </div>

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Item
              </th>

              <th className="px-6 py-4 text-left">
                Description
              </th>

              <th className="px-6 py-4 text-left">
                Unit
              </th>

              <th className="px-6 py-4 text-right">
                Qty
              </th>

              <th className="px-6 py-4 text-right">
                Price
              </th>

              <th className="px-6 py-4 text-right">
                Tax
              </th>

              <th className="px-6 py-4 text-right">
                Discount
              </th>

              <th className="px-6 py-4 text-right">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {quote.items.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  No quote items found.
                </td>

              </tr>

            ) : (

              quote.items.map((item) => (

                <tr
                  key={item.id}
                  className="border-b last:border-b-0"
                >

                  <td className="px-6 py-4 font-medium">
                    {item.itemName}
                  </td>

                  <td className="px-6 py-4">
                    {item.description ?? "-"}
                  </td>

                  <td className="px-6 py-4">
                    {item.unit ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {item.qty}
                  </td>

                  <td className="px-6 py-4 text-right">
                    ${Number(item.price).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    ${Number(item.tax ?? 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    ${Number(item.discount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right font-medium">
                    ${Number(item.total).toLocaleString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {(quote.notes || quote.terms) && (

        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl border bg-white p-7">

            <h2 className="text-xl font-semibold">
              Notes
            </h2>

            <div className="mt-4 whitespace-pre-wrap text-slate-700">

              {quote.notes || "-"}

            </div>

          </div>

          <div className="rounded-3xl border bg-white p-7">

            <h2 className="text-xl font-semibold">
              Terms & Conditions
            </h2>

            <div className="mt-4 whitespace-pre-wrap text-slate-700">

              {quote.terms || "-"}

            </div>

          </div>

        </div>

      )}

      <div className="rounded-3xl border bg-white p-7">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Related Jobs
          </h2>

          {quote.jobs.length > 0 && (

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">

              {quote.jobs.length} Job
              {quote.jobs.length !== 1 ? "s" : ""}

            </span>

          )}

        </div>

        {quote.jobs.length === 0 ? (

          <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-slate-500">

            No jobs have been created from this quote.

          </div>

        ) : (

          <div className="mt-6 overflow-hidden rounded-2xl border">

            <table className="min-w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Job 
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {quote.jobs.map((job) => (

                  <tr
                    key={job.id}
                    className="border-b last:border-b-0"
                  >

                    <td className="px-6 py-4 font-medium">

                      {job.title}

                    </td>

                    <td className="px-6 py-4">

                      {String(job.status)}

                    </td>

                    <td className="px-6 py-4 text-right">

                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View Job
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}