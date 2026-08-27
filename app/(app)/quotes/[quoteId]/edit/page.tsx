import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { Prisma } from "@prisma/client";

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

export default async function EditQuotePage({
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

  const userId =
    session.user.id;

  if (!userId) {
    redirect("/login");
  }

  const [

    quote,

    customers,

  ] = await Promise.all([

    prisma.quote.findFirst({

      where: {

        id: quoteId,

        orgId,

      },

      include: {

        items: {

          orderBy: {

            sortOrder: "asc",

          },

        },

      },

    }),

    prisma.customer.findMany({

      where: {

        orgId,

        status: "active",

      },

      orderBy: [

        {
          companyName: "asc",
        },

        {
          firstName: "asc",
        },

      ],

      select: {

        id: true,

        companyName: true,

        firstName: true,

        lastName: true,

      },

    }),

  ]);

  if (!quote) {
    notFound();
  }

  const currentQuote = quote;
  
  async function updateQuote(
    formData: FormData
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const userId =
      session.user.id;

    if (!userId) {
      redirect("/login");
    }

    const customerId =
      formData.get("customerId")
        ?.toString()
        .trim() ?? "";

    const validUntilValue =
      formData.get("validUntil")
        ?.toString() ?? "";

    const notes =
      formData.get("notes")
        ?.toString()
        .trim() || null;

    const terms =
      formData.get("terms")
        ?.toString()
        .trim() || null;

    const tax =
      Number(
        formData.get("tax") ?? 0
      );

    const discount =
      Number(
        formData.get("discount") ?? 0
      );

    const itemNames =
      formData.getAll("itemName") as string[];

    const descriptions =
      formData.getAll("description") as string[];

    const units =
      formData.getAll("unit") as string[];

    const qtys =
      formData.getAll("qty") as string[];

    const prices =
      formData.getAll("price") as string[];

    if (!customerId) {
      throw new Error(
        "Customer is required."
      );
    }

    const items: {

      itemName: string;

      description: string | null;

      unit: string | null;

      qty: number;

      price: Prisma.Decimal;

      tax: Prisma.Decimal;

      discount: Prisma.Decimal;

      total: Prisma.Decimal;

      sortOrder: number;

    }[] = [];

    let subtotal = 0;
        for (let i = 0; i < itemNames.length; i++) {

      const itemName =
        itemNames[i]?.trim();

      if (!itemName) {
        continue;
      }

      const description =
        descriptions[i]?.trim() || null;

      const unit =
        units[i]?.trim() || null;

      const qty =
        Number(qtys[i]);

      const price =
        Number(prices[i]);

      if (qty <= 0) {
        throw new Error(
          `Quantity on row ${i + 1} must be greater than zero.`
        );
      }

      if (price < 0) {
        throw new Error(
          `Price on row ${i + 1} is invalid.`
        );
      }

      const lineTotal =
        qty * price;

      subtotal += lineTotal;

      items.push({

        itemName,

        description,

        unit,

        qty,

        price: new Prisma.Decimal(price),

        tax: new Prisma.Decimal(0),

        discount: new Prisma.Decimal(0),

        total: new Prisma.Decimal(lineTotal),

        sortOrder: i,

      });

    }

    if (items.length === 0) {
      throw new Error(
        "Please add at least one quote item."
      );
    }

    const total =
      subtotal -
      discount +
      tax;

    await prisma.$transaction(
      async (tx) => {

        await tx.quote.update({

          where: {

            id: currentQuote.id,

          },

          data: {

            customerId,

            validUntil: validUntilValue
              ? new Date(validUntilValue)
              : null,

            notes,

            terms,

            subtotal:
              new Prisma.Decimal(
                subtotal
              ),

            discount:
              new Prisma.Decimal(
                discount
              ),

            tax:
              new Prisma.Decimal(
                tax
              ),

            total:
              new Prisma.Decimal(
                total
              ),

            updatedById:
              userId,

          },

        });

        await tx.quoteItem.deleteMany({

          where: {

            quoteId:
              currentQuote.id,

          },

        });

        await tx.quoteItem.createMany({

          data: items.map(
            (item) => ({

              quoteId:
                currentQuote.id,

              itemName:
                item.itemName,

              description:
                item.description,

              unit:
                item.unit,

              qty:
                item.qty,

              price:
                item.price,

              tax:
                item.tax,

              discount:
                item.discount,

              total:
                item.total,

              sortOrder:
                item.sortOrder,

            })
          ),

        });

      }
    );

    redirect(
      `/quotes/${currentQuote.id}`
    );

  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Quote
          </h1>

          <p className="mt-2 text-slate-600">
            Update quotation details.
          </p>

        </div>

        <Link
          href={`/quotes/${quote.id}`}
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <form
        action={updateQuote}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Customer
              </label>

              <select
                name="customerId"
                defaultValue={
                  quote.customerId
                }
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                {customers.map(
                  (customer) => (

                    <option
                      key={
                        customer.id
                      }
                      value={
                        customer.id
                      }
                    >
                      {customer.companyName ??
                        [
                          customer.firstName,
                          customer.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                    </option>

                  )
                )}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Valid Until
              </label>

              <input
                type="date"
                name="validUntil"
                defaultValue={
                  quote.validUntil
                    ? quote.validUntil
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full rounded-xl border px-4 py-3"
              />

            </div>

          </div>

        </div>
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-2xl font-semibold">
            Quote Items
          </h2>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b bg-slate-50">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Item
                  </th>

                  <th className="px-4 py-3 text-left">
                    Description
                  </th>

                  <th className="px-4 py-3 text-left">
                    Unit
                  </th>

                  <th className="px-4 py-3 text-right">
                    Qty
                  </th>

                  <th className="px-4 py-3 text-right">
                    Price
                  </th>

                </tr>

              </thead>

              <tbody>

                {quote.items.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b last:border-b-0"
                  >

                    <td className="px-4 py-3">

                      <input
                        type="text"
                        name="itemName"
                        defaultValue={item.itemName}
                        required
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="text"
                        name="description"
                        defaultValue={item.description ?? ""}
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="text"
                        name="unit"
                        defaultValue={item.unit ?? ""}
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="number"
                        name="qty"
                        min={1}
                        defaultValue={item.qty}
                        required
                        className="w-full rounded-xl border px-4 py-3 text-right"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="number"
                        name="price"
                        min={0}
                        step="0.01"
                        defaultValue={Number(item.price)}
                        required
                        className="w-full rounded-xl border px-4 py-3 text-right"
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <div className="grid gap-8 lg:grid-cols-2">

            <div className="space-y-6">

              <div>

                <label className="mb-2 block font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows={5}
                  defaultValue={quote.notes ?? ""}
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Terms & Conditions
                </label>

                <textarea
                  name="terms"
                  rows={6}
                  defaultValue={quote.terms ?? ""}
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>

            </div>

            <div className="space-y-6">

              <div>

                <label className="mb-2 block font-medium">
                  Discount
                </label>

                <input
                  type="number"
                  name="discount"
                  min={0}
                  step="0.01"
                  defaultValue={Number(quote.discount ?? 0)}
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Tax
                </label>

                <input
                  type="number"
                  name="tax"
                  min={0}
                  step="0.01"
                  defaultValue={Number(quote.tax)}
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Current Subtotal
                  </span>

                  <span className="font-medium">
                    ${Number(quote.subtotal).toLocaleString()}
                  </span>

                </div>

                <div className="mt-2 flex justify-between">

                  <span className="text-slate-500">
                    Current Discount
                  </span>

                  <span>
                    ${Number(quote.discount ?? 0).toLocaleString()}
                  </span>

                </div>

                <div className="mt-2 flex justify-between">

                  <span className="text-slate-500">
                    Current Tax
                  </span>

                  <span>
                    ${Number(quote.tax).toLocaleString()}
                  </span>

                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-xl font-bold">

                  <span>
                    Current Total
                  </span>

                  <span>
                    ${Number(quote.total).toLocaleString()}
                  </span>

                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Totals will be recalculated automatically when the quote is saved.
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <Link
            href={`/quotes/${quote.id}`}
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  );

}