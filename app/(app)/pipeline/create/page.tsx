
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  canCreate,
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

async function createOpportunity(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user?.orgId) {
    redirect("/welcome");
  }

  const permissions: Permission[] =
    (user.organizationRole?.permissions as Permission[]) ?? [];

  const isOwner =
    user.organizationRole?.name?.toLowerCase() === "owner";

  if (!canCreate(permissions, "Pipeline", isOwner)) {
    redirect("/pipeline?error=permission");
  }

  const title = String(formData.get("title") || "").trim();
  const leadId = String(formData.get("leadId") || "").trim();
  const submittedCustomerId =
    String(formData.get("customerId") || "").trim();

  const valueText = String(formData.get("value") || "").trim();
  const stage = String(formData.get("stage") || "new");
  const probabilityText =
    String(formData.get("probability") || "10").trim();
  const expectedCloseText =
    String(formData.get("expectedClose") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!title) {
    redirect("/pipeline/create?error=title");
  }

  if (!STAGES.includes(stage as (typeof STAGES)[number])) {
    redirect("/pipeline/create?error=stage");
  }

  const value = valueText === "" ? null : Number(valueText);
  const probability = Number(probabilityText);

  if (
    (value !== null && (!Number.isFinite(value) || value < 0)) ||
    !Number.isFinite(probability) ||
    probability < 0 ||
    probability > 100
  ) {
    redirect("/pipeline/create?error=number");
  }

  const expectedCloseDate = expectedCloseText
    ? new Date(`${expectedCloseText}T00:00:00`)
    : null;

  if (
    expectedCloseDate &&
    Number.isNaN(expectedCloseDate.getTime())
  ) {
    redirect("/pipeline/create?error=date");
  }

  let customerId: string | null = null;
  let locationId: string | null = null;
  let ownerId: string | null = null;

  if (leadId) {
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        orgId: user.orgId,
      },
    });

    if (!lead) {
      redirect("/pipeline/create?error=lead");
    }

    const customer = await prisma.customer.findFirst({
      where: {
        leadId: lead.id,
        orgId: user.orgId,
      },
    });

    customerId = customer?.id ?? null;
    locationId = lead.locationId;
    ownerId = lead.assignedToId ?? null;
  } else if (submittedCustomerId) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: submittedCustomerId,
        orgId: user.orgId,
      },
    });

    if (!customer) {
      redirect("/pipeline/create?error=customer");
    }

    customerId = customer.id;
    locationId = customer.locationId;
  }

  await prisma.opportunity.create({
    data: {
      orgId: user.orgId,
      leadId: leadId || null,
      customerId,
      locationId,
      ownerId,
      title,
      value,
      stage,
      probability,
      expectedCloseDate,
      notes: notes || null,
    },
  });

  redirect("/pipeline");
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; error?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user?.orgId) {
    redirect("/welcome");
  }

  const permissions: Permission[] =
    (user.organizationRole?.permissions as Permission[]) ?? [];

  const isOwner =
    user.organizationRole?.name?.toLowerCase() === "owner";

  if (!canCreate(permissions, "Pipeline", isOwner)) {
    redirect("/pipeline");
  }

  const params = await searchParams;
  const leadId = params.leadId || "";
  const error = params.error || "";

  const lead = leadId
    ? await prisma.lead.findFirst({
        where: {
          id: leadId,
          orgId: user.orgId,
        },
      })
    : null;

  if (leadId && !lead) {
    notFound();
  }

  const leadCustomer = lead
    ? await prisma.customer.findFirst({
        where: {
          leadId: lead.id,
          orgId: user.orgId,
        },
      })
    : null;

  const customers = lead
    ? []
    : await prisma.customer.findMany({
        where: {
          orgId: user.orgId,
        },
        orderBy: {
          firstName: "asc",
        },
      });

  return (
    <form
      action={createOpportunity}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <Link
          href={lead ? `/leads/${lead.id}` : "/pipeline"}
          className="text-slate-500 hover:text-orange-600"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          New Opportunity
        </h1>

        <p className="text-slate-500 mt-2">
          Create and track a new sales opportunity.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error === "permission"
            ? "You do not have permission to create opportunities."
            : error === "customer"
              ? "The selected customer could not be found in your organization."
              : error === "lead"
                ? "The selected lead could not be found."
                : error === "title"
                  ? "Please enter an opportunity title."
                  : "Please check the submitted information and try again."}
        </div>
      )}

      {lead && (
        <input
          type="hidden"
          name="leadId"
          value={lead.id}
        />
      )}

      <div className="bg-white border rounded-3xl p-8 space-y-6">
        <div>
          <label className="block mb-2 font-medium">
            {lead ? "Linked Lead" : "Customer"}
          </label>

          {lead ? (
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="font-semibold">
                {lead.firstName} {lead.lastName}
              </p>
              <p className="text-sm text-slate-500">
                {lead.companyName || lead.email || "Lead"}
              </p>

              {leadCustomer ? (
                <p className="text-sm text-green-700 mt-2">
                  Customer record linked automatically.
                </p>
              ) : (
                <p className="text-sm text-amber-700 mt-2">
                  No customer record yet. This opportunity will be
                  linked directly to the lead.
                </p>
              )}
            </div>
          ) : (
            <select
              name="customerId"
              defaultValue=""
              className="w-full border rounded-xl p-3"
            >
              <option value="">Select Customer</option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.firstName} {customer.lastName ?? ""}
                  {customer.companyName
                    ? ` (${customer.companyName})`
                    : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Opportunity Title
          </label>

          <input
            name="title"
            required
            maxLength={200}
            className="w-full border rounded-xl p-3"
            placeholder="Roof Replacement"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">
              Estimated Value
            </label>

            <input
              type="number"
              name="value"
              min="0"
              step="0.01"
              className="w-full border rounded-xl p-3"
              placeholder="5000"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Expected Close
            </label>

            <input
              type="date"
              name="expectedClose"
              className="w-full border rounded-xl p-3"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">
              Stage
            </label>

            <select
              name="stage"
              defaultValue="new"
              className="w-full border rounded-xl p-3"
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
              defaultValue={10}
              min={0}
              max={100}
              className="w-full border rounded-xl p-3"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Notes
          </label>

          <textarea
            name="notes"
            rows={6}
            maxLength={5000}
            className="w-full border rounded-xl p-3"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
      >
        Create Opportunity
      </button>
    </form>
  );
}
