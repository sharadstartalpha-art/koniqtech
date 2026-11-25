
import prisma from "@/shared/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  canCreate,
  canView,
  type Permission,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

const stages = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

type SearchParams = {
  ownerId?: string;
  locationId?: string;
  stage?: string;
  from?: string;
  to?: string;
};

function getValidDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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

  const params = await searchParams;

  const ownerId = params.ownerId || "";
  const locationId = params.locationId || "";
  const selectedStage = stages.includes(
    params.stage as (typeof stages)[number]
  )
    ? params.stage!
    : "";

  const fromDate = getValidDate(params.from);
  const toDate = getValidDate(params.to);

  const dateRangeIsValid =
    !fromDate || !toDate || fromDate <= toDate;

  const where = {
    orgId,

    ...(ownerId ? { ownerId } : {}),

    ...(locationId ? { locationId } : {}),

    ...(selectedStage ? { stage: selectedStage } : {}),

    ...(dateRangeIsValid && (fromDate || toDate)
      ? {
          expectedCloseDate: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate
              ? {
                  lte: new Date(
                    toDate.getTime() + 24 * 60 * 60 * 1000 - 1
                  ),
                }
              : {}),
          },
        }
      : {}),
  };

  const [opportunities, users, locations] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      include: {
        customer: true,
        lead: true,
        owner: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.organizationLocation.findMany({
      where: {
        orgId,
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const openOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.stage !== "won" &&
      opportunity.stage !== "lost"
  );

  const openPipelineValue = openOpportunities.reduce(
    (sum, opportunity) => sum + (opportunity.value ?? 0),
    0
  );

  const weightedPipelineValue = openOpportunities.reduce(
    (sum, opportunity) =>
      sum +
      (opportunity.value ?? 0) *
        ((opportunity.probability ?? 0) / 100),
    0
  );

  const wonOpportunities = opportunities.filter(
    (opportunity) => opportunity.stage === "won"
  );

  const lostOpportunities = opportunities.filter(
    (opportunity) => opportunity.stage === "lost"
  );

  const wonValue = wonOpportunities.reduce(
    (sum, opportunity) => sum + (opportunity.value ?? 0),
    0
  );

  const hasFilters = Boolean(
    ownerId ||
    locationId ||
    selectedStage ||
    params.from ||
    params.to
  );

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Sales Pipeline
          </h1>

          <p className="text-slate-500 mt-2">
            Track sales opportunities through every stage.
          </p>
        </div>

        {canCreate(permissions, "Pipeline", isOwner) && (
          <Link
            href="/pipeline/create"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl text-center"
          >
            New Opportunity
          </Link>
        )}

      </div>

      {/* Filters */}

      <form
        method="GET"
        action="/pipeline"
        className="bg-white border rounded-3xl p-6 space-y-5"
      >

        <div>
          <h2 className="text-lg font-bold">
            Pipeline Filters
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Filter opportunities by representative, location, stage and closing date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          <div>
            <label className="block text-sm font-medium mb-2">
              Sales Representative
            </label>

            <select
              name="ownerId"
              defaultValue={ownerId}
              className="w-full border rounded-xl p-3"
            >
              <option value="">All Representatives</option>

              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>

            <select
              name="locationId"
              defaultValue={locationId}
              className="w-full border rounded-xl p-3"
            >
              <option value="">All Locations</option>

              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stage
            </label>

            <select
              name="stage"
              defaultValue={selectedStage}
              className="w-full border rounded-xl p-3"
            >
              <option value="">All Stages</option>

              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Expected Close From
            </label>

            <input
              type="date"
              name="from"
              defaultValue={params.from || ""}
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Expected Close To
            </label>

            <input
              type="date"
              name="to"
              defaultValue={params.to || ""}
              className="w-full border rounded-xl p-3"
            />
          </div>

        </div>

        {!dateRangeIsValid && (
          <p className="text-sm text-red-600">
            The closing date range is invalid. Please check the dates.
          </p>
        )}

        <div className="flex flex-wrap gap-3">

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl"
          >
            Apply Filters
          </button>

          {hasFilters && (
            <Link
              href="/pipeline"
              className="border px-6 py-3 rounded-xl hover:bg-slate-50"
            >
              Clear Filters
            </Link>
          )}

        </div>

      </form>

      {/* Summary */}

      <div className="bg-white border rounded-3xl p-6">

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">

          <div>
            <p className="text-slate-500 text-sm">
              Total Opportunities
            </p>

            <h2 className="text-3xl font-bold">
              {opportunities.length}
            </h2>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Open Pipeline Value
            </p>

            <h2 className="text-2xl font-bold text-green-600">
              ${openPipelineValue.toLocaleString()}
            </h2>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Weighted Pipeline
            </p>

            <h2 className="text-2xl font-bold text-blue-600">
              ${weightedPipelineValue.toLocaleString(
                undefined,
                { maximumFractionDigits: 2 }
              )}
            </h2>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Won Opportunities
            </p>

            <h2 className="text-3xl font-bold">
              {wonOpportunities.length}
            </h2>

            <p className="text-xs text-green-600 mt-1">
              Won value: ${wonValue.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">
              Lost Opportunities
            </p>

            <h2 className="text-3xl font-bold">
              {lostOpportunities.length}
            </h2>
          </div>

        </div>

      </div>

      {/* Pipeline Stages */}

      <div className="overflow-x-auto pb-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-5 min-w-[900px]">

          {stages.map((stage) => {
            const items = opportunities.filter(
              (opportunity) =>
                (opportunity.stage ?? "new") === stage
            );

            return (
              <div
                key={stage}
                className="bg-slate-50 border rounded-3xl p-4 min-h-[500px]"
              >

                <div className="flex justify-between items-center mb-5">

                  <h2 className="font-bold capitalize">
                    {stage}
                  </h2>

                  <span className="bg-white border rounded-full px-3 py-1 text-sm">
                    {items.length}
                  </span>

                </div>

                <div className="space-y-4">

                  {items.length === 0 && (
                    <div className="border border-dashed rounded-xl p-4 text-center text-slate-400 text-sm">
                      No Opportunities
                    </div>
                  )}

                  {items.map((opportunity) => (
                    <Link
                      key={opportunity.id}
                      href={`/pipeline/${opportunity.id}`}
                      className="block bg-white border rounded-2xl p-4 hover:shadow-lg hover:border-orange-300 transition"
                    >

                      <div className="font-semibold text-base break-words">
                        {opportunity.title}
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-slate-400">
                          Customer
                        </p>

                        <p className="text-sm text-slate-700">
                          {opportunity.customer
                            ? `${opportunity.customer.firstName} ${opportunity.customer.lastName ?? ""}`
                            : "No Customer"}
                        </p>
                      </div>

                      {opportunity.lead && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-400">
                            Original Lead
                          </p>

                          <p className="text-sm text-slate-700">
                            {opportunity.lead.firstName}{" "}
                            {opportunity.lead.lastName ?? ""}
                          </p>
                        </div>
                      )}

                      <div className="mt-3">
                        <p className="text-xs text-slate-400">
                          Assigned Owner
                        </p>

                        <p className="text-sm text-slate-700">
                          {opportunity.owner?.name || "Unassigned"}
                        </p>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-slate-400">
                          Location
                        </p>

                        <p className="text-sm text-slate-700">
                          {opportunity.location?.name || "Not assigned"}
                        </p>
                      </div>

                      <div className="mt-4 font-bold text-green-600">
                        ${(opportunity.value ?? 0).toLocaleString()}
                      </div>

                      <div className="text-xs text-slate-400 mt-2">
                        Expected Close:{" "}
                        {opportunity.expectedCloseDate
                          ? opportunity.expectedCloseDate.toLocaleDateString()
                          : "-"}
                      </div>

                      <div className="text-xs text-slate-500 mt-2">
                        Probability: {opportunity.probability ?? 0}%
                      </div>

                      <div className="mt-3">
                        <span className="inline-flex bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs capitalize">
                          {opportunity.stage}
                        </span>
                      </div>

                    </Link>
                  ))}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}
