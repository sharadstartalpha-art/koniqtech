
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  canView,
  canEdit,
  canDelete,
  type Permission,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const orgId = dbUser.orgId;

  if (!orgId) {
    redirect("/welcome");
  }

  const permissions: Permission[] =
    (dbUser.organizationRole?.permissions as Permission[]) ?? [];

  const isOwner =
    dbUser.organizationRole?.name?.toLowerCase() === "owner";

  if (!canView(permissions, "Pipeline", isOwner)) {
    redirect("/unauthorized");
  }

  const { id } = await params;

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      customer: true,
      lead: true,
      owner: true,
      location: true,
    },
  });

  if (!opportunity) {
    notFound();
  }

  const badgeColor: Record<string, string> = {
    new: "bg-slate-100 text-slate-700",
    qualified: "bg-blue-100 text-blue-700",
    proposal: "bg-yellow-100 text-yellow-700",
    negotiation: "bg-purple-100 text-purple-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  const currentBadge =
    badgeColor[opportunity.stage] ??
    "bg-slate-100 text-slate-700";

  const notes = [
    opportunity.description,
    opportunity.notes,
  ].filter(
    (value, index, array): value is string =>
      Boolean(value) && array.indexOf(value) === index
  );

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

        <div>
          <Link
            href="/pipeline"
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Pipeline
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold mt-4 break-words">
            {opportunity.title}
          </h1>

          <p className="text-slate-500 mt-2">
            Opportunity Details
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {canEdit(permissions, "Pipeline", isOwner) && (
            <Link
              href={`/pipeline/${opportunity.id}/edit`}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
            >
              Edit Opportunity
            </Link>
          )}

          {canDelete(permissions, "Pipeline", isOwner) && (
            <Link
              href={`/pipeline/${opportunity.id}/delete`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
            >
              Delete
            </Link>
          )}

        </div>
      </div>

      {/* Summary */}

      <div className="bg-white border rounded-3xl p-6 md:p-8">

        <h2 className="text-xl font-bold mb-6">
          Opportunity Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          <div>
            <p className="text-slate-500 text-sm">
              Estimated Value
            </p>

            <p className="font-bold text-2xl text-green-600 mt-1">
              ${(opportunity.value ?? 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Stage
            </p>

            <span
              className={`inline-flex mt-2 px-4 py-2 rounded-full text-sm capitalize ${currentBadge}`}
            >
              {opportunity.stage}
            </span>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Probability
            </p>

            <p className="font-semibold text-xl mt-1">
              {opportunity.probability ?? 0}%
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Expected Close
            </p>

            <p className="font-semibold mt-1">
              {opportunity.expectedCloseDate
                ? opportunity.expectedCloseDate.toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Created
            </p>

            <p className="font-semibold mt-1">
              {opportunity.createdAt.toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Last Updated
            </p>

            <p className="font-semibold mt-1">
              {opportunity.updatedAt.toLocaleDateString()}
            </p>
          </div>

        </div>
      </div>

      {/* Lead and Customer */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white border rounded-3xl p-7">

          <h2 className="text-xl font-bold mb-5">
            Lead Information
          </h2>

          {opportunity.lead ? (
            <div className="space-y-3">

              <div>
                <p className="text-xs text-slate-500">
                  Lead Name
                </p>

                <p className="font-semibold">
                  {opportunity.lead.firstName}{" "}
                  {opportunity.lead.lastName ?? ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Company
                </p>

                <p className="font-medium">
                  {opportunity.lead.companyName || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="font-medium">
                  {opportunity.lead.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Phone
                </p>

                <p className="font-medium">
                  {opportunity.lead.phone || "-"}
                </p>
              </div>

              <Link
                href={`/leads/${opportunity.lead.id}`}
                className="inline-flex text-orange-600 hover:text-orange-700 font-medium mt-3"
              >
                View Lead →
              </Link>

            </div>
          ) : (
            <p className="text-slate-500">
              No lead linked to this opportunity.
            </p>
          )}

        </div>

        <div className="bg-white border rounded-3xl p-7">

          <h2 className="text-xl font-bold mb-5">
            Customer Information
          </h2>

          {opportunity.customer ? (
            <div className="space-y-3">

              <div>
                <p className="text-xs text-slate-500">
                  Customer Name
                </p>

                <p className="font-semibold">
                  {opportunity.customer.firstName}{" "}
                  {opportunity.customer.lastName ?? ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Company
                </p>

                <p className="font-medium">
                  {opportunity.customer.companyName || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="font-medium">
                  {opportunity.customer.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Phone
                </p>

                <p className="font-medium">
                  {opportunity.customer.phone || "-"}
                </p>
              </div>

              <Link
                href={`/customers/${opportunity.customer.id}`}
                className="inline-flex text-orange-600 hover:text-orange-700 font-medium mt-3"
              >
                View Customer →
              </Link>

            </div>
          ) : (
            <p className="text-slate-500">
              No customer linked to this opportunity.
            </p>
          )}

        </div>

      </div>

      {/* Assignment */}

      <div className="bg-white border rounded-3xl p-7">

        <h2 className="text-xl font-bold mb-5">
          Assignment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">
              Assigned Sales Representative
            </p>

            <p className="font-semibold mt-1">
              {opportunity.owner?.name || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Organization Location
            </p>

            <p className="font-semibold mt-1">
              {opportunity.location?.name || "Not assigned"}
            </p>
          </div>

        </div>

      </div>

      {/* Notes */}

      <div className="bg-white border rounded-3xl p-7">

        <h2 className="text-xl font-bold mb-5">
          Notes and Description
        </h2>

        {notes.length > 0 ? (
          <div className="space-y-5">

            {notes.map((note, index) => (
              <div
                key={index}
                className="whitespace-pre-wrap text-slate-700 border-l-2 border-orange-500 pl-4"
              >
                {note}
              </div>
            ))}

          </div>
        ) : (
          <p className="text-slate-500">
            No notes or description available.
          </p>
        )}

      </div>

      {/* Quick Actions */}

      <div className="bg-white border rounded-3xl p-7">

        <h2 className="text-xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            href={`/quotes/create?opportunityId=${opportunity.id}`}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Quote
          </Link>

          {opportunity.customerId && (
            <Link
              href={`/customers/${opportunity.customerId}`}
              className="px-5 py-3 rounded-xl border hover:bg-slate-50"
            >
              View Customer
            </Link>
          )}

          {opportunity.leadId && (
            <Link
              href={`/leads/${opportunity.leadId}`}
              className="px-5 py-3 rounded-xl border hover:bg-slate-50"
            >
              View Lead
            </Link>
          )}

        </div>

      </div>

      {/* Record ID */}

      <div className="text-xs text-slate-400">
        Opportunity ID: {opportunity.id}
      </div>

    </div>
  );
}
