import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import { Prisma, QuoteStatus } from "@prisma/client";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateQuotePage() {

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  if (!orgId) {
    redirect("/login");
  }

const userId = session.user.id;

if (!userId) {
  throw new Error("User not found.");
}
  const customers = await prisma.customer.findMany({

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

  });

  async function createQuote(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId = (session.user as any).orgId;

    const userId = session.user.id;

if (!userId) {
  throw new Error("User not found.");
}

    const customerId =
      formData.get("customerId")?.toString().trim() ?? "";

    const validUntilValue =
      formData.get("validUntil")?.toString() ?? "";


  const notes =
  formData.get("notes")?.toString().trim() || null;

const terms =
  formData.get("terms")?.toString().trim() || null;

const discount =
  Number(formData.get("discount") ?? 0);

    const tax =
      Number(formData.get("tax") ?? 0);

    const itemNames =
      formData.getAll("itemName") as string[];

    const qtys =
      formData.getAll("qty") as string[];

    const prices =
      formData.getAll("price") as string[];


const descriptions =
  formData.getAll("description") as string[];

const units =
  formData.getAll("unit") as string[];

    if (!customerId) {
      throw new Error("Customer is required.");
    }

    if (itemNames.length === 0) {
      throw new Error(
        "Please add at least one quote item."
      );
    }

    const customer =
      await prisma.customer.findFirst({

        where: {
          id: customerId,
          orgId,
        },

      });

    if (!customer) {
      throw new Error("Customer not found.");
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

}[] = [];

    let subtotal = 0;

    for (let i = 0; i < itemNames.length; i++) {

      const itemName =
        itemNames[i]?.trim();

        const description =
  descriptions[i]?.trim() || null;

const unit =
  units[i]?.trim() || null;

      const qty =
        Number(qtys[i]);

      const price =
        Number(prices[i]);

      if (!itemName) {
        continue;
      }

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

});

    }

    if (items.length === 0) {
      throw new Error(
        "Please add at least one valid item."
      );
    }

    const total =
  subtotal - discount + tax;

    const today =
      new Date();

    const prefix =
      `QT-${today.getFullYear()}${String(
        today.getMonth() + 1
      ).padStart(2, "0")}${String(
        today.getDate()
      ).padStart(2, "0")}`;
          const existingCount =
      await prisma.quote.count({

        where: {

          orgId,

          quoteNumber: {

            startsWith: prefix,

          },

        },

      });

    const quoteNumber =
      `${prefix}-${String(
        existingCount + 1
      ).padStart(4, "0")}`;

    await prisma.$transaction(async (tx) => {

      const quote =
        await tx.quote.create({

          data: {

  orgId,

  customerId,

  createdById: userId,

  updatedById: userId,

  quoteNumber,

  status: QuoteStatus.draft,

  validUntil: validUntilValue
    ? new Date(validUntilValue)
    : null,

  notes,

  terms,

  discount: new Prisma.Decimal(discount),

  subtotal: new Prisma.Decimal(subtotal),

  tax: new Prisma.Decimal(tax),

  total: new Prisma.Decimal(total),

},

        });

      await tx.quoteItem.createMany({

        data: items.map((item, index) => ({

  quoteId: quote.id,

  itemName: item.itemName,

  description: null,

  unit: null,

  qty: item.qty,

  price: item.price,

  tax: new Prisma.Decimal(0),

  discount: new Prisma.Decimal(0),

  total: item.total,

  sortOrder: index,

})),

      });

    });

    redirect("/quotes");

  }

  return (

    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Create Quote
          </h1>

          <p className="mt-2 text-slate-600">
            Create a quotation for a customer.
          </p>

        </div>

        <Link
          href="/quotes"
          className="rounded-xl border px-6 py-3 hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={createQuote}
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
                required
                className="w-full rounded-xl border px-4 py-3"
              >

                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.companyName ??
                      [
                        customer.firstName,
                        customer.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Valid Until
              </label>

              <input
                type="date"
                name="validUntil"
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
                    Item / Service
                  </th>

                  <th className="px-4 py-3 w-32 text-left">
                    Qty
                  </th>

                  <th className="px-4 py-3 w-40 text-left">
                    Unit Price
                  </th>

                </tr>

              </thead>

              <tbody>

                {Array.from({ length: 10 }).map((_, index) => (

                  <tr
                    key={index}
                    className="border-b last:border-b-0"
                  >

                    <td className="px-4 py-3">

                      <input
                        type="text"
                        name="itemName"
                        placeholder="Item or Service"
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="number"
                        name="qty"
                        min={1}
                        defaultValue={1}
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                    <td className="px-4 py-3">

                      <input
                        type="number"
                        name="price"
                        min={0}
                        step="0.01"
                        defaultValue={0}
                        className="w-full rounded-xl border px-4 py-3"
                      />

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div />

            <div className="space-y-5">

              <div>

                <label className="mb-2 block font-medium">
                  Tax
                </label>

                <input
                  type="number"
                  name="tax"
                  min={0}
                  step="0.01"
                  defaultValue={0}
                  className="w-full rounded-xl border px-4 py-3"
                />

              </div>

              <div>

  <label className="mb-2 block font-medium">
    Discount
  </label>

  <input
    type="number"
    name="discount"
    defaultValue={0}
    min={0}
    step="0.01"
    className="w-full rounded-xl border px-4 py-3"
  />

</div>

<div>

  <label className="mb-2 block font-medium">
    Notes
  </label>

  <textarea
    name="notes"
    rows={4}
    className="w-full rounded-xl border px-4 py-3"
  />

</div>

<div>

  <label className="mb-2 block font-medium">
    Terms & Conditions
  </label>

  <textarea
    name="terms"
    rows={5}
    className="w-full rounded-xl border px-4 py-3"
  />

</div>

              <div className="rounded-2xl bg-slate-50 p-5">

                <p className="text-sm text-slate-500">
                  Quote Summary
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  • Subtotal is calculated automatically when the quote
                  is saved.
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  • Tax is added to the subtotal.
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  • Total is stored with the quote.
                </p>

              </div>

            </div>



          </div>

        </div>

        <div className="flex items-center justify-end gap-4">

          <Link
            href="/quotes"
            className="rounded-xl border px-6 py-3 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Create Quote
          </button>

        </div>

      </form>

    </div>

  );

}