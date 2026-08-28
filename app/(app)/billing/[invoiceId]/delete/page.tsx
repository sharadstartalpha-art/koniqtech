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

export default async function DeleteInvoicePage({
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

  const invoice =
    await prisma.invoice.findFirst({

      where: {

        id: invoiceId,

        orgId,

      },

      include: {

        customer: {

          select: {

            id: true,

            companyName: true,

            firstName: true,

            lastName: true,

          },

        },

        job: {

          select: {

            id: true,

            title: true,

          },

        },

        payments: {

          select: {

            id: true,

          },

        },

      },

    });

  if (!invoice) {
    notFound();
  }

  const currentInvoice =
    invoice;

  async function deleteInvoice() {
    "use server";

    const session =
      await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }

    const orgId =
      session.user.orgId;

    const existing =
      await prisma.invoice.findFirst({

        where: {

          id: currentInvoice.id,

          orgId,

        },

        include: {

          payments: {

            select: {

              id: true,

            },

          },

        },

      });

    if (!existing) {
      notFound();
    }

    if (existing.payments.length > 0) {

      throw new Error(
        "This invoice cannot be deleted because it has recorded payments."
      );

    }

        await prisma.invoice.delete({

      where: {

        id: existing.id,

      },

    });

    redirect("/billing");

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold text-red-600">
            Delete Invoice
          </h1>

          <p className="mt-2 text-slate-600">
            This action cannot be undone.
          </p>

        </div>

        <Link
          href={`/billing/${currentInvoice.id}`}
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
        >
          Cancel
        </Link>

      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">

        <h2 className="mb-6 text-2xl font-bold text-red-700">
          Are you sure you want to delete this invoice?
        </h2>

        <dl className="grid gap-6 md:grid-cols-2">

          <div>

            <dt className="text-sm text-slate-500">
              Invoice Number
            </dt>

            <dd className="mt-1 font-semibold">
              {currentInvoice.invoiceNumber}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Customer
            </dt>

            <dd className="mt-1 font-semibold">
              {currentInvoice.customer.companyName ||
                `${currentInvoice.customer.firstName} ${currentInvoice.customer.lastName ?? ""}`}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Job
            </dt>

            <dd className="mt-1 font-semibold">
              {currentInvoice.job.title}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Status
            </dt>

            <dd className="mt-1">
              {currentInvoice.status}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Total
            </dt>

            <dd className="mt-1 font-semibold">
              ₹{Number(currentInvoice.total).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>

          </div>

          <div>

            <dt className="text-sm text-slate-500">
              Due Date
            </dt>

            <dd className="mt-1">
              {currentInvoice.dueDate
                ? currentInvoice.dueDate.toLocaleDateString()
                : "-"}
            </dd>

          </div>

        </dl>

        {currentInvoice.payments.length === 0 ? (

          <div className="mt-8">

                        <form action={deleteInvoice}>

              <div className="flex flex-wrap gap-4">

                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
                >
                  Delete Invoice
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

        ) : (

          <div className="mt-8 rounded-2xl border border-yellow-300 bg-yellow-50 p-6">

            <h3 className="text-lg font-semibold text-yellow-800">
              Invoice cannot be deleted
            </h3>

            <p className="mt-2 text-yellow-700">
              This invoice has
              {" "}
              <strong>
                {currentInvoice.payments.length}
              </strong>
              {" "}
              recorded payment
              {currentInvoice.payments.length === 1 ? "" : "s"}.
              Remove or reverse all payments before deleting this invoice.
            </p>

            <div className="mt-6">

              <Link
                href={`/billing/${currentInvoice.id}`}
                className="inline-flex rounded-xl border border-slate-300 bg-white px-6 py-3 font-medium hover:bg-slate-50"
              >
                Back to Invoice
              </Link>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}