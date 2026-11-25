
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  canView,
  canEdit,
  canAssign,
  type Permission,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

const STAGES = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

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

  if (!dbUser.orgId) {
    redirect("/welcome");
  }

  const permissions: Permission[] =
    (dbUser.organizationRole?.permissions as Permission[]) ?? [];

  const isOwner =
    dbUser.organizationRole?.name?.toLowerCase() === "owner";

  if (!canView(permissions, "Pipeline", isOwner)) {
    redirect("/unauthorized");
  }

  if (!canEdit(permissions, "Pipeline", isOwner)) {
    redirect("/pipeline");
  }

  const { id } = await params;

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id,
      orgId: dbUser.orgId,
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

  const canAssignOwner =
    canAssign(permissions, "Pipeline", isOwner);

  const users = canAssignOwner
    ? await prisma.user.findMany({
        where: {
          orgId: dbUser.orgId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: "asc",
        },
      })
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div>
        <Link
          href={`/pipeline/${opportunity.id}`}
          className="text-slate-500 hover:text-orange-600"
        >
          ← Back to Opportunity
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mt-4">
          Edit Opportunity
        </h1>

        <p className="text-slate-500 mt-2">
          Update sales details, stage and assignment.
        </p>
      </div>

      <form
        action={`/api/opportunities/${opportunity.id}`}
        method="POST"
        className="bg-white border rounded-3xl p-6 md:p-8 space-y-6"
      >

        {/* Linked records */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 text-sm text-slate-500">
              Linked Lead
            </label>

            <div className="border rounded-xl p-3 bg-slate-50">
              {opportunity.lead ? (
                <Link
                  href={`/leads/${opportunity.lead.id}`}
                  className="font-medium text-orange-600"
                >
                  {opportunity.lead.firstName}{" "}
                  {opportunity.lead.lastName ?? ""}
                </Link>
              ) : (
                <span className="text-slate-500">
                  No linked lead
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-500">
              Linked Customer
            </label>

            <div className="border rounded-xl p-3 bg-slate-50">
              {opportunity.customer ? (
                <Link
                  href={`/customers/${opportunity.customer.id}`}
                  className="font-medium text-orange-600"
                >
                  {opportunity.customer.firstName}{" "}
                  {opportunity.customer.lastName ?? ""}
                </Link>
              ) : (
                <span className="text-slate-500">
                  No linked customer
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Title */}

        <div>
          <label className="block mb-2 font-medium">
            Opportunity Title
          </label>

          <input
            name="title"
            defaultValue={opportunity.title}
            required
            maxLength={200}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Stage and probability */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Sales Stage
            </label>

            <select
              name="stage"
              defaultValue={opportunity.stage}
              className="w-full border rounded-xl p-4"
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Probability %
            </label>

            <input
              type="number"
              name="probability"
              min={0}
              max={100}
              defaultValue={opportunity.probability ?? 10}
              className="w-full border rounded-xl p-4"
            />
          </div>

        </div>

        {/* Value and close date */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Estimated Value
            </label>

            <input
              type="number"
              name="value"
              min={0}
              step="0.01"
              defaultValue={opportunity.value ?? ""}
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Expected Close Date
            </label>

            <input
              type="date"
              name="expectedCloseDate"
              defaultValue={
                opportunity.expectedCloseDate
                  ? opportunity.expectedCloseDate
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

        </div>

        {/* Owner assignment */}

        <div>
          <label className="block mb-2 font-medium">
            Assigned Sales Representative
          </label>

          {canAssignOwner ? (
            <select
              name="ownerId"
              defaultValue={opportunity.ownerId ?? ""}
              className="w-full border rounded-xl p-4"
            >
              <option value="">
                Unassigned
              </option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                  {user.name && user.email
                    ? ` (${user.email})`
                    : ""}
                </option>
              ))}
            </select>
          ) : (
            <div className="border rounded-xl p-4 bg-slate-50">
              {opportunity.owner?.name || "Unassigned"}
              <p className="text-xs text-slate-500 mt-1">
                You do not have permission to change the assigned representative.
              </p>
            </div>
          )}

          <p className="text-xs text-slate-500 mt-2">
            Location: {opportunity.location?.name || "Not assigned"}
          </p>
        </div>

        {/* Description */}

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            rows={5}
            defaultValue={opportunity.description ?? ""}
            maxLength={5000}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Notes */}

        <div>
          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            rows={5}
            defaultValue={opportunity.notes ?? ""}
            maxLength={5000}
            className="w-full border rounded-xl p-4"
          />
        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-4 pt-3">

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
          >
            Save Changes
          </button>

          <Link
            href={`/pipeline/${opportunity.id}`}
            className="border px-8 py-4 rounded-2xl hover:bg-slate-50"
          >
            Cancel
          </Link>

        </div>

      </form>
    </div>
  );
}
