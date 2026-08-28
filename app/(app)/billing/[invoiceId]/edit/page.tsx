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
    invoiceId: string;
  }>;
}

export default async function EditInvoicePage({
  params,
}: PageProps) {

  const { invoiceId } =
    await params;

  const session =
    await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId =
    session.user.orgId;

  const [

    invoice,

    customers,

    jobs,

  ] = await Promise.all([

    prisma.invoice.findFirst({

      where: {

        id: invoiceId,

        orgId,

      },

    }),

    prisma.customer.findMany({

      where: {

        orgId,

      },

      orderBy: {

        companyName: "asc",

      },

      select: {

        id: true,

        companyName: true,

        firstName: true,

        lastName: true,

      },

    }),

    prisma.job.findMany({

      where: {

        orgId,

      },

      orderBy: {

        title: "asc",

      },

      select: {

        id: true,

        title: true,

      },

    }),

  ]);

  if (!invoice) {
    notFound();
  }

  const currentInvoice =
    invoice;

  async function updateInvoice(
    formData: FormData,
  ) {
    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const orgId =
      session.user.orgId;

    const invoiceNumber =
      formData.get("invoiceNumber")?.toString().trim() ?? "";

    const customerId =
      formData.get("customerId")?.toString() ?? "";

    const jobId =
      formData.get("jobId")?.toString() ?? "";

    const subtotal =
      Number(formData.get("subtotal") ?? 0);

    const tax =
      Number(formData.get("tax") ?? 0);

    const total =
      Number(formData.get("total") ?? 0);

    const dueDateValue =
      formData.get("dueDate")?.toString() ?? "";

    const status =
      formData.get("status")?.toString() ?? "draft";

    if (!invoiceNumber) {
      throw new Error(
        "Invoice number is required."
      );
    }

    if (!customerId) {
      throw new Error(
        "Customer is required."
      );
    }

    if (!jobId) {
      throw new Error(
        "Job is required."
      );
    }

    const dueDate =
      dueDateValue
        ? new Date(dueDateValue)
        : null;

    if (
      dueDate &&
      Number.isNaN(dueDate.getTime())
    ) {
      throw new Error(
        "Invalid due date."
      );
    }

        if (
      dueDate &&
      Number.isNaN(dueDate.getTime())
    ) {
      throw new Error(
        "Invalid due date."
      );
    }
    

        const customer =
      await prisma.customer.findFirst({

        where: {

          id: customerId,

          orgId,

        },

        select: {

          id: true,

        },

      });

    if (!customer) {
      throw new Error(
        "Customer not found."
      );
    }

    const job =
      await prisma.job.findFirst({

        where: {

          id: jobId,

          orgId,

        },

        select: {

          id: true,

        },

      });

    if (!job) {
      throw new Error(
        "Job not found."
      );
    }

    await prisma.invoice.update({

      where: {

        id: currentInvoice.id,

      },

      data: {

        invoiceNumber,

        customerId,

        jobId,

        subtotal,

        tax,

        total,

        dueDate,

        status,

      },

    });

    redirect(`/billing/${currentInvoice.id}`);

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Invoice
          </h1>

          <p className="mt-2 text-slate-600">
            Update invoice information.
          </p>

        </div>

        <Link
          href={`/billing/${currentInvoice.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={updateInvoice}
        className="rounded-3xl border bg-white p-8"
      >

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Invoice Number *
            </label>

            <input
              name="invoiceNumber"
              required
              defaultValue={currentInvoice.invoiceNumber}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue={currentInvoice.status}
              className="w-full rounded-xl border px-4 py-3"
            >

              <option value="draft">
                Draft
              </option>

              <option value="sent">
                Sent
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="overdue">
                Overdue
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Customer *
            </label>

            <select
              name="customerId"
              required
              defaultValue={currentInvoice.customerId}
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
                  {customer.companyName ||
                    `${customer.firstName} ${customer.lastName ?? ""}`}
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Job *
            </label>

            <select
              name="jobId"
              required
              defaultValue={currentInvoice.jobId}
              className="w-full rounded-xl border px-4 py-3"
            >

              <option value="">
                Select Job
              </option>

              {jobs.map((job) => (

                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title}
                </option>

              ))}

            </select>

          </div>

                    <div>

            <label className="mb-2 block text-sm font-medium">
              Subtotal *
            </label>

            <input
              type="number"
              name="subtotal"
              step="0.01"
              min="0"
              required
              defaultValue={Number(currentInvoice.subtotal)}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Tax
            </label>

            <input
              type="number"
              name="tax"
              step="0.01"
              min="0"
              defaultValue={Number(currentInvoice.tax)}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Total *
            </label>

            <input
              type="number"
              name="total"
              step="0.01"
              min="0"
              required
              defaultValue={Number(currentInvoice.total)}
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Due Date
            </label>

            <input
              type="date"
              name="dueDate"
              defaultValue={
                currentInvoice.dueDate
                  ? currentInvoice.dueDate
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

        </div>

        <div className="mt-8 flex items-center gap-4">

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Save Changes
          </button>

          <Link
            href={`/billing/${currentInvoice.id}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>

  );

}