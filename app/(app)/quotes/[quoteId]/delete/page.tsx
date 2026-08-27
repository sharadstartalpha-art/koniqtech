import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    quoteId: string;
  }>;
}

export default async function DeleteQuotePage({
  params,
}: PageProps) {

  const {
    quoteId,
  } = await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

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

          },

        },

        items: {

          select: {

            id: true,

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

  async function deleteQuote() {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const existingQuote =
      await prisma.quote.findFirst({

        where: {

          id: quoteId,

          orgId,

        },

        include: {

          jobs: {

            select: {

              id: true,

            },

          },

        },

      });

    if (!existingQuote) {
      notFound();
    }

    if (
      existingQuote.jobs.length > 0
    ) {
      throw new Error(
        "This quote cannot be deleted because one or more jobs are linked to it."
      );
    }

    await prisma.quote.delete({

      where: {

        id: existingQuote.id,

      },

    });

    redirect("/quotes");

  }

  const total =
    Number(quote.total);
      return (

    <div className="mx-auto max-w-5xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Quote
          </h1>

          <p className="mt-2 text-slate-600">
            This action permanently deletes the quote and cannot be undone.
          </p>

        </div>

        <Link
          href={`/quotes/${quote.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

            <span className="text-2xl">
              ⚠️
            </span>

          </div>

          <div>

            <h2 className="text-xl font-semibold text-red-700">
              Confirm Deletion
            </h2>

            <p className="mt-2 text-red-600">

              Deleting this quote will permanently remove:

            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-red-600">

              <li>
                Quote information
              </li>

              <li>
                All quote line items
              </li>

              <li>
                Notes & terms
              </li>

              <li>
                Pricing and totals
              </li>

            </ul>

          </div>

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Quote Details
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Quote Number
              </span>

              <span className="font-medium">
                {quote.quoteNumber}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Status
              </span>

              <span className="capitalize">
                {quote.status}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Quote Value
              </span>

              <span className="font-semibold">

                $
                {total.toLocaleString()}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Line Items
              </span>

              <span>

                {quote.items.length}

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
                Valid Until
              </span>

              <span>

                {quote.validUntil
                  ? quote.validUntil.toLocaleDateString()
                  : "-"}

              </span>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Customer
          </h2>

          <div className="space-y-5">

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
                Related Jobs
              </p>

              <p>

                {quote.jobs.length}

              </p>

            </div>

          </div>

        </div>

      </div>
            {quote.jobs.length > 0 && (

        <div className="rounded-3xl border border-yellow-300 bg-yellow-50 p-6">

          <h2 className="text-xl font-semibold text-yellow-800">
            Quote Cannot Be Deleted
          </h2>

          <p className="mt-2 text-yellow-700">

            This quote has one or more jobs linked to it.
            Remove or reassign those jobs before deleting the quote.

          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border bg-white">

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

                    <td className="px-6 py-4 capitalize">

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

        </div>

      )}

      <form
        action={deleteQuote}
        className="rounded-3xl border bg-white p-8"
      >

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              Final Confirmation
            </h2>

            <p className="mt-2 text-slate-600">

              This action permanently deletes
              <span className="font-semibold">
                {" "}
                {quote.quoteNumber}
                {" "}
              </span>
              and all of its quote items.

            </p>

          </div>

          <div className="flex gap-4">

            <Link
              href={`/quotes/${quote.id}`}
              className="rounded-xl border px-6 py-3 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={quote.jobs.length > 0}
              className={`rounded-xl px-6 py-3 font-medium text-white
                ${
                  quote.jobs.length > 0
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
            >
              Delete Quote
            </button>

          </div>

        </div>

      </form>

    </div>

  );

}