import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { Prisma, QuoteStatus } from "@prisma/client";
import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function QuotesPage({
  searchParams,
}: PageProps) {

  const {
    search = "",
    status = "",
  } = await searchParams;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

const where: Prisma.QuoteWhereInput = {

  orgId,

  ...(search && {

    OR: [

      {
        quoteNumber: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        customer: {
          is: {
            OR: [

              {
                companyName: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                firstName: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                lastName: {
                  contains: search,
                  mode: "insensitive",
                },
              },

            ],
          },
        },
      },

    ],

  }),

  ...(status && {
    status: status as any,
  }),

};

  const [

    quotes,

    totalQuotes,

    totals,

    approvedCount,

  ] = await Promise.all([

    prisma.quote.findMany({

      where,

      include: {

        customer: {

          select: {
            id: true,
            orgId,
           companyName: true,
      firstName: true,
      lastName: true,
          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

    }),

    prisma.quote.count({

      where,

    }),

    prisma.quote.aggregate({

      where,

      _sum: {
        total: true,
      },

    }),

    prisma.quote.count({

      where: {

        ...where,

        status: "approved",

      },

    }),

  ]);

  const totalValue =
    Number(
      totals._sum.total ?? 0
    );

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Quotes
          </h1>

          <p className="mt-2 text-slate-600">
            Manage customer quotations.
          </p>

        </div>

        <Link
          href="/quotes/create"
          className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
        >
          New Quote
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Quotes
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {totalQuotes}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Total Value
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            $
            {totalValue.toLocaleString()}
          </h2>

        </div>

        <div className="rounded-3xl border bg-white p-7">

          <p className="text-slate-500">
            Approved
          </p>

          <h2 className="mt-3 text-5xl font-bold">
            {approvedCount}
          </h2>

        </div>

      </div>
            <form
        className="flex flex-col gap-4 lg:flex-row"
      >

        <input
          type="text"
          name="search"
          placeholder="Search quote..."
          defaultValue={search}
          className="flex-1 rounded-xl border px-5 py-3"
        />

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border px-5 py-3"
        >

          <option value="">
            All Status
          </option>

          <option value="draft">
            Draft
          </option>

          <option value="sent">
            Sent
          </option>

          <option value="approved">
  Approved
</option>

          <option value="rejected">
            Rejected
          </option>

          <option value="expired">
            Expired
          </option>

        </select>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
        >
          Search
        </button>

      </form>

      <div className="overflow-hidden rounded-3xl border bg-white">

        <table className="min-w-full">

          <thead className="border-b bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Quote
              </th>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Value
              </th>

              <th className="px-6 py-4 text-left">
                Valid Until
              </th>

              <th className="px-6 py-4 text-left">
                Created
              </th>

              <th className="px-6 py-4 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {quotes.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No quotes found.
                </td>

              </tr>

            )}

            {quotes.map((quote) => (

              <tr
                key={quote.id}
                className="border-b last:border-b-0 hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <Link
                    href={`/quotes/${quote.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {quote.quoteNumber}
                  </Link>

                </td>

               <td className="px-6 py-4">
  {quote.customer.companyName ??
    [quote.customer.firstName, quote.customer.lastName]
      .filter(Boolean)
      .join(" ")}
</td>

                <td className="px-6 py-4">

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

                </td>

                <td className="px-6 py-4">
                  $
                  {Number(
                    quote.total
                  ).toLocaleString()}
                </td>

                <td className="px-6 py-4">

                  {quote.validUntil
                    ? quote.validUntil.toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-4">
                  {quote.createdAt.toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-4">

                    <Link
                      href={`/quotes/${quote.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </Link>

                    <Link
                      href={`/quotes/${quote.id}/edit`}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/quotes/${quote.id}/delete`}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </Link>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}